import React from 'react';
import { motion } from 'framer-motion';

export const AnimateIcon = ({ children, animateOnHover = false, className = '' }) => {
  if (!animateOnHover) return children;
  return (
    <motion.div className={`inline-flex ${className}`} whileHover={{ scale: 1.2, rotate: [0, -15, 15, 0], transition: { duration: 0.5 } }} whileTap={{ scale: 0.9 }}>
      {children}
    </motion.div>
  );
};

export const ExternalLink = ({ animateOnHover, className }) => {
  const Icon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    </svg>
  );
  if (animateOnHover) {
    return <motion.div whileHover={{ scale: 1.2, x: 2, y: -2, transition: { type: "spring", stiffness: 400 } }}><Icon /></motion.div>;
  }
  return <Icon />;
};
