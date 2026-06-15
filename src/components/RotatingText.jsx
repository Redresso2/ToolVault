import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const RotatingText = ({ text, className = '' }) => {
  return (
    <motion.span className={`inline-block ${className}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
      {text}
    </motion.span>
  );
};

export const RotatingTextContainer = ({ text, children, interval = 3000, className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => { setCurrentIndex((prev) => (prev + 1) % text.length); }, interval);
    return () => clearInterval(timer);
  }, [text.length, interval]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div key={currentIndex} initial={{ opacity: 0, y: 30, rotateX: -90 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} exit={{ opacity: 0, y: -30, rotateX: 90 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="flex items-center gap-2">
          {children}
          <RotatingText text={text[currentIndex]} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
