'use client';

import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MathUtils } from 'three';
import { useReducedMotion } from 'framer-motion';
import { useIsMobile } from '@/lib/useIsMobile';
import { useDeviceOrientation } from '@/lib/useDeviceOrientation';

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

export default function CameraParallax({ mouseStrength = 2, damp = 0.05 }) {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const { orientation, granted } = useDeviceOrientation();

  const gyroActive = isMobile && granted === true && !reduced;

  useEffect(() => {
    if (reduced) { mouse.current.x = 0; mouse.current.y = 0; return; }
    if (gyroActive) return;
    if (isMobile) return;

    const onMove = (e: MouseEvent) => {
      mouse.current.x =  (e.clientX / window.innerWidth)  * 2 - 1;
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [reduced, gyroActive, isMobile]);

  useEffect(() => {
    if (!gyroActive) return;
    const { beta, gamma } = orientation;
    mouse.current.x = clamp(gamma / 30, -1, 1);
    mouse.current.y = clamp(-(beta - 45) / 30, -1, 1);
  }, [orientation, gyroActive]);

  useFrame(() => {
    if (reduced) {
      camera.position.x = MathUtils.lerp(camera.position.x, 0, damp);
      camera.position.y = MathUtils.lerp(camera.position.y, 1, damp);
      camera.lookAt(0, 0, 0);
      return;
    }
    camera.position.x = MathUtils.lerp(
      camera.position.x,
      mouse.current.x * mouseStrength,
      damp,
    );
    camera.position.y = MathUtils.lerp(
      camera.position.y,
      mouse.current.y * mouseStrength * 0.5 + 1,
      damp,
    );
    camera.lookAt(0, 0, 0);
  });

  return null;
}
