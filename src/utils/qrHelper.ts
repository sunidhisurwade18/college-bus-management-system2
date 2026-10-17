import { BusPass, Student } from '../types';

export interface QRVerificationResult {
  isValid: boolean;
  pass?: BusPass;
  studentName: string;
  enrollmentNumber: string;
  department: string;
  semester: string;
  busNumber: string;
  routeName: string;
  pickupStopName: string;
  validUntil: string;
  feeStatus: string;
  status: string;
  verificationMessage: string;
  verificationCode:
    | 'VALID'
    | 'EXPIRED'
    | 'UNPAID'
    | 'SUSPENDED'
    | 'WRONG_BUS'
    | 'NOT_FOUND'
    | 'INVALID_FORMAT';
  scannedAt: string;
}

/**
 * Generate standard unique JSON identity payload to be encoded in the student's Bus Pass QR code.
 * This JSON is readable by standard phone cameras (Google Lens, iPhone Camera)
 * as well as our in-app scanner.
 */
export function generatePassQRPayload(pass: BusPass): string {
  const payload = {
    app: 'CAMPUS_TRANSIT',
    version: '2.0',
    passId: pass.id,
    studentId: pass.studentId,
    name: pass.studentName,
    enrollment: pass.enrollmentNumber,
    department: pass.department,
    semester: pass.semester,
    busNumber: pass.busNumber,
    route: pass.routeName,
    pickupStop: pass.pickupStopName,
    validFrom: pass.validFrom,
    validUntil: pass.validUntil,
    feeStatus: pass.feeStatus,
    status: pass.status,
    authHash: `VERIFIED-${pass.enrollmentNumber.replace(/[^A-Za-z0-9]/g, '')}-${pass.busNumber}`,
  };

  return JSON.stringify(payload);
}

/**
 * Parse any scanned QR string (JSON, text format, or raw ID) and verify it against system data.
 * Optionally validates if the student is boarding the right bus (`targetBusNumber`).
 */
