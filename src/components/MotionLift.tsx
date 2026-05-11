'use client';
import { motion } from 'framer-motion';
import { ReactNode, CSSProperties } from 'react';

interface Props {
  children: ReactNode;
  style?: CSSProperties;
}

export default function MotionLift({ children, style }: Props) {
  return (
    <motion.div
      style={{ height: '100%', ...style }}
      whileHover={{ y: -8, transition: { type: 'spring', stiffness: 320, damping: 22 } }}
      whileTap={{ scale: 0.97, transition: { duration: 0.15 } }}
    >
      {children}
    </motion.div>
  );
}
