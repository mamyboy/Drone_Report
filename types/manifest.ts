export type FlightMode = 'VLOS' | 'EVLOS' | 'BVLOS' | 'Auto' | 'Manual';
export type CargoType = 'Medicine' | 'Vaccine' | 'MedicalSupplies' | 'Blood' | 'LabSpecimen' | 'Organ' | 'Other';
export type TempRange = 'Room' | '2-8C' | '-20C' | '-80C' | 'Other';
export type RiskType = 'None' | 'Biologic' | 'Infectious' | 'Sharp' | 'Other';

export interface TransportManifest {
  id: string;
  status: 'Draft' | 'PreFlightSigned' | 'InTransit' | 'Delivered' | 'Completed' | 'Rejected';

  // Header
  unitName: string;
  docNumber: string;
  projectName: string;
  version: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm

  // Section 1: Points
  sender: {
    unitName: string;
    address: string;
    name: string;
    position: string;
    phone: string;
    contact: string; // email/contact
  };
  receiver: {
    unitName: string;
    address: string;
    name: string;
    position: string;
    phone: string;
    contact: string;
  };

  // Section 2: Mission
  mission: {
    code: string;
    date: string;
    timeRange: string;
    provider: string;
    pilot: string;
    controller: string;
    uavModel: string;
    uavSerial: string;
    batterySet: string;
    takeoffPoint: string;
    landingPoint: string;
    distanceKm: number;
    altitudeM: number;
    weather: string;
    specialConditions: string;
    flightMode: FlightMode;
  };

  // Section 3: Cargo Summary
  cargo: {
    types: CargoType[];
    description: string;
    packageCount: number;
    urgency: string;
    weightKg: number;
    tempControl: {
      range: TempRange;
      otherRange?: string; // If 'Other'
      containerType: string;
      loggerId: string;
      sealNumber: string;
    };
    risk: RiskType;
  };

  // Section 4: Validation (Checklist & Signatures)
  preFlight: {
    checklist: {
      identityConfirmed: boolean;
      areaSafe: boolean;
      cargoChecked: boolean;
      emergencyPlan: boolean;
      startTempRecorded: boolean;
      signalTested: boolean;
      labelingChecked: boolean;
      weightChecked: boolean;
      weatherChecked: boolean;
      docsChecked: boolean;
      systemChecked: boolean;
      etaNotified: boolean;
    };
    signatures: {
      sender: { name: string; signed: boolean; time: string };
      pilot: { name: string; signed: boolean; time: string };
      supervisor?: { name: string; signed: boolean; time: string };
    };
  };

  // Section 5: Items
  items: Array<{
    id: string;
    description: string;
    qty: number;
    unit: string;
    lotNo: string;
    expiryDate: string;
    tempRange: string;
    remarks: string;
  }>;

  // Section 6: Handover Log
  handovers: Array<{
    id: string;
    dateTime: string;
    fromName: string;
    toName: string;
    idCard: string;
    signed: boolean;
  }>;

  // Section 7: Temperature Log
  tempLogs: Array<{
    id: string;
    checkpoint: string;
    dateTime: string;
    temp: number;
    recorderName: string;
    remarks: string;
  }>;
  tempLogConfig: {
    loggerId: string;
    targetRange: string;
  };

  // Section 8: Anomalies
  anomalies: string;

  // Section 9: Destination Rec
  destination: {
    result: 'Complete' | 'WithRemarks' | 'Rejected';
    remarks: string;
    receiverSign: { name: string; position: string; signed: boolean; date: string; time: string };
    controllerSign: { name: string; signed: boolean; date: string; time: string };
  };
}
