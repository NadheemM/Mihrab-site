'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

const EASE_Y: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_IN: [number, number, number, number] = [0.4, 0, 1, 1];

export default function TransitionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        // y: -16 starts content slightly above natural position (hidden behind fixed navbar).
        // No gap below navbar, no body-background flash on dark pages.
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -18, transition: { duration: 0.22, ease: EASE_IN } }}
        transition={{
          opacity: { duration: 0.05, ease: 'linear' },
          y: { duration: 0.52, ease: EASE_Y },
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
