'use client';
import { useEffect, useRef, useState } from 'react';

interface Orientation { beta: number; gamma: number; alpha: number; }

type IosDeviceOrientationEvent = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<'granted' | 'denied'>;
};

export function useDeviceOrientation() {
  const [orientation, setOrientation] = useState<Orientation>({ beta: 0, gamma: 0, alpha: 0 });
  const [granted, setGranted] = useState<boolean | null>(null);
  const attached = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handler = (e: DeviceOrientationEvent) => {
      setOrientation({
        beta:  e.beta  ?? 0,
        gamma: e.gamma ?? 0,
        alpha: e.alpha ?? 0,
      });
    };

    const attach = () => {
      if (attached.current) return;
      window.addEventListener('deviceorientation', handler, { passive: true });
      attached.current = true;
    };

    const detach = () => {
      if (!attached.current) return;
      window.removeEventListener('deviceorientation', handler);
      attached.current = false;
    };

    const iosRequest = (DeviceOrientationEvent as IosDeviceOrientationEvent).requestPermission;

    if (typeof iosRequest === 'function') {
      const onFirstTouch = async () => {
        try {
          const state = await iosRequest();
          if (state === 'granted') { setGranted(true); attach(); }
          else                     { setGranted(false); }
        } catch { setGranted(false); }
      };
      window.addEventListener('touchstart', onFirstTouch, { once: true, passive: true });
      return () => {
        window.removeEventListener('touchstart', onFirstTouch);
        detach();
      };
    }

    setGranted(true);
    attach();
    return detach;
  }, []);

  return { orientation, granted };
}
