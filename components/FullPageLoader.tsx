'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FullPageLoader({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => {
      // نستنى شوية بعد ما كل حاجة تتحمل عشان الـ fade out يبقى ناعم
      setTimeout(() => setIsLoading(false), 1200);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => window.removeEventListener('load', handleLoad);
  }, []);

  // نمنع السكرول وهو بيتحمل
  useEffect(() => {
    document.body.style.overflow = isLoading ? 'hidden' : '';
  }, [isLoading]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
            className="fixed inset-0 z-[9999] flex items-center justify-center loader-screen"
          >
            <div className="loader" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* المحتوى بيتحمل في الخلفية بس يبقى مخفي لحد ما اللودر يمشي */}
      <div className={isLoading ? 'invisible' : 'visible'}>
        {children}
      </div>
    </>
  );
}