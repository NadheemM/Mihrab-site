'use client';

import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MathUtils } from 'three';

export default function CameraParallax({ mouseStrength = 2, damp = 0.05 }) {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x =  (e.clientX / window.innerWidth)  * 2 - 1;
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame(() => {
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
