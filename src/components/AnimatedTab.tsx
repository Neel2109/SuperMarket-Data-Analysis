import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedTabProps {
  children: React.ReactNode;
}

export const AnimatedTab: React.FC<AnimatedTabProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
};
