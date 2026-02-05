import React from 'react';
import { TransportManifest, CargoType } from '@/types/manifest';

interface ManifestPrintProps {
  data: TransportManifest;
}

// Helper for checkbox display
const CheckBox = ({ checked, label }: { checked?: boolean; label: string }) => (
  <div className="flex items-center gap-1 mr-4">
    <div className={`w-3 h-3 border border-black flex items-center justify-center text-[10px]`}>
      {checked ? '✓' : ''}
    </div>
    <span className="text-xs">{label}</span>
  </div>
);

export const ManifestPrint = React.forwardRef<HTMLDivElement, ManifestPrintProps>(({ data }, ref) => {
  const headerStyle = "text-base font-bold bg-gray-200 border-t border-b border-black py-1 px-2 mt-2 break-before-avoid";

  return (
    <div ref={ref} className="bg-white text-black font-sans p-8 mx-auto" style={{ width: '210mm', minHeight: '297mm' }}>
      {/* Page 1 */}
      <div className="page-break-after">
        <div className="flex justify-between items-start mb-4">
           <div className="text-center flex-1">
              <h1 className="text-xl font-bold">แบบฟอร์มกำกับการขนส่งเวชภัณฑ์ทางการแพทย์ด้วยอากาศยานไร้คนขับ</h1>
              <p className="text-sm">เอกสารใช้งานภาคสนาม - ฉบับพิมพ์</p>
           </div>
           <div className="text-xs border border-black p-1">หน้า ๑ จาก ๒</div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4 text-sm border border-black p-2">
            <div className="flex"><span className="font-bold w-32">หน่วยงาน:</span> {data.unitName}</div>
            <div className="flex"><span className="font-bold w-32">เลขที่เอกสาร:</span> {data.docNumber}</div>
            <div className="flex"><span className="font-bold w-32">โครงการ:</span> {data.projectName}</div>
            <div className="flex"><span className="font-bold w-32">ฉบับครั้งที่:</span> {data.version}</div>
            <div className="flex"><span className="font-bold w-32">วันที่:</span> {data.date}</div>
            <div className="flex"><span className="font-bold w-32">เวลา:</span> {data.time}</div>
        </div>

        <div className={headerStyle}>๑. ข้อมูลจุดส่ง - จุดรับ และผู้ประสานงาน</div>
        <div className="grid grid-cols-2 border border-black divide-x divide-black text-xs">
            <div className="p-2">
                <h3 className="font-bold mb-1 underline">จุดส่ง (Sender)</h3>
                <div className="grid grid-cols-[80px_1fr] gap-1">
                    <span>หน่วยงาน:</span> <span>{data.sender.unitName}</span>
                    <span>ที่อยู่:</span> <span>{data.sender.address}</span>
                    <span>ผู้ส่งมอบ:</span> <span>{data.sender.name}</span>
                    <span>ตำแหน่ง:</span> <span>{data.sender.position}</span>
                    <span>โทรศัพท์:</span> <span>{data.sender.phone}</span>
                </div>
            </div>
            <div className="p-2">
                <h3 className="font-bold mb-1 underline">จุดรับ (Receiver)</h3>
                <div className="grid grid-cols-[80px_1fr] gap-1">
                    <span>หน่วยงาน:</span> <span>{data.receiver.unitName}</span>
                    <span>ที่อยู่:</span> <span>{data.receiver.address}</span>
                    <span>ผู้รับมอบ:</span> <span>{data.receiver.name}</span>
                    <span>ตำแหน่ง:</span> <span>{data.receiver.position}</span>
                    <span>โทรศัพท์:</span> <span>{data.receiver.phone}</span>
                </div>
            </div>
        </div>

        <div className={headerStyle}>๒. รายละเอียดภารกิจและอากาศยานไร้คนขับ</div>
        <div className="border border-black p-2 text-xs">
            <div className="grid grid-cols-4 gap-2 mb-2">
                <div><span className="font-bold">รหัสภารกิจ:</span> {data.mission.code}</div>
                <div><span className="font-bold">วันที่:</span> {data.mission.date}</div>
                <div><span className="font-bold">เวลา:</span> {data.mission.timeRange}</div>
                <div><span className="font-bold">ผู้ให้บริการ:</span> {data.mission.provider}</div>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-2">
                <div><span className="font-bold">Pilot:</span> {data.mission.pilot}</div>
                <div><span className="font-bold">Controller:</span> {data.mission.controller}</div>
                <div><span className="font-bold">UAV Model:</span> {data.mission.uavModel}</div>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-2">
                <div><span className="font-bold">Serial No:</span> {data.mission.uavSerial}</div>
                <div><span className="font-bold">Battery:</span> {data.mission.batterySet}</div>
                <div><span className="font-bold">Distance:</span> {data.mission.distanceKm} km</div>
            </div>
             <div className="grid grid-cols-2 gap-2 mb-2">
                <div><span className="font-bold">จุดขึ้น:</span> {data.mission.takeoffPoint}</div>
                <div><span className="font-bold">จุดลง:</span> {data.mission.landingPoint}</div>
            </div>
             <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-dashed border-gray-400">
                <div><span className="font-bold">สภาพอากาศ:</span> {data.mission.weather}</div>
                <div className="flex gap-4">
                    <span className="font-bold">Flight Mode:</span>
                    <CheckBox checked={data.mission.flightMode === 'VLOS'} label="VLOS" />
                    <CheckBox checked={data.mission.flightMode === 'BVLOS'} label="BVLOS" />
                    <CheckBox checked={data.mission.flightMode === 'Auto'} label="Auto" />
                </div>
            </div>
        </div>

        <div className={headerStyle}>๓. สรุปเวชภัณฑ์หรือสิ่งส่งตรวจที่ขนส่ง</div>
        <div className="border border-black p-2 text-xs">
             <div className="flex flex-wrap mb-2">
                <span className="font-bold mr-2">ประเภท:</span>
                {['Medicine', 'Vaccine', 'MedicalSupplies', 'Blood', 'LabSpecimen'].map(t => (
                    <CheckBox key={t} checked={data.cargo.types.includes(t as CargoType)} label={t} />
                ))}
             </div>
             <div className="mb-2"><span className="font-bold">คำอธิบาย:</span> {data.cargo.description}</div>
             <div className="grid grid-cols-3 gap-4 mb-2">
                 <div><span className="font-bold">จำนวนหีบห่อ:</span> {data.cargo.packageCount}</div>
                 <div><span className="font-bold">ความเร่งด่วน:</span> {data.cargo.urgency}</div>
                 <div><span className="font-bold">น้ำหนักรวม:</span> {data.cargo.weightKg} kg</div>
             </div>
             <div className="border-t border-gray-400 pt-2 mt-2">
                 <div className="flex gap-4 mb-1">
                     <span className="font-bold">Temp Control:</span>
                     <CheckBox checked={data.cargo.tempControl.range === 'Room'} label="Room Temp" />
                     <CheckBox checked={data.cargo.tempControl.range === '2-8C'} label="2-8 °C" />
                     <CheckBox checked={['Room', '2-8C'].includes(data.cargo.tempControl.range) === false} label="Other" />
                 </div>
                 <div className="grid grid-cols-3 gap-2">
                     <div><span className="font-bold">Container:</span> {data.cargo.tempControl.containerType}</div>
                     <div><span className="font-bold">Logger ID:</span> {data.cargo.tempControl.loggerId}</div>
                     <div><span className="font-bold">Seal No:</span> {data.cargo.tempControl.sealNumber}</div>
                 </div>
             </div>
        </div>

        <div className={headerStyle}>๔. เช็กลิสต์ก่อนปล่อยบิน (Pre-flight Checklist)</div>
        <div className="border border-black p-2 text-xs">
            <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                <CheckBox checked={data.preFlight.checklist.identityConfirmed} label="ยืนยันตัวตนผู้ส่งและผู้รับ" />
                <CheckBox checked={data.preFlight.checklist.labelingChecked} label="ติดฉลาก/ปิดผนึกเรียบร้อย" />
                <CheckBox checked={data.preFlight.checklist.areaSafe} label="ยืนยันพื้นที่ขึ้น-ลงปลอดภัย" />
                <CheckBox checked={data.preFlight.checklist.weightChecked} label="ตรวจสอบน้ำหนัก/สมดุล" />
                <CheckBox checked={data.preFlight.checklist.cargoChecked} label="ตรวจสอบรายการ/บรรจุภัณฑ์" />
                <CheckBox checked={data.preFlight.checklist.weatherChecked} label="ตรวจสอบอากาศ/ความเสี่ยง" />
                <CheckBox checked={data.preFlight.checklist.emergencyPlan} label="ยืนยันแผนฉุกเฉิน" />
                <CheckBox checked={data.preFlight.checklist.docsChecked} label="เอกสารกำกับครบถ้วน" />
                <CheckBox checked={data.preFlight.checklist.startTempRecorded} label="บันทึกอุณหภูมิเริ่มต้น" />
                <CheckBox checked={data.preFlight.checklist.systemChecked} label="แบตเตอรี่/ระบบพร้อม" />
                <CheckBox checked={data.preFlight.checklist.signalTested} label="ทดสอบสัญญาณ/ติดตาม" />
                <CheckBox checked={data.preFlight.checklist.etaNotified} label="แจ้ง ETA ปลายทาง" />
            </div>
        </div>

        <div className="mt-2 border border-black p-2 text-xs">
             <div className="grid grid-cols-3 gap-4 text-center">
                 <div>
                     <div className="mb-4 pt-4 border-b border-dotted border-black">
                         {data.preFlight.signatures.sender.signed ? (data.preFlight.signatures.sender.name || 'Signed') : ''}
                     </div>
                     <p>ผู้ส่งมอบ ({data.preFlight.signatures.sender.time})</p>
                 </div>
                 <div>
                     <div className="mb-4 pt-4 border-b border-dotted border-black">
                         {data.preFlight.signatures.pilot.signed ? (data.preFlight.signatures.pilot.name || 'Signed') : ''}
                     </div>
                     <p>ผู้ควบคุมการบิน ({data.preFlight.signatures.pilot.time})</p>
                 </div>
                 <div>
                     <div className="mb-4 pt-4 border-b border-dotted border-black">
                         {data.preFlight.signatures.supervisor?.signed ? (data.preFlight.signatures.supervisor.name || 'Signed') : ''}
                     </div>
                     <p>หัวหน้าหน่วย ({data.preFlight.signatures.supervisor?.time})</p>
                 </div>
             </div>
        </div>
      </div>

      {/* Page 2 */}
      <div className="page-break-before mt-8 pt-8">
         <div className="flex justify-between mb-2 border-b pb-2">
             <span className="font-bold">แบบฟอร์มกำกับการขนส่ง (ต่อ)</span>
             <span className="text-xs border border-black p-1">หน้า ๒ จาก ๒</span>
         </div>

         <div className={headerStyle}>๕. รายการเวชภัณฑ์ (Items List)</div>
         <table className="w-full text-xs border-collapse border border-black">
             <thead>
                 <tr className="bg-gray-100">
                     <th className="border border-black p-1 text-left">รายการ</th>
                     <th className="border border-black p-1 w-12 text-center">จำนวน</th>
                     <th className="border border-black p-1 w-12 text-center">หน่วย</th>
                     <th className="border border-black p-1 w-20">Lot No.</th>
                     <th className="border border-black p-1 w-20">Exp.</th>
                     <th className="border border-black p-1 w-20">Temp</th>
                 </tr>
             </thead>
             <tbody>
                 {data.items && data.items.length > 0 ? data.items.map((item, i) => (
                     <tr key={i}>
                         <td className="border border-black p-1">{item.description}</td>
                         <td className="border border-black p-1 text-center">{item.qty}</td>
                         <td className="border border-black p-1 text-center">{item.unit}</td>
                         <td className="border border-black p-1">{item.lotNo}</td>
                         <td className="border border-black p-1">{item.expiryDate}</td>
                         <td className="border border-black p-1">{item.tempRange}</td>
                     </tr>
                 )) : (
                     <tr><td colSpan={6} className="border border-black p-4 text-center text-gray-400">ไม่มีรายการ</td></tr>
                 )}
                 {/* Fill empty rows to look like form */}
                 {[...Array(Math.max(0, 5 - (data.items?.length || 0)))].map((_, i) => (
                      <tr key={`empty-${i}`}><td className="border border-black p-1">&nbsp;</td><td className="border border-black"></td><td className="border border-black"></td><td className="border border-black"></td><td className="border border-black"></td><td className="border border-black"></td></tr>
                 ))}
             </tbody>
         </table>

         <div className={headerStyle}>๖. บันทึกการส่งมอบ (Handover Log)</div>
         <table className="w-full text-xs border-collapse border border-black mb-2">
             <thead>
                 <tr className="bg-gray-100">
                     <th className="border border-black p-1">วัน/เวลา</th>
                     <th className="border border-black p-1">ส่งมอบจาก</th>
                     <th className="border border-black p-1">รับมอบโดย</th>
                     <th className="border border-black p-1">ID/Code</th>
                     <th className="border border-black p-1 w-12">Sign</th>
                 </tr>
             </thead>
             <tbody>
                 {data.handovers && data.handovers.length > 0 ? data.handovers.map((h, i) => (
                     <tr key={i}>
                         <td className="border border-black p-1">{h.dateTime}</td>
                         <td className="border border-black p-1">{h.fromName}</td>
                         <td className="border border-black p-1">{h.toName}</td>
                         <td className="border border-black p-1">{h.idCard}</td>
                         <td className="border border-black p-1 text-center">{h.signed ? '✓' : ''}</td>
                     </tr>
                 )) : (
                     <tr><td colSpan={5} className="border border-black p-2 text-center text-gray-400">-</td></tr>
                 )}
             </tbody>
         </table>

         <div className={headerStyle}>๗. บันทึกอุณหภูมิ (Temperature Log)</div>
         <div className="border border-black p-2 text-xs mb-2">
             <div className="flex gap-4 mb-2">
                 <span><b>Logger ID:</b> {data.tempLogConfig?.loggerId}</span>
                 <span><b>Target Range:</b> {data.tempLogConfig?.targetRange}</span>
             </div>
             <table className="w-full border-collapse border border-gray-400">
                 <thead>
                     <tr className="bg-gray-100">
                         <th className="border border-gray-400 p-1">Checkpoint</th>
                         <th className="border border-gray-400 p-1">Time</th>
                         <th className="border border-gray-400 p-1">Temp (°C)</th>
                         <th className="border border-gray-400 p-1">Recorder</th>
                     </tr>
                 </thead>
                 <tbody>
                    {data.tempLogs && data.tempLogs.length > 0 ? data.tempLogs.map((l, i) => (
                        <tr key={i}>
                            <td className="border border-gray-400 p-1">{l.checkpoint}</td>
                            <td className="border border-gray-400 p-1">{l.dateTime}</td>
                            <td className="border border-gray-400 p-1">{l.temp}</td>
                            <td className="border border-gray-400 p-1">{l.recorderName}</td>
                        </tr>
                    )) : (
                        <tr><td colSpan={4} className="border border-gray-400 p-1 text-center">-</td></tr>
                    )}
                 </tbody>
             </table>
         </div>

         <div className={headerStyle}>๘. เหตุผิดปกติหรือการเบี่ยงเบน (Anomalies)</div>
         <div className="border border-black p-2 text-xs min-h-[60px]">
             {data.anomalies || '-'}
         </div>

         <div className={headerStyle}>๙. การรับรองเมื่อถึงปลายทาง (Destination Certification)</div>
         <div className="border border-black p-2 text-xs">
              <div className="flex gap-4 mb-2">
                  <span className="font-bold">ผลการตรวจรับ:</span>
                  <CheckBox checked={data.destination.result === 'Complete'} label="ครบถ้วนสมบูรณ์" />
                  <CheckBox checked={data.destination.result === 'WithRemarks'} label="มีข้อสังเกต" />
                  <CheckBox checked={data.destination.result === 'Rejected'} label="ปฏิเสธการรับ" />
              </div>
              <div className="mb-2">
                  <span className="font-bold">หมายเหตุ:</span> {data.destination.remarks}
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4 border-t border-dashed border-gray-500 pt-2">
                  <div className="text-center">
                       <div className="mb-4 pt-4 border-b border-dotted border-black">
                           {data.destination.receiverSign.signed ? (data.destination.receiverSign.name || 'Signed') : ''}
                       </div>
                       <p>ผู้รับมอบปลายทาง</p>
                       <p className="text-[10px]">วันที่: {data.destination.receiverSign.date} เวลา: {data.destination.receiverSign.time}</p>
                  </div>
                   <div className="text-center">
                       <div className="mb-4 pt-4 border-b border-dotted border-black">
                           {data.destination.controllerSign.signed ? (data.destination.controllerSign.name || 'Signed') : ''}
                       </div>
                       <p>ผู้ควบคุมภารกิจ/โดรน</p>
                       <p className="text-[10px]">วันที่: {data.destination.controllerSign.date} เวลา: {data.destination.controllerSign.time}</p>
                  </div>
              </div>
         </div>
      </div>
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          body {
            background: white;
            -webkit-print-color-adjust: exact;
          }
          .page-break-after {
            page-break-after: always;
          }
          .page-break-before {
            page-break-before: always;
          }
        }
      `}</style>
    </div>
  );
});

ManifestPrint.displayName = 'ManifestPrint';

export default ManifestPrint;
