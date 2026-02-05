'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { TransportManifest } from '@/types/manifest';
import { Plus, Edit, Trash2, FileText, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function Dashboard() {
  const [manifests, setManifests] = useState<TransportManifest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchManifests = async () => {
      try {
          const res = await fetch('/api/manifests');
          if (res.ok) {
              const data = await res.json();
              setManifests(data);
          }
      } catch (error) {
          console.error('Failed to load manifests', error);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
    fetchManifests();
  }, []);

  const generateDemoData = async () => {
    const demo: TransportManifest = {
        id: 'DEMO-' + Date.now(),
        status: 'InTransit',
        unitName: 'โรงพยาบาลแม่ข่าย A (Node A)',
        docNumber: 'DMT-2567-DEMO',
        projectName: 'Drone Medical Pilot Phase 1',
        version: '1.0',
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        sender: {
            unitName: 'โรงพยาบาลศูนย์เชียงราย',
            address: 'อาคาร 5 ชั้นดาดฟ้า',
            name: 'เภสัชกร สมชาย ใจดี',
            position: 'เภสัชกรชำนาญการ',
            phone: '081-234-5678',
            contact: 'somchai@hosp.com'
        },
        receiver: {
            unitName: 'รพ.สต. บ้านดอย',
            address: 'ลานหน้าสถานีอนามัย',
            name: 'พยาบาล สมหญิง รักรักษา',
            position: 'พยาบาลวิชาชีพ',
            phone: '089-876-5432',
            contact: 'somying@hosp.com'
        },
        mission: {
            code: 'MS-2024-001',
            date: new Date().toISOString().split('T')[0],
            timeRange: '09:00 - 09:45',
            provider: 'SkyHigh Drones',
            pilot: 'กัปตันมานะ',
            controller: 'นายคุมเข้ม',
            uavModel: 'DJI M300 RTK',
            uavSerial: 'SN-998877',
            batterySet: 'BAT-SET-01',
            takeoffPoint: 'Base A',
            landingPoint: 'Station B',
            distanceKm: 15.5,
            altitudeM: 120,
            weather: 'Clear Sky',
            specialConditions: '-',
            flightMode: 'Auto'
        },
        cargo: {
            types: ['Medicine', 'Vaccine'],
            description: 'วัคซีนโควิดและยาความดัน',
            packageCount: 2,
            urgency: 'High',
            weightKg: 3.5,
            tempControl: { range: '2-8C', containerType: 'Cooler Box', loggerId: 'TL-01', sealNumber: 'SL-01' },
            risk: 'None'
        },
        preFlight: {
            checklist: {
                identityConfirmed: true, areaSafe: true, cargoChecked: true, emergencyPlan: true,
                startTempRecorded: true, signalTested: true, labelingChecked: true, weightChecked: true,
                weatherChecked: true, docsChecked: true, systemChecked: true, etaNotified: true
            },
            signatures: {
                sender: { name: 'สมชาย', signed: true, time: '08:45' },
                pilot: { name: 'มานะ', signed: true, time: '08:50' },
                supervisor: { name: 'ผอ.สมศักดิ์', signed: true, time: '08:55' }
            }
        },
        items: [
            { id: '1', description: 'Pfizer Vaccine', qty: 10, unit: 'Vials', lotNo: 'LOT-A', expiryDate: '2025-01-01', tempRange: '2-8C', remarks: '-' },
            { id: '2', description: 'Paracetamol', qty: 100, unit: 'Tabs', lotNo: 'LOT-B', expiryDate: '2026-05-20', tempRange: 'Room', remarks: '-' }
        ],
        handovers: [],
        tempLogs: [],
        tempLogConfig: { loggerId: '', targetRange: '' },
        anomalies: '',
        destination: { result: 'Complete', remarks: '', receiverSign: { name: '', position: '', signed: false, date: '', time: '' }, controllerSign: { name: '', signed: false, date: '', time: '' } }
    };

    // Save to API
    try {
        const res = await fetch('/api/manifests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(demo)
        });

        if (res.ok) {
            const savedData = await res.json();
            setManifests(prev => [savedData, ...prev]);
        }
    } catch (e) {
        alert('Failed to save demo data');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('ยืนยันการลบข้อมูลนี้? (Confirm delete?)')) {
      try {
          await fetch(`/api/manifests/${id}`, { method: 'DELETE' });
          setManifests(prev => prev.filter(m => m.id !== id));
      } catch (e) {
          alert('Failed to delete');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
        case 'Draft': return <Badge variant="secondary">Draft</Badge>;
        case 'PreFlightSigned': return <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600">Pre-Flight Signed</Badge>;
        case 'InTransit': return <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">In Transit</Badge>;
        case 'Completed': return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Completed</Badge>;
        case 'Rejected': return <Badge variant="destructive">Rejected</Badge>;
        default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-end">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
                <p className="text-muted-foreground">ระบบจัดการการขนส่งเวชภัณฑ์ทางอากาศ (Drone Medical Transport Management)</p>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={generateDemoData} className="border-blue-200 text-blue-700 hover:bg-blue-50">
                    <Sparkles className="mr-2 h-4 w-4" /> สร้างข้อมูลทดสอบ (Demo Data)
                </Button>
                <Link href="/create">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="mr-2 h-4 w-4" /> สร้างรายการใหม่ (New Manifest)
                    </Button>
                </Link>
            </div>
        </div>

        <Separator />

        <Card>
            <CardHeader>
                <CardTitle>รายการเอกสารขนส่ง (Manifest List)</CardTitle>
                <CardDescription>แสดงรายการเอกสารทั้งหมดและสถานะปัจจุบัน</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[120px]">Doc No.</TableHead>
                                <TableHead className="w-[120px]">Date</TableHead>
                                <TableHead>Mission</TableHead>
                                <TableHead>Sender</TableHead>
                                <TableHead>Receiver</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {manifests.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center">
                                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                                            <FileText className="h-8 w-8 mb-2 opacity-50" />
                                            <p>ไม่พบข้อมูลรายการ (No manifests found)</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                manifests.map((m) => (
                                    <TableRow key={m.id}>
                                        <TableCell className="font-mono font-medium">{m.docNumber || '<No ID>'}</TableCell>
                                        <TableCell>{m.date}</TableCell>
                                        <TableCell>{m.mission?.code || '-'}</TableCell>
                                        <TableCell>{m.sender?.unitName}</TableCell>
                                        <TableCell>{m.receiver?.unitName}</TableCell>
                                        <TableCell>
                                            {getStatusBadge(m.status)}
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Link href={`/edit/${m.id}`}>
                                                <Button variant="ghost" size="icon" title="แก้ไข/ดูรายละเอียด">
                                                    <Edit className="h-4 w-4 text-blue-600" />
                                                </Button>
                                            </Link>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(m.id)} title="ลบ">
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
