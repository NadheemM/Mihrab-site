'use client';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const SkyScene = dynamic(() => import('@/components/SkyScene'), { ssr: false });

export default function SkySceneClient() {
  return (
    <Suspense fallback={<div style={{ background: '#0B132B', width: '100%', height: '100%' }} />}>
      <SkyScene />
    </Suspense>
  );
}
