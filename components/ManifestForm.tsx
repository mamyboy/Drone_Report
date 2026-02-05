'use client';

import React from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { TransportManifest, FlightMode, CargoType, TempRange, RiskType } from '@/types/manifest';
import { Plus, Trash2, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
// import { cn } from '@/lib/utils'; // utility from shadcn - using inline for simplicity if not present or assume it is present as default shadcn structure

// Quick cn implementation if not exists or import fails
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface ManifestFormProps {
  initialData?: Partial<TransportManifest>;
  onSubmit: (data: TransportManifest) => void;
  isReadOnly?: boolean;
}

const defaultValues: Partial<TransportManifest> = {
  status: 'Draft',
  items: [],
  handovers: [],
  tempLogs: [],
  cargo: {
    types: [],
    tempControl: { range: 'Room' }
  } as any,
  preFlight: {
      checklist: {},
      signatures: { sender: {}, pilot: {}, supervisor: {} }
  } as any,
  destination: {
      receiverSign: {},
      controllerSign: {}
  } as any
};

export default function ManifestForm({ initialData, onSubmit, isReadOnly = false }: ManifestFormProps) {
  const { register, control, handleSubmit, formState: { errors } } = useForm<TransportManifest>({
    defaultValues: { ...defaultValues, ...initialData } as TransportManifest,
  });

  const { fields: itemFields, append: appendItem, remove: removeItem } = useFieldArray({
    control,
    name: 'items',
  });

  const { fields: handoverFields, append: appendHandover, remove: removeHandover } = useFieldArray({
    control,
    name: 'handovers',
  });

  const { fields: tempFields, append: appendTemp, remove: removeTemp } = useFieldArray({
    control,
    name: 'tempLogs',
  });

  const onFormSubmit = (data: TransportManifest) => {
    onSubmit(data);
  };

  // Helper for Input with Label
  const FormEntry = ({ label, children, className }: { label?: string, children: React.ReactNode, className?: string }) => (
    <div className={cn("flex flex-col space-y-2", className)}>
      {label && <Label className="text-sm font-medium text-gray-700">{label}</Label>}
      {children}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8 max-w-5xl mx-auto pb-20">

      <div className="text-center space-y-2 py-4">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Drone Medical Transport Manifest</h1>
        <p className="text-muted-foreground">แบบฟอร์มกำกับการขนส่งเวชภัณฑ์ทางการแพทย์ด้วยอากาศยานไร้คนขับ</p>
      </div>

      <Card>
        <CardHeader>
           <CardTitle>ข้อมูลทั่วไป (General Info)</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <FormEntry label="หน่วยงาน/สถานบริการ">
             <Controller
                control={control}
                name="unitName"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isReadOnly}>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกหน่วยงาน" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="รพ.สต.ตันหยงโป">รพ.สต.ตันหยงโป</SelectItem>
                      <SelectItem value="รพ.สต.เกาะสาหร่าย">รพ.สต.เกาะสาหร่าย</SelectItem>
                      <SelectItem value="รพ.สต.เกาะปูยู">รพ.สต.เกาะปูยู</SelectItem>
                    </SelectContent>
                  </Select>
                )}
            />
          </FormEntry>
          <FormEntry label="เลขที่เอกสาร">
            <Input {...register('docNumber')} disabled={isReadOnly} />
          </FormEntry>
          <FormEntry label="โครงการ/ระบบงาน">
            <Input {...register('projectName')} disabled={isReadOnly} />
          </FormEntry>
          <FormEntry label="ฉบับครั้งที่">
            <Input {...register('version')} disabled={isReadOnly} />
          </FormEntry>
          <FormEntry label="วันที่จัดทำ">
            <Input type="date" {...register('date')} disabled={isReadOnly} />
          </FormEntry>
          <FormEntry label="เวลา">
            <Input type="time" {...register('time')} disabled={isReadOnly} />
          </FormEntry>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>๑. ข้อมูลจุดส่ง - จุดรับ (Points of Contact)</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
           <div className="space-y-4 p-4 border rounded-lg bg-slate-50">
              <h4 className="font-semibold flex items-center gap-2 text-blue-700">📍 จุดส่ง (Sender)</h4>
              <FormEntry label="หน่วยงาน/สถานที่">
                  <Input {...register('sender.unitName')} disabled={isReadOnly} />
              </FormEntry>
              <FormEntry label="ที่อยู่/จุดนัดหมาย">
                  <Input {...register('sender.address')} disabled={isReadOnly} />
              </FormEntry>
              <div className="grid grid-cols-2 gap-4">
                 <FormEntry label="ชื่อ-สกุล">
                    <Input {...register('sender.name')} disabled={isReadOnly} />
                 </FormEntry>
                 <FormEntry label="ตำแหน่ง">
                    <Input {...register('sender.position')} disabled={isReadOnly} />
                 </FormEntry>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <FormEntry label="โทรศัพท์">
                    <Input {...register('sender.phone')} disabled={isReadOnly} />
                 </FormEntry>
                 <FormEntry label="อีเมล/ติดต่อ">
                    <Input {...register('sender.contact')} disabled={isReadOnly} />
                 </FormEntry>
              </div>
           </div>

           <div className="space-y-4 p-4 border rounded-lg bg-slate-50">
              <h4 className="font-semibold flex items-center gap-2 text-green-700">🏁 จุดรับ (Receiver)</h4>
              <FormEntry label="หน่วยงาน/สถานที่">
                  <Input {...register('receiver.unitName')} disabled={isReadOnly} />
              </FormEntry>
              <FormEntry label="ที่อยู่/จุดนัดหมาย">
                  <Input {...register('receiver.address')} disabled={isReadOnly} />
              </FormEntry>
              <div className="grid grid-cols-2 gap-4">
                 <FormEntry label="ชื่อ-สกุล">
                    <Input {...register('receiver.name')} disabled={isReadOnly} />
                 </FormEntry>
                 <FormEntry label="ตำแหน่ง">
                    <Input {...register('receiver.position')} disabled={isReadOnly} />
                 </FormEntry>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <FormEntry label="โทรศัพท์">
                    <Input {...register('receiver.phone')} disabled={isReadOnly} />
                 </FormEntry>
                 <FormEntry label="อีเมล/ติดต่อ">
                    <Input {...register('receiver.contact')} disabled={isReadOnly} />
                 </FormEntry>
              </div>
           </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>๒. รายละเอียดภารกิจ (Mission Details)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <FormEntry label="รหัสภารกิจ">
                  <Input {...register('mission.code')} disabled={isReadOnly} />
              </FormEntry>
              <FormEntry label="วันที่ปฏิบัติการ">
                  <Input type="date" {...register('mission.date')} disabled={isReadOnly} />
              </FormEntry>
              <FormEntry label="ช่วงเวลา">
                  <Input {...register('mission.timeRange')} disabled={isReadOnly} placeholder="08:00 - 10:00" />
              </FormEntry>
              <FormEntry label="ผู้ให้บริการ">
                  <Input {...register('mission.provider')} disabled={isReadOnly} />
              </FormEntry>
           </div>

           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <FormEntry label="ผู้ควบคุมการบิน">
                  <Input {...register('mission.pilot')} disabled={isReadOnly} />
              </FormEntry>
              <FormEntry label="ผู้ควบคุมภารกิจ">
                  <Input {...register('mission.controller')} disabled={isReadOnly} />
              </FormEntry>
              <FormEntry label="รุ่น UAV">
                  <Input {...register('mission.uavModel')} disabled={isReadOnly} />
              </FormEntry>
              <FormEntry label="Serial No.">
                  <Input {...register('mission.uavSerial')} disabled={isReadOnly} />
              </FormEntry>
           </div>

           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <FormEntry label="Battery Set">
                  <Input {...register('mission.batterySet')} disabled={isReadOnly} />
              </FormEntry>
              <FormEntry label="จุดขึ้นบิน">
                  <Input {...register('mission.takeoffPoint')} disabled={isReadOnly} />
              </FormEntry>
              <FormEntry label="จุดลงจอด">
                  <Input {...register('mission.landingPoint')} disabled={isReadOnly} />
              </FormEntry>
              <FormEntry label="สภาพอากาศ">
                  <Input {...register('mission.weather')} disabled={isReadOnly} />
              </FormEntry>
           </div>

           <div className="grid grid-cols-3 gap-4">
              <FormEntry label="ระยะทาง (km)">
                  <Input type="number" step="0.1" {...register('mission.distanceKm')} disabled={isReadOnly} />
              </FormEntry>
              <FormEntry label="ความสูง (m)">
                  <Input type="number" step="1" {...register('mission.altitudeM')} disabled={isReadOnly} />
              </FormEntry>
              <FormEntry label="รูปแบบการบิน">
                  <Controller
                    control={control}
                    name="mission.flightMode"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isReadOnly}>
                        <SelectTrigger>
                          <SelectValue placeholder="เลือกรูปแบบ" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="VLOS">มองเห็นด้วยสายตา (VLOS)</SelectItem>
                          <SelectItem value="EVLOS">EVLOS</SelectItem>
                          <SelectItem value="BVLOS">BVLOS</SelectItem>
                          <SelectItem value="Auto">Auto</SelectItem>
                          <SelectItem value="Manual">Manual</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
              </FormEntry>
           </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
           <CardTitle>๓. สรุปเวชภัณฑ์ (Cargo Summary)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
           <div>
              <Label className="mb-2 block">ประเภทสิ่งที่ขนส่ง</Label>
              <div className="flex flex-wrap gap-4">
                  {['Medicine', 'Vaccine', 'MedicalSupplies', 'Blood', 'LabSpecimen', 'Organ'].map((type) => (
                      <FormEntry key={type} className="flex-row items-center space-y-0 space-x-2">
                           <input
                              type="checkbox"
                              className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                              value={type}
                              {...register('cargo.types')}
                              disabled={isReadOnly}
                           />
                           <span className="text-sm">{type}</span>
                      </FormEntry>
                  ))}
              </div>
           </div>

           <FormEntry label="คำอธิบายโดยสังเขป">
               <Input {...register('cargo.description')} disabled={isReadOnly} />
           </FormEntry>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormEntry label="จำนวนหีบห่อ">
                  <Input type="number" {...register('cargo.packageCount')} disabled={isReadOnly} />
              </FormEntry>
              <FormEntry label="ระดับความเร่งด่วน">
                  <Input {...register('cargo.urgency')} disabled={isReadOnly} />
              </FormEntry>
              <FormEntry label="น้ำหนักรวม (kg)">
                  <Input type="number" step="0.1" {...register('cargo.weightKg')} disabled={isReadOnly} />
              </FormEntry>
           </div>

           <div className="p-4 bg-slate-50 rounded-lg border">
              <h5 className="font-semibold mb-3">การควบคุมอุณหภูมิและบรรจุภัณฑ์</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <FormEntry label="ช่วงอุณหภูมิ">
                      <Controller
                        control={control}
                        name="cargo.tempControl.range"
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isReadOnly}>
                            <SelectTrigger>
                              <SelectValue placeholder="เลือกช่วงอุณหภูมิ" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Room">อุณหภูมิห้อง</SelectItem>
                              <SelectItem value="2-8C">2-8 องศาเซลเซียส</SelectItem>
                              <SelectItem value="-20C">ลบ 20 องศาเซลเซียส</SelectItem>
                              <SelectItem value="-80C">ลบ 80 องศาเซลเซียส</SelectItem>
                              <SelectItem value="Other">อื่นๆ</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                  </FormEntry>
                  <FormEntry label="ชนิดภาชนะ">
                      <Input placeholder="เช่น: กล่องโฟม, เจลเย็น" {...register('cargo.tempControl.containerType')} disabled={isReadOnly} />
                  </FormEntry>
                  <FormEntry label="Logger ID">
                      <Input {...register('cargo.tempControl.loggerId')} disabled={isReadOnly} />
                  </FormEntry>
                  <FormEntry label="Seal No.">
                      <Input {...register('cargo.tempControl.sealNumber')} disabled={isReadOnly} />
                  </FormEntry>
              </div>
           </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
           <CardTitle>๔. เช็กลิสต์ก่อนปล่อยบิน (Pre-flight Checklist)</CardTitle>
        </CardHeader>
        <CardContent>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                ['identityConfirmed', 'ยืนยันตัวตนผู้ส่งและผู้รับ'],
                ['areaSafe', 'ยืนยันพื้นที่ขึ้น-ลงปลอดภัย'],
                ['cargoChecked', 'ตรวจสอบรายการ/บรรจุภัณฑ์'],
                ['emergencyPlan', 'ยืนยันแผนฉุกเฉิน'],
                ['startTempRecorded', 'บันทึกอุณหภูมิเริ่มต้น'],
                ['signalTested', 'ทดสอบสัญญาณ/ติดตาม'],
                ['labelingChecked', 'ติดฉลาก/ปิดผนึกเรียบร้อย'],
                ['weightChecked', 'ตรวจสอบน้ำหนัก/สมดุล'],
                ['weatherChecked', 'ตรวจสอบอากาศ/ความเสี่ยง'],
                ['docsChecked', 'เอกสารกำกับครบถ้วน'],
                ['systemChecked', 'แบตเตอรี่/ระบบพร้อม'],
                ['etaNotified', 'แจ้ง ETA ปลายทาง'],
              ].map(([key, label]) => (
                  <Controller
                     key={key}
                     control={control}
                     name={`preFlight.checklist.${key}` as any}
                     render={({ field }) => (
                        <div className="flex items-center space-x-2 p-2 border rounded hover:bg-slate-50">
                            <Checkbox
                                id={key}
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={isReadOnly}
                            />
                            <label htmlFor={key} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                {label}
                            </label>
                        </div>
                     )}
                  />
              ))}
           </div>

           <Separator className="my-6" />

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                  ['sender', 'ผู้ส่งมอบ'],
                  ['pilot', 'ผู้ควบคุมการบิน'],
                  ['supervisor', 'หัวหน้าหน่วย (ถ้ามี)']
              ].map(([role, title]) => (
                 <div key={role} className="space-y-3 p-4 border rounded-lg bg-slate-50 text-center">
                     <p className="font-semibold">{title}</p>
                     <Input placeholder="ชื่อ-สกุล" {...register(`preFlight.signatures.${role}.name` as any)} disabled={isReadOnly} className="text-center" />
                     <div className="flex justify-center items-center space-x-2 my-2">
                        <Controller
                            control={control}
                            name={`preFlight.signatures.${role}.signed` as any}
                            render={({ field }) => (
                                <div className="flex items-center space-x-2">
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isReadOnly} />
                                    <span className="text-sm">ยืนยันลงนาม</span>
                                </div>
                            )}
                        />
                     </div>
                     <Input type="time" {...register(`preFlight.signatures.${role}.time` as any)} disabled={isReadOnly} className="w-32 mx-auto" />
                 </div>
              ))}
           </div>
        </CardContent>
      </Card>

      <div className="border-b-2 border-dashed border-slate-300 my-8"></div>

      <Card>
          <CardHeader>
              <CardTitle>๕. รายการเวชภัณฑ์ (Items List)</CardTitle>
          </CardHeader>
          <CardContent>
              <Table>
                  <TableHeader>
                      <TableRow>
                          <TableHead>รายการ</TableHead>
                          <TableHead className="w-[80px]">จำนวน</TableHead>
                          <TableHead className="w-[80px]">หน่วย</TableHead>
                          <TableHead>Lot No.</TableHead>
                          <TableHead>Exp.</TableHead>
                          <TableHead>Temp</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {itemFields.map((field, index) => (
                          <TableRow key={field.id}>
                              <TableCell><Input {...register(`items.${index}.description`)} disabled={isReadOnly} placeholder="ชื่อรายการ" /></TableCell>
                              <TableCell><Input type="number" {...register(`items.${index}.qty`)} disabled={isReadOnly} className="text-center" /></TableCell>
                              <TableCell><Input {...register(`items.${index}.unit`)} disabled={isReadOnly} /></TableCell>
                              <TableCell><Input {...register(`items.${index}.lotNo`)} disabled={isReadOnly} /></TableCell>
                              <TableCell><Input type="date" {...register(`items.${index}.expiryDate`)} disabled={isReadOnly} /></TableCell>
                              <TableCell><Input {...register(`items.${index}.tempRange`)} disabled={isReadOnly} /></TableCell>
                              <TableCell>
                                  {!isReadOnly && (
                                    <Button variant="ghost" size="icon" onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                  )}
                              </TableCell>
                          </TableRow>
                      ))}
                  </TableBody>
              </Table>
              {!isReadOnly && (
                <div className="mt-4">
                  <Button type="button" variant="outline" onClick={() => appendItem({ description: '', qty: 1 } as any)}>
                      <Plus className="mr-2 h-4 w-4" /> เพิ่มรายการ
                  </Button>
                </div>
              )}
          </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
            <CardHeader>
                <CardTitle>๖. บันทึกการส่งมอบ (Handover)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {handoverFields.map((field, index) => (
                    <div key={field.id} className="p-3 border rounded space-y-2 relative">
                         {!isReadOnly && (
                              <Button type="button" variant="ghost" size="icon" onClick={() => removeHandover(index)} className="absolute top-2 right-2 text-red-500 h-6 w-6">
                                  <Trash2 className="h-4 w-4" />
                              </Button>
                         )}
                         <div className="grid grid-cols-2 gap-2">
                             <Input type="datetime-local" {...register(`handovers.${index}.dateTime`)} disabled={isReadOnly} className="text-xs" />
                             <Controller
                                control={control}
                                name={`handovers.${index}.signed`}
                                render={({ field }) => (
                                    <div className="flex items-center space-x-2">
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isReadOnly} />
                                        <span className="text-sm">Signed</span>
                                    </div>
                                )}
                             />
                         </div>
                         <Input placeholder="จาก (From)" {...register(`handovers.${index}.fromName`)} disabled={isReadOnly} />
                         <Input placeholder="ถึง (To)" {...register(`handovers.${index}.toName`)} disabled={isReadOnly} />
                         <Input placeholder="ID Card/Code" {...register(`handovers.${index}.idCard`)} disabled={isReadOnly} />
                    </div>
                ))}
                {!isReadOnly && (
                  <Button type="button" variant="outline" className="w-full" onClick={() => appendHandover({} as any)}>
                      <Plus className="mr-2 h-4 w-4" /> เพิ่มบันทึก
                  </Button>
                )}
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>๗. บันทึกอุณหภูมิ (Temp Log)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2 mb-2">
                     <Input placeholder="Recorder ID" {...register('tempLogConfig.loggerId')} disabled={isReadOnly} />
                     <Input placeholder="Target Range" {...register('tempLogConfig.targetRange')} disabled={isReadOnly} />
                </div>
                <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1">
                    {tempFields.map((field, index) => (
                        <div key={field.id} className="p-3 border rounded space-y-2 relative bg-slate-50">
                             {!isReadOnly && (
                                  <Button type="button" variant="ghost" size="icon" onClick={() => removeTemp(index)} className="absolute top-2 right-2 text-red-500 h-6 w-6">
                                      <Trash2 className="h-4 w-4" />
                                  </Button>
                             )}
                             <Input placeholder="จุดตรวจ (Checkpoint)" {...register(`tempLogs.${index}.checkpoint`)} disabled={isReadOnly} className="font-semibold" />
                             <div className="grid grid-cols-2 gap-2">
                                 <Input type="datetime-local" {...register(`tempLogs.${index}.dateTime`)} disabled={isReadOnly} className="text-xs" />
                                 <div className="flex items-center space-x-1">
                                    <Input type="number" step="0.1" placeholder="Temp" {...register(`tempLogs.${index}.temp`)} disabled={isReadOnly} />
                                    <span className="text-xs text-gray-500">°C</span>
                                 </div>
                             </div>
                             <Input placeholder="ผู้บันทึก" {...register(`tempLogs.${index}.recorderName`)} disabled={isReadOnly} />
                        </div>
                    ))}
                </div>
                 {!isReadOnly && (
                    <Button type="button" variant="outline" className="w-full" onClick={() => appendTemp({} as any)}>
                          <Plus className="mr-2 h-4 w-4" /> เพิ่มอุณหภูมิ
                    </Button>
                 )}
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
           <CardTitle>๘. เหตุผิดปกติ (Anomalies)</CardTitle>
        </CardHeader>
        <CardContent>
           <Textarea
              className="min-h-[100px]"
              placeholder="ระบุเหตุการณ์ เช่น ล่าช้า, อุปกรณ์ชำรุด, อุณหภูมิเกินช่วง..."
              {...register('anomalies')}
              disabled={isReadOnly}
           />
        </CardContent>
      </Card>

      <Card className="border-2 border-green-100">
         <CardHeader>
            <CardTitle className="text-green-800">๙. การรับรองปลายทาง (Destination Certification)</CardTitle>
         </CardHeader>
         <CardContent className="space-y-6">
            <FormEntry label="ผลการตรวจรับ">
                 <Controller
                    control={control}
                    name="destination.result"
                    render={({ field }) => (
                         <div className="flex flex-wrap gap-4">
                             {[
                                 ['Complete', 'รับครบถ้วนสมบูรณ์'],
                                 ['WithRemarks', 'รับแต่มีข้อสังเกต'],
                                 ['Rejected', 'ปฏิเสธการรับ']
                             ].map(([val, label]) => (
                                 <div key={val} className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-slate-50 cursor-pointer" onClick={() => !isReadOnly && field.onChange(val)}>
                                     <div className={cn("w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center", field.value === val && "border-primary bg-primary")}>
                                          {field.value === val && <div className="w-2 h-2 rounded-full bg-white" />}
                                     </div>
                                     <span className="text-sm font-medium">{label}</span>
                                 </div>
                             ))}
                         </div>
                    )}
                 />
            </FormEntry>

            <FormEntry label="หมายเหตุเพิ่มเติม">
                <Input {...register('destination.remarks')} disabled={isReadOnly} />
            </FormEntry>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h5 className="font-bold text-green-900 mb-4">ผู้รับมอบปลายทาง</h5>
                    <div className="space-y-3">
                        <Input placeholder="ชื่อ-สกุล" {...register('destination.receiverSign.name')} disabled={isReadOnly} />
                        <Input placeholder="ตำแหน่ง" {...register('destination.receiverSign.position')} disabled={isReadOnly} />
                        <div className="flex gap-2">
                             <Input type="date" {...register('destination.receiverSign.date')} disabled={isReadOnly} />
                             <Input type="time" {...register('destination.receiverSign.time')} disabled={isReadOnly} />
                        </div>
                        <Controller
                            control={control}
                            name="destination.receiverSign.signed"
                            render={({ field }) => (
                                <div className="flex items-center space-x-2 mt-2">
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isReadOnly} id="rec_sign" />
                                    <Label htmlFor="rec_sign">ยืนยันการรับและลงนาม</Label>
                                </div>
                            )}
                        />
                    </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <h5 className="font-bold text-slate-900 mb-4">ผู้ควบคุมภารกิจ / โดรน</h5>
                    <div className="space-y-3">
                        <Input placeholder="ชื่อ-สกุล" {...register('destination.controllerSign.name')} disabled={isReadOnly} />
                        <div className="flex gap-2">
                             <Input type="date" {...register('destination.controllerSign.date')} disabled={isReadOnly} />
                             <Input type="time" {...register('destination.controllerSign.time')} disabled={isReadOnly} />
                        </div>
                        <Controller
                            control={control}
                            name="destination.controllerSign.signed"
                            render={({ field }) => (
                                <div className="flex items-center space-x-2 mt-2">
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isReadOnly} id="ctrl_sign" />
                                    <Label htmlFor="ctrl_sign">ยืนยันและลงนาม</Label>
                                </div>
                            )}
                        />
                    </div>
                </div>
            </div>
         </CardContent>
      </Card>

      {!isReadOnly && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg flex justify-end z-50">
             <div className="max-w-5xl w-full mx-auto flex justify-end px-6">
                <Button type="submit" size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Save className="mr-2 h-5 w-5" /> บันทึกข้อมูล (Save Manifest)
                </Button>
             </div>
        </div>
      )}
    </form>
  );
}