export function verifyScannedQR(
  rawScannedText: string,
  systemPasses: BusPass[],
  systemStudents: Student[],
  targetBusNumber?: string
): QRVerificationResult {
  const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  let parsedData: any = null;

  // Attempt 1: Parse as JSON
  try {
    parsedData = JSON.parse(rawScannedText);
  } catch {
    // Attempt 2: Legacy format like CAMPUS-PASS-VERIFIED:0827CS231042:ROUTE-RAU:BUS-12
    if (rawScannedText.includes(':')) {
      const parts = rawScannedText.split(':');
      if (parts.length >= 2) {
        parsedData = {
          enrollment: parts[1],
          busNumber: parts[3] || '',
        };
      }
    } else {
      // Attempt 3: Raw Enrollment number or Pass ID
      parsedData = {
        enrollment: rawScannedText.trim(),
      };
    }
  }

  if (!parsedData) {
    return {
      isValid: false,
      studentName: 'Unknown',
      enrollmentNumber: rawScannedText.slice(0, 20),
      department: 'N/A',
      semester: 'N/A',
      busNumber: 'N/A',
      routeName: 'N/A',
      pickupStopName: 'N/A',
      validUntil: 'N/A',
      feeStatus: 'Unknown',
      status: 'Invalid',
      verificationMessage: 'Invalid QR format. Could not decode digital transit credentials.',
      verificationCode: 'INVALID_FORMAT',
      scannedAt: nowStr,
    };
  }

  const enrollment = parsedData.enrollment || parsedData.enrollmentNumber || '';
  const passId = parsedData.passId || '';
  const studentId = parsedData.studentId || '';

  // Look up pass in system
  const matchedPass = systemPasses.find(
    (p) =>
      (passId && p.id.toLowerCase() === passId.toLowerCase()) ||
      (enrollment && p.enrollmentNumber.toLowerCase() === enrollment.toLowerCase()) ||
      (studentId && p.studentId === studentId)
  );

  const matchedStudent = systemStudents.find(
    (s) =>
      (enrollment && s.enrollmentNumber.toLowerCase() === enrollment.toLowerCase()) ||
      (studentId && s.id === studentId)
  );

  // If found in passes:
  if (matchedPass) {
    const isSuspended = matchedPass.status === 'Suspended';
    const isExpired =
      matchedPass.status === 'Expired' ||
      (matchedPass.validUntil && new Date(matchedPass.validUntil).getTime() < Date.now());
    const isFeeUnpaid = matchedPass.feeStatus === 'Pending Verification';

    // Check wrong bus
    const isWrongBus =
      targetBusNumber &&
      matchedPass.busNumber.toLowerCase() !== targetBusNumber.toLowerCase();

    if (isSuspended) {
      return {
        isValid: false,
        pass: matchedPass,
        studentName: matchedPass.studentName,
        enrollmentNumber: matchedPass.enrollmentNumber,
        department: matchedPass.department,
        semester: matchedPass.semester,
        busNumber: matchedPass.busNumber,
        routeName: matchedPass.routeName,
        pickupStopName: matchedPass.pickupStopName,
        validUntil: matchedPass.validUntil,
        feeStatus: matchedPass.feeStatus,
        status: matchedPass.status,
        verificationMessage: '⛔ PASS SUSPENDED: Transport access has been temporarily blocked by administration.',
        verificationCode: 'SUSPENDED',
        scannedAt: nowStr,
      };
    }

    if (isExpired) {
      return {
        isValid: false,
        pass: matchedPass,
        studentName: matchedPass.studentName,
        enrollmentNumber: matchedPass.enrollmentNumber,
        department: matchedPass.department,
        semester: matchedPass.semester,
        busNumber: matchedPass.busNumber,
        routeName: matchedPass.routeName,
        pickupStopName: matchedPass.pickupStopName,
        validUntil: matchedPass.validUntil,
        feeStatus: matchedPass.feeStatus,
        status: 'Expired',
        verificationMessage: `⚠️ PASS EXPIRED: Validity ended on ${matchedPass.validUntil}. Renewal required.`,
        verificationCode: 'EXPIRED',
        scannedAt: nowStr,
      };
    }

    if (isWrongBus) {
      return {
        isValid: false,
        pass: matchedPass,
        studentName: matchedPass.studentName,
        enrollmentNumber: matchedPass.enrollmentNumber,
        department: matchedPass.department,
        semester: matchedPass.semester,
        busNumber: matchedPass.busNumber,
        routeName: matchedPass.routeName,
        pickupStopName: matchedPass.pickupStopName,
        validUntil: matchedPass.validUntil,
        feeStatus: matchedPass.feeStatus,
        status: matchedPass.status,
        verificationMessage: `⚠️ WRONG BUS: Student is authorized for ${matchedPass.busNumber}, but scanning on ${targetBusNumber}!`,
        verificationCode: 'WRONG_BUS',
        scannedAt: nowStr,
      };
    }

    if (isFeeUnpaid) {
      return {
        isValid: true, // conditionally valid with fee warning
        pass: matchedPass,
        studentName: matchedPass.studentName,
        enrollmentNumber: matchedPass.enrollmentNumber,
        department: matchedPass.department,
        semester: matchedPass.semester,
        busNumber: matchedPass.busNumber,
        routeName: matchedPass.routeName,
        pickupStopName: matchedPass.pickupStopName,
        validUntil: matchedPass.validUntil,
        feeStatus: matchedPass.feeStatus,
        status: matchedPass.status,
        verificationMessage: '⚠️ FEE PENDING: Pass verified but institutional term fee verification is pending.',
        verificationCode: 'UNPAID',
        scannedAt: nowStr,
      };
    }

    // Success / Valid
    return {
      isValid: true,
      pass: matchedPass,
      studentName: matchedPass.studentName,
      enrollmentNumber: matchedPass.enrollmentNumber,
      department: matchedPass.department,
      semester: matchedPass.semester,
      busNumber: matchedPass.busNumber,
      routeName: matchedPass.routeName,
      pickupStopName: matchedPass.pickupStopName,
      validUntil: matchedPass.validUntil,
      feeStatus: matchedPass.feeStatus,
      status: matchedPass.status,
      verificationMessage: '✅ VERIFIED ACTIVE PASS: Student credentials cleared for boarding.',
      verificationCode: 'VALID',
      scannedAt: nowStr,
    };
  }

  // If found in students table but pass record missing:
  if (matchedStudent) {
    return {
      isValid: false,
      studentName: matchedStudent.name,
      enrollmentNumber: matchedStudent.enrollmentNumber,
      department: matchedStudent.department,
      semester: matchedStudent.semester,
      busNumber: parsedData.busNumber || 'Unassigned',
      routeName: parsedData.route || 'Unassigned',
      pickupStopName: parsedData.pickupStop || 'Unknown Stop',
      validUntil: parsedData.validUntil || 'N/A',
      feeStatus: 'Unregistered Pass',
      status: 'No Pass',
      verificationMessage: '⚠️ STUDENT REGISTERED BUT NO VALID PASS FOUND: Please contact transit admin desk.',
      verificationCode: 'NOT_FOUND',
      scannedAt: nowStr,
    };
  }

  // If completely unknown
  return {
    isValid: false,
    studentName: parsedData.name || 'Unknown Student',
    enrollmentNumber: enrollment || 'N/A',
    department: parsedData.department || 'N/A',
    semester: parsedData.semester || 'N/A',
    busNumber: parsedData.busNumber || 'N/A',
    routeName: parsedData.route || 'N/A',
    pickupStopName: parsedData.pickupStop || 'N/A',
    validUntil: parsedData.validUntil || 'N/A',
    feeStatus: 'Not in System',
    status: 'Unverified',
    verificationMessage: '❌ RECORD NOT FOUND: This QR code does not belong to an authorized campus passenger.',
    verificationCode: 'NOT_FOUND',
    scannedAt: nowStr,
  };
}
