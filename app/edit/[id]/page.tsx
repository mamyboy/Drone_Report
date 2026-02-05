'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ManifestForm from '@/components/ManifestForm';
import { TransportManifest } from '@/types/manifest';
import Link from 'next/link';
import { ArrowLeft, Printer } from 'lucide-react';
// Next.js 15 params unwrapping
import { useParams } from 'next/navigation';
import ManifestPrint from '@/components/ManifestPrint';
import { useReactToPrint } from 'react-to-print';

export default function EditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<TransportManifest | null>(null);
  const printRef = React.useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
  });

  useEffect(() => {
    if (id) {
        // Fetch from API instead of localStorage
        fetch(`/api/manifests/${id}`)
            .then(res => {
                if (res.ok) return res.json();
                throw new Error('Not found');
            })
            .then(data => setData(data))
            .catch(() => {
                alert('ไม่พบข้อมูลเอกสาร');
                router.push('/');
            });
    }
  }, [id, router]);

  const handleSubmit = async (updatedData: TransportManifest) => {
      // Determine status based on fields (Simple Logic)
      let newStatus = updatedData.status;

      if (updatedData.preFlight.signatures.sender.signed && updatedData.preFlight.signatures.pilot.signed) {
          newStatus = 'PreFlightSigned';
      }
      if (updatedData.destination.result === 'Complete') {
          newStatus = 'Completed';
      }
       if (updatedData.destination.result === 'Rejected') {
          newStatus = 'Rejected';
      }

      const payload = { ...updatedData, status: newStatus };

      try {
          const res = await fetch(`/api/manifests/${id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
          });

          if (res.ok) {
              alert('บันทึกข้อมูลเรียบร้อย');
              router.push('/');
          } else {
              alert('บันทึกไม่สำเร็จ');
          }
      } catch (e) {
          alert('Error saving data');
      }
  };

  if (!data) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto mb-4 flex justify-between items-center">
        <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="mr-2" size={20} /> กลับไปหน้าหลัก
        </Link>
        <button
          onClick={() => handlePrint()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <Printer size={20} />
          พิมพ์ / Export PDF
        </button>
      </div>

      <ManifestForm initialData={data} onSubmit={handleSubmit} />

      {/* Hidden Print Component */}
      <div style={{ display: 'none' }}>
        <ManifestPrint ref={printRef} data={data} />
      </div>
    </div>
  );
}
