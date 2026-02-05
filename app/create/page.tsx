'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import ManifestForm from '@/components/ManifestForm';
import { TransportManifest } from '@/types/manifest';
// import { v4 as uuidv4 } from 'uuid';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CreatePage() {
  const router = useRouter();

  const handleSubmit = (data: TransportManifest) => {
    // Generate simple ID
    const newManifest: TransportManifest = {
      ...data,
      id: Date.now().toString(), // Simple ID
      status: 'Draft', // initial
    };

    const stored = localStorage.getItem('manifests');
    const logs = stored ? JSON.parse(stored) : [];
    logs.push(newManifest);
    localStorage.setItem('manifests', JSON.stringify(logs));

    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto mb-4">
        <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="mr-2" size={20} /> กลับไปหน้าหลัก
        </Link>
      </div>
      <ManifestForm onSubmit={handleSubmit} />
    </div>
  );
}
