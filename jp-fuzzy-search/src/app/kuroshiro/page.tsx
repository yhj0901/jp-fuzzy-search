'use client';
import dynamic from 'next/dynamic';

const KuroshiroComponent = dynamic(
  () => import('../../components/kuroshiro/kuroshiroComponent'),
  { ssr: false }
);

export default function KuroshiroPage() {
  return <KuroshiroComponent />;
}
