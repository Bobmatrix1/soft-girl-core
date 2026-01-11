import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from './ui/button';
import { uploadFile } from '../utils/api';
import { toast } from 'sonner';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  accept?: string;
  maxSizeMB?: number;
}

export default function ImageUpload({ 
  value, 
  onChange, 
  label = 'Upload Image',
  accept = 'image/*',
  maxSizeMB = 10
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast.error(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      toast.error('Please select an image or video file');
      return;
    }

    try {
      setUploading(true);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload file
      const url = await uploadFile(file);
      onChange(url);
      setPreview(url);
      toast.success('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(undefined);
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isVideo = (url: string) => {
      return url.match(/\.(mp4|webm|ogg)$/i) || url.includes('video');
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        id={`image-upload-${label}`}
      />
      
      {preview ? (
        <div className="relative group">
          <div className="relative w-full h-48 rounded-xl overflow-hidden border border-pink-200 bg-pink-50">
            {isVideo(preview) ? (
                 <video src={preview} className="w-full h-full object-cover" controls muted />
            ) : (
                <img 
                src={preview} 
                alt="Preview" 
                className="w-full h-full object-cover"
                />
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4 mr-1" />
                Change
              </Button>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={handleRemove}
              >
                <X className="w-4 h-4 mr-1" />
                Remove
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <label
          htmlFor={`image-upload-${label}`}
          className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-pink-200 rounded-xl cursor-pointer bg-pink-50 hover:bg-pink-100 transition-colors"
        >
          <div className="flex flex-col items-center justify-center py-6">
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-200 border-t-primary mb-3" />
                <p className="text-sm text-muted-foreground">Uploading...</p>
              </>
            ) : (
              <>
                <ImageIcon className="w-12 h-12 text-pink-300 mb-3" />
                <p className="mb-1 text-sm">
                  <span className="font-semibold text-primary">{label}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Click to browse or drag and drop
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Max size: {maxSizeMB}MB
                </p>
              </>
            )}
          </div>
        </label>
      )}
    </div>
  );
}
