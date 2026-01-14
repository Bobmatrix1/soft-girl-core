import { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { auth, db } from '../utils/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface AuthProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: any) => void;
}

export default function Auth({ isOpen, onClose, onLogin }: AuthProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        // Sign Up
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        await updateProfile(user, { displayName: name });
        
        // Create user document
        const userData = {
          uid: user.uid,
          email: user.email,
          name: name || email.split('@')[0],
          isAdmin: false,
          createdAt: new Date().toISOString()
        };
        
        await setDoc(doc(db, 'users', user.uid), userData);
        
        onLogin(userData);
        toast.success('Account created successfully!');
      } else {
        // Login
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Fetch user data from Firestore
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        
        let userData;
        if (docSnap.exists()) {
          userData = docSnap.data();
        } else {
          // If no doc exists (maybe created via other means or legacy), use basic info
          userData = {
            uid: user.uid,
            email: user.email,
            name: user.displayName || email.split('@')[0],
            isAdmin: false
          };
        }
        
        onLogin(userData);
        toast.success('Welcome back!');
      }
      
      onClose();
      
      // Reset form
      setEmail('');
      setPassword('');
      setName('');
      setShowPassword(false);
    } catch (error: any) {
      console.error('Auth error:', error);
      let errorMessage = 'Authentication failed.';
      if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password.';
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email already in use.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters.';
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-br from-pink-400 to-purple-400 p-8 text-white text-center">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-white hover:bg-white/20"
                onClick={onClose}
              >
                <X className="w-6 h-6" />
              </Button>
              
              <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 p-1 shadow-lg overflow-hidden">
                <img src="/logo.JPG" alt="Logo" className="w-full h-full object-cover rounded-full" />
              </div>

              <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                {isSignUp ? 'Join Us' : 'Welcome Back'}
              </h2>
              <p className="text-white/90">
                {isSignUp ? 'Create your account to start shopping' : 'Sign in to your account'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={isSignUp}
                    className="bg-pink-50/50 border-pink-100"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-pink-50/50 border-pink-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                    <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-pink-50/50 border-pink-100 pr-10"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                    >
                        {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-primary hover:bg-primary/90"
                disabled={loading}
              >
                {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
              </Button>

              <div className="text-center space-y-4">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                </button>
                
                <p className="text-xs font-bold text-pink-300 uppercase tracking-widest pt-4">
                    Soft Girl Core
                </p>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
