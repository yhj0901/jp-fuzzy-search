'use client';
import dynamic from 'next/dynamic';

const WanakanaComponent = dynamic(
  () => import('../../components/wanakana/wanakanaComponent'),
  { ssr: false }
);

export default function WanakanaPage() {
  return <WanakanaComponent />;
}
