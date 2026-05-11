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
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
    >
      {children}
    </motion.div>
  );
}
