import { useState, useRef } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';
import { Button } from './ui/button';
import { uploadFile } from '../utils/api';
import { toast } from 'sonner';

interface MultiImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  maxSizeMB?: number;
}

export default function MultiImageUpload({ 
  images, 
  onChange,
  maxImages = 5,
  maxSizeMB = 10
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    if (images.length + files.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    try {
      setUploading(true);
      const uploadedUrls: string[] = [];

      for (const file of files) {
        // Validate file size
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        if (file.size > maxSizeBytes) {
          toast.error(`${file.name} exceeds ${maxSizeMB}MB`);
          continue;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} is not an image`);
          continue;
        }

        const url = await uploadFile(file);
        uploadedUrls.push(url);
      }

      onChange([...images, ...uploadedUrls]);
      toast.success(`${uploadedUrls.length} image(s) uploaded!`);
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        id="multi-image-upload"
      />
      
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {images.map((img, idx) => (
            <div key={idx} className="relative group aspect-square">
              <img 
                src={img} 
                alt={`Upload ${idx + 1}`}
                className="w-full h-full object-cover rounded-lg border border-pink-200"
              />
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {images.length < maxImages && (
        <label
          htmlFor="multi-image-upload"
          className="flex items-center justify-center w-full h-24 border-2 border-dashed border-pink-200 rounded-lg cursor-pointer bg-pink-50 hover:bg-pink-100 transition-colors"
        >
          <div className="flex flex-col items-center">
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-pink-200 border-t-primary mb-1" />
                <p className="text-xs text-muted-foreground">Uploading...</p>
              </>
            ) : (
              <>
                <ImageIcon className="w-8 h-8 text-pink-300 mb-1" />
                <p className="text-xs text-muted-foreground">
                  Add photos ({images.length}/{maxImages})
                </p>
              </>
            )}
          </div>
        </label>
      )}
    </div>
  );
}
