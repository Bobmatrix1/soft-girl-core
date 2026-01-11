import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // The video is 8 seconds, so we set a timeout slightly longer to ensure smooth transition
    // or we can listen to the video 'ended' event.
    // For safety, we'll set a max timeout of 8.5s
    const timer = setTimeout(() => {
      handleComplete();
    }, 8500);

    return () => clearTimeout(timer);
  }, []);

  const handleComplete = () => {
    setIsVisible(false);
    setTimeout(onComplete, 500); // Allow exit animation to finish
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] bg-[#FFC0CB] flex items-center justify-center overflow-hidden h-dvh"
        >
          <video
            autoPlay
            muted
            playsInline
            onEnded={handleComplete}
            className="w-full h-full md:object-contain object-cover"
            src="/intro.MP4?v=2" 
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          >
            <source src="/intro.MP4?v=2" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
