export type UserRole = 'student' | 'driver' | 'admin';

export type BusStatus =
  | 'Active'
  | 'On Route'
  | 'Delayed'
  | 'Breakdown'
  | 'Standby'
  | 'Maintenance';

export type TripStatus =
  | 'Not Started'
  | 'In Transit'
  | 'Completed'
  | 'Delayed'
  | 'Halted';

export interface Bus {
  id: string;
  busNumber: string; // e.g. "BUS-12", "BUS-08"
  registrationNumber: string; // e.g. "MP-09-AB-4521"
  capacity: number; // e.g. 52
  status: BusStatus;
  assignedDriverId: string;
  currentRouteId?: string;
  currentStopIndex: number;
  speedKmH: number;
  fuelPercentage: number;
  lastUpdated: string;
}

export interface Driver {
  id: string;
  name: string;
  mobile: string;
  licenseNumber: string;
  assignedBusId?: string;
  experienceYears: number;
  rating: number;
  avatarUrl?: string;
}

export interface Stop {
  id: string;
  name: string;
  landmark: string;
  lat: number;
  lng: number;
}

export interface RouteStop {
  stopId: string;
  stopName: string;
  landmark: string;
  sequence: number; // 1, 2, 3...
  scheduledTime: string; // "07:10 AM"
  estimatedTime: string; // live calculated
  distanceFromPreviousKm: number;
}

export interface BusRoute {
  id: string;
  name: string; // e.g. "Rau Campus Express"
  code: string; // e.g. "RT-RAU"
  startPoint: string;
  endPoint: string;
  stops: RouteStop[];
  totalDistanceKm: number;
  status: 'Active' | 'Modified' | 'Delayed';
}

export interface Student {
  id: string;
  enrollmentNumber: string;
  name: string;
  email: string;
  mobile: string;
  department: string;
  semester: string;
  routeId: string;
  pickupStopId: string;
  avatarUrl?: string;
}

export interface DailyAssignment {
  id: string;
  date: string; // YYYY-MM-DD
  routeId: string;
  busId: string;
  driverId: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Changed' | 'Replaced';
  tripStatus: TripStatus;
  originalBusId?: string;
  replacementReason?: string;
  changedAt?: string;
  currentStopIndex: number; // index of stop currently reached
  delayMinutes: number;
  delayReason?: string;
}

export interface BreakdownEvent {
  id: string;
  busId: string;
  routeId: string;
  driverId: string;
  reportedAt: string;
  problemDescription: string;
  locationStopId?: string;
  locationText?: string;
  replacementBusId?: string;
  resolved: boolean;
}

export interface Complaint {
  id: string;
  studentId: string;
  studentName: string;
  studentEnrollment: string;
  routeId: string;
  busId: string;
  category:
    | 'Bus not arriving'
    | 'Overcrowding'
    | 'Wrong bus assignment'
    | 'Timing problem'
    | 'Driver issue'
    | 'Route problem'
    | 'Other';
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'In Review' | 'Resolved';
  adminReply?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface SystemNotification {
  id: string;
  targetAudience: 'all' | 'route' | 'student';
  targetRouteId?: string;
  targetStudentId?: string;
  title: string;
  message: string;
  type: 'bus_change' | 'replacement' | 'breakdown' | 'delay' | 'announcement' | 'sos';
  createdAt: string;
  read: boolean;
  busId?: string;
}

export interface ScheduledTrip {
  id: string;
  routeId: string;
  tripTitle: string;
  shiftType: 'Morning Inbound' | 'Afternoon Outbound' | 'Evening Return' | 'Special Exam Run';
  departureTime: string;
  estimatedArrivalTime: string;
  busId: string;
  driverId: string;
  daysActive: string;
  status: 'Scheduled' | 'In Transit' | 'Completed' | 'Cancelled';
}

export interface BusPass {
  id: string;
  studentId: string;
  studentName: string;
  enrollmentNumber: string;
  department: string;
  semester: string;
  routeId: string;
  routeName: string;
  pickupStopId: string;
  pickupStopName: string;
  busNumber: string;
  validFrom: string;
  validUntil: string;
  status: 'Active' | 'Pending Renewal' | 'Expired' | 'Suspended';
  feeStatus: 'Paid' | 'Pending Verification' | 'Exempted';
  feeAmount: number;
  qrCodeData: string;
  issuedDate: string;
  avatarUrl?: string;
}

