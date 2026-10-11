import React, { useState } from 'react';
import { useBus } from '../../context/BusContext';
import {
  Bus as BusIcon,
  Navigation,
  Users,
  AlertTriangle,
  RefreshCw,
  Plus,
  Shield,
  Clock,
  MessageSquare,
  Send,
  FileText,
  CheckCircle2,
  Filter,
  Search,
  ExternalLink,
  Sparkles,
  Phone,
  BarChart3,
  Calendar,
  Trash2,
  Edit3,
  Download,
  Database,
  CreditCard,
  QrCode,
  Printer,
  Check,
  Layers,
  Timer,
  ChevronRight,
} from 'lucide-react';
import {
  Bus,
  BusRoute,
  RouteStop,
  SystemNotification,
  Driver,
  Student,
  ScheduledTrip,
  BusPass,
} from '../../types';
import { DigitalBusPassModal } from '../pass/DigitalBusPassModal';

export const AdminDashboard: React.FC = () => {
  const {
    buses,
    drivers,
    routes,
    students,
    assignments,
    complaints,
    notifications,
    breakdowns,
    scheduledTrips,
    busPasses,
    changeAssignedBus,
    assignReplacementBus,
    reportBreakdown,
    resolveComplaint,
    sendBroadcastNotification,
    getBusOccupancy,
    addBus,
    deleteBus,
    updateBusStatus,
    addDriver,
    deleteDriver,
    updateRouteStops,
    addRoute,
    deleteRoute,
    updateStudentPickupStop,
    updateStopTiming,
    updateStopDetails,
    addStopToRoute,
    deleteStopFromRoute,
    addScheduledTrip,
    updateScheduledTrip,
    deleteScheduledTrip,
    issueBusPass,
    updateBusPassStatus,
    deleteBusPass,
    addStudent,
    deleteStudent,
    bulkAddDemoStudents,
  } = useBus();

  const [activeTab, setActiveTab] = useState<
    | 'allocations'
    | 'breakdowns'
    | 'capacity'
    | 'routes'
    | 'passes'
    | 'fleet'
    | 'students'
    | 'complaints'
    | 'broadcast'
    | 'reports'
  >('allocations');

  // Interactive Route & Schedule Panel State
  const [selectedRouteTabId, setSelectedRouteTabId] = useState<string>(
    routes[0]?.id || 'route-rau'
  );
  const [showEditStopModal, setShowEditStopModal] = useState<{
    routeId: string;
    stopId: string;
    stopName: string;
    landmark: string;
    scheduledTime: string;
  } | null>(null);

  // Trip Schedule State
  const [showAddTripModal, setShowAddTripModal] = useState(false);
  const [editingTrip, setEditingTrip] = useState<ScheduledTrip | null>(null);
  const [tripFormTitle, setTripFormTitle] = useState('');
  const [tripFormShift, setTripFormShift] = useState<ScheduledTrip['shiftType']>('Morning Inbound');
  const [tripFormDepTime, setTripFormDepTime] = useState('07:15 AM');
  const [tripFormArrTime, setTripFormArrTime] = useState('08:20 AM');
  const [tripFormBusId, setTripFormBusId] = useState(buses[0]?.id || '');
  const [tripFormDriverId, setTripFormDriverId] = useState(drivers[0]?.id || '');
  const [tripFormDays, setTripFormDays] = useState('Mon - Sat');
  const [tripFormStatus, setTripFormStatus] = useState<ScheduledTrip['status']>('Scheduled');
  const [tripDeleteConfirmId, setTripDeleteConfirmId] = useState<string | null>(null);

  // Bus Pass Management State
  const [viewingPass, setViewingPass] = useState<BusPass | null>(null);
  const [showIssuePassModal, setShowIssuePassModal] = useState(false);
  const [passSearch, setPassSearch] = useState('');
  const [passFilterStatus, setPassFilterStatus] = useState<string>('all');
  const [passFilterRoute, setPassFilterRoute] = useState<string>('all');

  // Issue Pass Form State
  const [issuePassStuId, setIssuePassStuId] = useState(students[0]?.id || '');
  const [issuePassRouteId, setIssuePassRouteId] = useState(routes[0]?.id || '');
  const [issuePassStopId, setIssuePassStopId] = useState(routes[0]?.stops[0]?.stopId || '');
  const [issuePassBusNumber, setIssuePassBusNumber] = useState(buses[0]?.busNumber || 'BUS-12');
  const [issuePassFeeAmount, setIssuePassFeeAmount] = useState<number>(8500);
  const [issuePassFeeStatus, setIssuePassFeeStatus] = useState<BusPass['feeStatus']>('Paid');
  const [issuePassValidUntil, setIssuePassValidUntil] = useState('31 Dec 2026');

  // Modals state
  const [showSwapModal, setShowSwapModal] = useState<string | null>(null); // routeId
  const [selectedNewBusId, setSelectedNewBusId] = useState<string>('');
  const [swapReason, setSwapReason] = useState<string>('Daily fleet balancing & maintenance rotation');

  const [showReplacementModal, setShowReplacementModal] = useState<string | null>(null); // breakdownId
  const [selectedReplacementBusId, setSelectedReplacementBusId] = useState<string>('');

  const [showAddBusModal, setShowAddBusModal] = useState(false);
  const [newBusNumber, setNewBusNumber] = useState('');
  const [newBusReg, setNewBusReg] = useState('');
  const [newBusCapacity, setNewBusCapacity] = useState(52);
  const [newBusDriverId, setNewBusDriverId] = useState('');

  const [showReplyComplaintId, setShowReplyComplaintId] = useState<string | null>(null);
  const [complaintReplyText, setComplaintReplyText] = useState('');

  // Add Driver state
  const [showAddDriverModal, setShowAddDriverModal] = useState(false);
  const [newDriverName, setNewDriverName] = useState('');
  const [newDriverMobile, setNewDriverMobile] = useState('');
  const [newDriverLicense, setNewDriverLicense] = useState('');
  const [newDriverExp, setNewDriverExp] = useState(5);
  const [newDriverBusId, setNewDriverBusId] = useState('');

  // Add Route state
  const [showAddRouteModal, setShowAddRouteModal] = useState(false);
  const [newRouteName, setNewRouteName] = useState('');
  const [newRouteCode, setNewRouteCode] = useState('');
  const [newRouteStart, setNewRouteStart] = useState('');
  const [newRouteEnd, setNewRouteEnd] = useState('Central College Campus');
  const [newRouteDistance, setNewRouteDistance] = useState(25);
  const [newRouteBusId, setNewRouteBusId] = useState('');
  const [newRouteDriverId, setNewRouteDriverId] = useState('');
  const [newRouteStopsText, setNewRouteStopsText] = useState(
    'Khajrana Square: 07:15 AM\nBengali Underpass: 07:30 AM\nRing Road Flyover: 07:45 AM\nCentral College Campus: 08:15 AM'
  );

  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastAudience, setBroadcastAudience] = useState<'all' | 'route'>('all');
  const [broadcastRouteId, setBroadcastRouteId] = useState(routes[0]?.id || '');
  const [broadcastType, setBroadcastType] = useState<SystemNotification['type']>('announcement');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  const [studentSearch, setStudentSearch] = useState('');
  const [studentRouteFilter, setStudentRouteFilter] = useState('all');
  const [studentCurrentPage, setStudentCurrentPage] = useState(1);
  const studentsPerPage = 8;

  // Add Student State
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStuName, setNewStuName] = useState('');
  const [newStuEnroll, setNewStuEnroll] = useState('');
  const [newStuEmail, setNewStuEmail] = useState('');
  const [newStuMobile, setNewStuMobile] = useState('');
  const [newStuDept, setNewStuDept] = useState('Computer Science & Engineering');
  const [newStuSem, setNewStuSem] = useState('6th Semester');
  const [newStuRouteId, setNewStuRouteId] = useState(routes[0]?.id || '');
  const [newStuStopId, setNewStuStopId] = useState(routes[0]?.stops[0]?.stopId || '');

  // Edit Stop Timing state
  const [editingStop, setEditingStop] = useState<{
    routeId: string;
    stopId: string;
    stopName: string;
    currentTime: string;
  } | null>(null);
  const [editTimingInput, setEditTimingInput] = useState('');

  // New Stop Modal
  const [showAddStopModal, setShowAddStopModal] = useState<string | null>(null); // routeId
  const [newStopName, setNewStopName] = useState('');
  const [newStopLandmark, setNewStopLandmark] = useState('');
  const [newStopTime, setNewStopTime] = useState('07:30 AM');

  // Calculated high level metrics
  const activeBusesCount = buses.filter((b) => b.status === 'Active' || b.status === 'On Route').length;
  const inTransitCount = assignments.filter((a) => a.tripStatus === 'In Transit').length;
  const activeBreakdownsCount = breakdowns.filter((b) => !b.resolved).length;
  const pendingComplaintsCount = complaints.filter((c) => c.status === 'Pending').length;

  // Available buses for swap / replacement
  const availableBusesForSwap = (currentBusId?: string) =>
    buses.filter((b) => b.id !== currentBusId && b.status !== 'Breakdown' && b.status !== 'Maintenance');

  const handleExecuteSwap = (e: React.FormEvent) => {
    e.preventDefault();
    if (showSwapModal && selectedNewBusId) {
      changeAssignedBus(showSwapModal, selectedNewBusId, swapReason);
      setShowSwapModal(null);
      setSelectedNewBusId('');
    }
  };

  const handleExecuteReplacement = (e: React.FormEvent) => {
    e.preventDefault();
    if (showReplacementModal && selectedReplacementBusId) {
      assignReplacementBus(showReplacementModal, selectedReplacementBusId);
      setShowReplacementModal(null);
      setSelectedReplacementBusId('');
    }
  };

  const handleCreateBus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBusNumber || !newBusReg) return;
    addBus({
      busNumber: newBusNumber,
      registrationNumber: newBusReg,
      capacity: Number(newBusCapacity),
      status: 'Standby',
      assignedDriverId: newBusDriverId,
      speedKmH: 0,
      fuelPercentage: 100,
    });
    setShowAddBusModal(false);
    setNewBusNumber('');
    setNewBusReg('');
  };

  const handleCreateDriver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDriverName || !newDriverMobile) return;
    addDriver({
      name: newDriverName,
      mobile: newDriverMobile,
      licenseNumber: newDriverLicense || `MP-IND-2024-${Math.floor(10000 + Math.random() * 90000)}`,
      experienceYears: Number(newDriverExp),
      rating: 4.8,
      assignedBusId: newDriverBusId || undefined,
    });
    setShowAddDriverModal(false);
    setNewDriverName('');
    setNewDriverMobile('');
    setNewDriverLicense('');
    setNewDriverBusId('');
  };

  const handleCreateRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRouteName || !newRouteCode) return;

    // Parse stops from textarea
    const lines = newRouteStopsText.split('\n').filter((l) => l.trim().length > 0);
    const stopsList: RouteStop[] = lines.map((line, index) => {
      const parts = line.split(':');
      const stopName = parts[0]?.trim() || `Stop ${index + 1}`;
      const schedTime = parts.slice(1).join(':').trim() || `07:${15 + index * 12} AM`;
      return {
        stopId: `stop-custom-${Date.now()}-${index}`,
        stopName,
        landmark: 'Junction Boarding Point',
        sequence: index + 1,
        scheduledTime: schedTime,
        estimatedTime: schedTime,
        distanceFromPreviousKm: index === 0 ? 0 : 3.5,
      };
    });

    const routeId = `route-${newRouteCode.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    const newRouteObj: BusRoute = {
      id: routeId,
      name: newRouteName,
      code: newRouteCode.toUpperCase(),
      startPoint: newRouteStart || stopsList[0]?.stopName || 'Transit Origin',
      endPoint: newRouteEnd || 'Central College Campus',
      totalDistanceKm: Number(newRouteDistance) || 24,
      status: 'Active',
      stops: stopsList,
    };

    addRoute(newRouteObj, newRouteBusId || undefined, newRouteDriverId || undefined);
    setShowAddRouteModal(false);
    setNewRouteName('');
    setNewRouteCode('');
    setNewRouteStart('');
  };

  const handleResolveComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (showReplyComplaintId && complaintReplyText) {
      resolveComplaint(showReplyComplaintId, complaintReplyText);
      setShowReplyComplaintId(null);
      setComplaintReplyText('');
    }
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMessage) return;
    sendBroadcastNotification(
      broadcastTitle,
      broadcastMessage,
      broadcastType,
      broadcastAudience,
      broadcastAudience === 'route' ? broadcastRouteId : undefined
    );
    setBroadcastSuccess(true);
    setTimeout(() => {
      setBroadcastSuccess(false);
      setBroadcastTitle('');
      setBroadcastMessage('');
    }, 2500);
  };

  const handleAddStopToRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showAddStopModal || !newStopName) return;
    const targetRoute = routes.find((r) => r.id === showAddStopModal);
    if (!targetRoute) return;

    const newStop: RouteStop = {
      stopId: `stop-${Date.now()}`,
      stopName: newStopName,
      landmark: newStopLandmark || 'Transit Point',
      sequence: targetRoute.stops.length + 1,
      scheduledTime: newStopTime,
      estimatedTime: newStopTime,
      distanceFromPreviousKm: 3.0,
    };

    updateRouteStops(showAddStopModal, [...targetRoute.stops, newStop]);
    setShowAddStopModal(null);
    setNewStopName('');
    setNewStopLandmark('');
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStuName || !newStuEnroll) return;
    const assignedRoute = routes.find((r) => r.id === newStuRouteId) || routes[0];
    const assignedStop =
      assignedRoute?.stops.find((s) => s.stopId === newStuStopId) || assignedRoute?.stops[0];

    addStudent({
      name: newStuName,
      enrollmentNumber: newStuEnroll,
      email: newStuEmail || `${newStuName.toLowerCase().replace(/\s+/g, '.')}@college.edu.in`,
      mobile: newStuMobile || '+91 98930 00000',
      department: newStuDept,
      semester: newStuSem,
      routeId: assignedRoute?.id || routes[0]?.id || '',
      pickupStopId: assignedStop?.stopId || assignedRoute?.stops[0]?.stopId || '',
    });

    setShowAddStudentModal(false);
    setNewStuName('');
    setNewStuEnroll('');
    setNewStuMobile('');
    setNewStuEmail('');
  };

  const handleUpdateStopTiming = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStop || !editTimingInput) return;
    updateStopTiming(editingStop.routeId, editingStop.stopId, editTimingInput);
    setEditingStop(null);
    setEditTimingInput('');
  };

  const handleSaveStopDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showEditStopModal) return;
    updateStopDetails(showEditStopModal.routeId, showEditStopModal.stopId, {
      stopName: showEditStopModal.stopName,
      landmark: showEditStopModal.landmark,
      scheduledTime: showEditStopModal.scheduledTime,
    });
    setShowEditStopModal(null);
  };

  const handleOpenAddTrip = (routeId: string) => {
    setSelectedRouteTabId(routeId);
    setTripFormTitle('');
    setTripFormShift('Morning Inbound');
    setTripFormDepTime('07:15 AM');
    setTripFormArrTime('08:20 AM');
    setTripFormBusId(buses[0]?.id || '');
    setTripFormDriverId(drivers[0]?.id || '');
    setTripFormDays('Mon - Sat');
    setTripFormStatus('Scheduled');
    setEditingTrip(null);
    setShowAddTripModal(true);
  };

  const handleOpenEditTrip = (trip: ScheduledTrip) => {
    setEditingTrip(trip);
    setTripFormTitle(trip.tripTitle);
    setTripFormShift(trip.shiftType);
    setTripFormDepTime(trip.departureTime);
    setTripFormArrTime(trip.estimatedArrivalTime);
    setTripFormBusId(trip.busId);
    setTripFormDriverId(trip.driverId);
    setTripFormDays(trip.daysActive);
    setTripFormStatus(trip.status);
    setShowAddTripModal(true);
  };

  const handleSaveTrip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tripFormTitle) return;
    if (editingTrip) {
      updateScheduledTrip(editingTrip.id, {
        tripTitle: tripFormTitle,
        shiftType: tripFormShift,
        departureTime: tripFormDepTime,
        estimatedArrivalTime: tripFormArrTime,
        busId: tripFormBusId,
        driverId: tripFormDriverId,
        daysActive: tripFormDays,
        status: tripFormStatus,
      });
      setEditingTrip(null);
    } else {
      addScheduledTrip({
        routeId: selectedRouteTabId,
        tripTitle: tripFormTitle,
        shiftType: tripFormShift,
        departureTime: tripFormDepTime,
        estimatedArrivalTime: tripFormArrTime,
        busId: tripFormBusId || buses[0]?.id || 'bus-12',
        driverId: tripFormDriverId || drivers[0]?.id || 'driver-ramesh',
        daysActive: tripFormDays,
        status: tripFormStatus,
      });
    }
    setShowAddTripModal(false);
  };

  const handleDeleteTrip = (tripId: string) => {
    deleteScheduledTrip(tripId);
    setTripDeleteConfirmId(null);
  };

  const handleIssueBusPass = (e: React.FormEvent) => {
    e.preventDefault();
    const stu = students.find((s) => s.id === issuePassStuId);
    if (!stu) return;
    const r = routes.find((rt) => rt.id === issuePassRouteId) || routes[0];
    const st = r.stops.find((s) => s.stopId === issuePassStopId) || r.stops[0];

    issueBusPass({
      studentId: stu.id,
      studentName: stu.name,
      enrollmentNumber: stu.enrollmentNumber,
      department: stu.department,
      semester: stu.semester,
      routeId: r.id,
      routeName: r.name,
      pickupStopId: st.stopId,
      pickupStopName: `${st.stopName} (Stop #${st.sequence})`,
      busNumber: issuePassBusNumber,
      validFrom: '01 Jul 2026',
      validUntil: issuePassValidUntil,
      status: 'Active',
      feeStatus: issuePassFeeStatus,
      feeAmount: Number(issuePassFeeAmount),
      qrCodeData: `CAMPUS-PASS-VERIFIED:${stu.enrollmentNumber}:${r.code}:${issuePassBusNumber}:VALID-2026`,
      avatarUrl: stu.avatarUrl,
    });
    setShowIssuePassModal(false);
  };

  const handleExportStudentsCSV = () => {
    const headers = ['Student ID', 'Name', 'Enrollment', 'Email', 'Mobile', 'Department', 'Semester', 'Route', 'Pickup Stop'];
    const rows = students.map((s) => {
      const r = routes.find((rt) => rt.id === s.routeId);
      const stop = r?.stops.find((st) => st.stopId === s.pickupStopId);
      return [
        s.id,
        `"${s.name}"`,
        s.enrollmentNumber,
        s.email,
        s.mobile,
        `"${s.department}"`,
        s.semester,
        `"${r?.name || ''}"`,
        `"${stop?.stopName || ''}"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `college_bus_students_roster_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Admin Executive Header */}
      <div className="rounded-3xl bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5 text-purple-300 text-xs font-semibold uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              <span>Campus Transportation Authority · Central Control</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Fleet Tracking &amp; Allocation Desk
            </h1>
            <p className="text-xs text-purple-200 mt-1">
              Live monitoring of routes, same-day bus changes, vehicle breakdowns, and student capacity
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowAddBusModal(true)}
              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Bus</span>
            </button>
            <button
              onClick={() => setShowAddDriverModal(true)}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Driver</span>
            </button>
            <button
              onClick={() => setShowAddRouteModal(true)}
              className="px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Route</span>
            </button>
            <button
              onClick={() => setActiveTab('broadcast')}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Alert</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Strip (SRS Section 20) */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        <div className="rounded-2xl glass-panel p-4 border border-purple-200/80 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Total Fleet
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1 tabular-nums">
            {buses.length}
          </div>
          <div className="text-[10px] text-purple-600 font-medium mt-0.5">
            {activeBusesCount} Active / In Service
          </div>
        </div>

        <div className="rounded-2xl glass-panel p-4 border border-purple-200/80 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            In Transit
          </div>
          <div className="text-2xl font-black text-purple-700 mt-1 tabular-nums">
            {inTransitCount}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Morning commute trips</div>
        </div>

        <div className="rounded-2xl glass-panel p-4 border border-purple-200/80 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Breakdowns
          </div>
          <div
            className={`text-2xl font-black mt-1 tabular-nums ${
              activeBreakdownsCount > 0 ? 'text-rose-600' : 'text-slate-900'
            }`}
          >
            {activeBreakdownsCount}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {activeBreakdownsCount > 0 ? 'Action required' : 'Fleet healthy'}
          </div>
        </div>

        <div className="rounded-2xl glass-panel p-4 border border-purple-200/80 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Commuters
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1 tabular-nums">
            {students.length}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Active bus card holders</div>
        </div>

        <div className="rounded-2xl glass-panel p-4 border border-purple-200/80 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Fleet Capacity
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-1 tabular-nums">
            86%
          </div>
          <div className="text-[10px] text-emerald-700 font-medium mt-0.5">Optimal load</div>
        </div>

        <div className="rounded-2xl glass-panel p-4 border border-purple-200/80 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Complaints
          </div>
          <div
            className={`text-2xl font-black mt-1 tabular-nums ${
              pendingComplaintsCount > 0 ? 'text-amber-600' : 'text-slate-900'
            }`}
          >
            {pendingComplaintsCount}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Pending tickets</div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto border-b border-purple-200 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('allocations')}
          className={`px-3 py-1.5 rounded-xl transition-all shrink-0 ${
            activeTab === 'allocations'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-purple-50'
          }`}
        >
          Daily Allocation &amp; Bus Changes
        </button>

        <button
          onClick={() => setActiveTab('breakdowns')}
          className={`px-3 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1 ${
            activeTab === 'breakdowns'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-purple-50'
          }`}
        >
          <span>Breakdowns &amp; Replacements</span>
          {activeBreakdownsCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
              {activeBreakdownsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('capacity')}
          className={`px-3 py-1.5 rounded-xl transition-all shrink-0 ${
            activeTab === 'capacity'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-purple-50'
          }`}
        >
          Capacity &amp; Overload Monitor
        </button>

        <button
          onClick={() => setActiveTab('routes')}
          className={`px-3 py-1.5 rounded-xl transition-all shrink-0 ${
            activeTab === 'routes'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-purple-50'
          }`}
        >
          Route &amp; Schedule Manager
        </button>

        <button
          onClick={() => setActiveTab('passes')}
          className={`px-3 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1 ${
            activeTab === 'passes'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-purple-50'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Bus Pass Facility</span>
          <span className="px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold tabular-nums">
            {busPasses.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('fleet')}
          className={`px-3 py-1.5 rounded-xl transition-all shrink-0 ${
            activeTab === 'fleet'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-purple-50'
          }`}
        >
          Fleet &amp; Drivers
        </button>

        <button
          onClick={() => setActiveTab('students')}
          className={`px-3 py-1.5 rounded-xl transition-all shrink-0 ${
            activeTab === 'students'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-purple-50'
          }`}
        >
          Student Commuters
        </button>

        <button
          onClick={() => setActiveTab('complaints')}
          className={`px-3 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1 ${
            activeTab === 'complaints'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-purple-50'
          }`}
        >
          <span>Complaints Desk</span>
          {pendingComplaintsCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
              {pendingComplaintsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('broadcast')}
          className={`px-3 py-1.5 rounded-xl transition-all shrink-0 ${
            activeTab === 'broadcast'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-purple-50'
          }`}
        >
          Broadcast Alert
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-3 py-1.5 rounded-xl transition-all shrink-0 ${
            activeTab === 'reports'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-purple-50'
          }`}
        >
          Reports &amp; Logs
        </button>
      </div>

      {/* TAB 1: DAILY ALLOCATION & SAME-DAY BUS CHANGES (SRS Section 10 & 11) */}
      {activeTab === 'allocations' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-purple-50/70 p-4 rounded-2xl border border-purple-200/80">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Daily Route &amp; Bus Assignments (11 October 2026)
              </h2>
              <p className="text-xs text-slate-500">
                Manage vehicle and driver allocations for each college route with instant same-day reassignments.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-purple-700 bg-white px-3 py-1.5 rounded-xl border border-purple-200 font-semibold shadow-2xs">
                3 Active Routes Assigned
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {routes.map((route) => {
              const assignment = assignments.find((a) => a.routeId === route.id);
              const bus = buses.find((b) => b.id === assignment?.busId);
              const driver = drivers.find((d) => d.id === assignment?.driverId);
              const occupancy = bus ? getBusOccupancy(bus.id) : null;

              return (
                <div
                  key={route.id}
                  className="rounded-2xl glass-panel p-5 border border-purple-200/80 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        {route.code}
                      </span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          assignment?.status === 'Replaced'
                            ? 'bg-emerald-100 text-emerald-800'
                            : assignment?.status === 'Changed'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {assignment?.status || 'Scheduled'}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug">{route.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {route.startPoint} → {route.endPoint} ({route.stops.length} stops)
                    </p>

                    <div className="mt-4 p-3 rounded-xl bg-purple-50/50 border border-purple-100 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Operating Bus:</span>
                        <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                          <BusIcon className="w-3.5 h-3.5 text-purple-600" />
                          <span>{bus?.busNumber || 'None'}</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            ({bus?.registrationNumber})
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Assigned Driver:</span>
                        <span className="font-semibold text-slate-900">
                          {driver?.name || 'Unassigned'}
                        </span>
                      </div>

                      {occupancy && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Occupancy:</span>
                          <span className="font-semibold text-slate-900 tabular-nums">
                            {occupancy.assignedCount} / {occupancy.capacity} seats ({occupancy.occupancyPercent}%)
                          </span>
                        </div>
                      )}

                      {assignment?.originalBusId && (
                        <div className="pt-1.5 border-t border-purple-200/60 text-[11px] text-purple-800">
                          <span>Replaced original bus: </span>
                          <strong className="font-mono">
                            {buses.find((b) => b.id === assignment.originalBusId)?.busNumber}
                          </strong>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Same-day bus swap action button */}
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setShowSwapModal(route.id);
                        setSelectedNewBusId(
                          availableBusesForSwap(assignment?.busId)[0]?.id || ''
                        );
                      }}
                      className="w-full py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Same-Day Bus Change</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: BREAKDOWNS & REPLACEMENT BUS DISPATCHER (SRS Section 13 & 14) */}
      {activeTab === 'breakdowns' && (
        <div className="space-y-4">
          <div className="bg-rose-50/70 p-4 rounded-2xl border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Breakdown Management &amp; Standby Replacement Dispatcher
              </h2>
              <p className="text-xs text-slate-500">
                When a bus breaks down, immediately match and deploy an available replacement bus with suitable seat capacity.
              </p>
            </div>
            <button
              onClick={() => {
                // Simulate reporting breakdown on BUS-12 if none active
                const rauBus = buses.find((b) => b.busNumber === 'BUS-12');
                if (rauBus) {
                  reportBreakdown(
                    rauBus.id,
                    'Engine coolant leak and transmission overheating at Rajendra Nagar',
                    'Metro Station Pillar 42'
                  );
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Simulate Breakdown on BUS-12</span>
            </button>
          </div>

          {breakdowns.length === 0 ? (
            <div className="text-center py-12 rounded-2xl glass-panel border border-purple-200/60 text-slate-400">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
              <p className="text-sm font-semibold text-slate-700">Zero Active Breakdowns</p>
              <p className="text-xs text-slate-400 mt-1">
                All vehicles in the fleet are operating with normal status.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {breakdowns.map((bd) => {
                const brokenBus = buses.find((b) => b.id === bd.busId);
                const brokenRoute = routes.find((r) => r.id === bd.routeId);
                const brokenDriver = drivers.find((d) => d.id === bd.driverId);
                const replacementBus = bd.replacementBusId
                  ? buses.find((b) => b.id === bd.replacementBusId)
                  : null;

                return (
                  <div
                    key={bd.id}
                    className={`rounded-2xl p-5 border transition-all ${
                      bd.resolved
                        ? 'bg-white/80 border-purple-200 text-slate-800'
                        : 'bg-rose-50/40 border-rose-300 text-slate-900 shadow-sm'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rose-100 pb-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                          <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-base font-extrabold text-slate-900">
                              {brokenBus?.busNumber} (Breakdown)
                            </span>
                            <span className="text-[10px] font-mono text-slate-500">
                              {brokenBus?.registrationNumber}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500">
                            Affected Route: <strong>{brokenRoute?.name || 'Assigned Route'}</strong>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full ${
                            bd.resolved
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800 animate-pulse'
                          }`}
                        >
                          {bd.resolved ? 'Replacement Dispatched' : 'Action Required'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs mb-4">
                      <div>
                        <span className="text-slate-400 block">Reported Problem:</span>
                        <strong className="text-rose-900">{bd.problemDescription}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Location:</span>
                        <span className="text-slate-800 font-medium">{bd.locationText}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Reported Time / Driver:</span>
                        <span className="text-slate-800 font-medium">
                          {bd.reportedAt} · {brokenDriver?.name || 'Driver'}
                        </span>
                      </div>
                    </div>

                    {/* Replacement status or dispatch trigger */}
                    {bd.resolved ? (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>
                            Replacement bus <strong>{replacementBus?.busNumber}</strong>{' '}
                            (Driver: {drivers.find((d) => d.assignedBusId === replacementBus?.id)?.name})
                            is running on route. Students notified.
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="pt-2 flex items-center justify-between gap-3">
                        <div className="text-xs text-slate-600">
                          Select from standby buses (e.g. <strong>BUS-08</strong> or <strong>BUS-21</strong>)
                          to mobilize replacement immediately.
                        </div>
                        <button
                          onClick={() => {
                            setShowReplacementModal(bd.id);
                            // Preselect BUS-08 to match SRS Section 14 example!
                            const bus08 = buses.find((b) => b.busNumber === 'BUS-08');
                            setSelectedReplacementBusId(bus08 ? bus08.id : buses[1]?.id || '');
                          }}
                          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Assign Replacement Bus</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CAPACITY & OVERLOAD MONITORING (SRS Section 12) */}
      {activeTab === 'capacity' && (
        <div className="space-y-4">
          <div className="bg-purple-50/70 p-4 rounded-2xl border border-purple-200/80">
            <h2 className="text-sm font-bold text-slate-900">
              Fleet Capacity &amp; Overload Risk Monitoring
            </h2>
            <p className="text-xs text-slate-500">
              Monitor seating capacity across all vehicles to prevent overcrowding and rebalance underutilized buses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {buses.map((bus) => {
              const occupancy = getBusOccupancy(bus.id);
              const driver = drivers.find((d) => d.id === bus.assignedDriverId);
              const route = routes.find((r) => r.id === bus.currentRouteId);

              return (
                <div
                  key={bus.id}
                  className="rounded-2xl glass-panel p-5 border border-purple-200/80 shadow-xs space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-base font-extrabold text-slate-900">{bus.busNumber}</div>
                      <div className="text-xs text-slate-400 font-mono">
                        {bus.registrationNumber}
                      </div>
                    </div>

                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        occupancy.status === 'overloaded'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : occupancy.status === 'near_capacity'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : occupancy.status === 'underutilized'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {occupancy.status === 'overloaded'
                        ? 'Overload Warning'
                        : occupancy.status === 'near_capacity'
                        ? 'Near Capacity'
                        : occupancy.status === 'underutilized'
                        ? 'Underutilized'
                        : 'Balanced Load'}
                    </span>
                  </div>

                  {/* Capacity Numbers Strip (Matches SRS Section 12) */}
                  <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-100 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Total Capacity:</span>
                      <strong className="text-slate-900 tabular-nums">{occupancy.capacity} Seats</strong>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Assigned Students:</span>
                      <strong className="text-slate-900 tabular-nums">{occupancy.assignedCount}</strong>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Available Seats:</span>
                      <strong className="text-emerald-700 font-bold tabular-nums">
                        {occupancy.availableSeats}
                      </strong>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Occupancy Ratio:</span>
                      <strong className="text-purple-900 font-bold tabular-nums">
                        {occupancy.occupancyPercent}%
                      </strong>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          occupancy.status === 'overloaded'
                            ? 'bg-rose-500'
                            : occupancy.status === 'near_capacity'
                            ? 'bg-amber-500'
                            : occupancy.status === 'underutilized'
                            ? 'bg-blue-400'
                            : 'bg-purple-600'
                        }`}
                        style={{ width: `${Math.min(100, occupancy.occupancyPercent)}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 pt-1 border-t border-purple-100 flex items-center justify-between">
                    <span>Route: {route?.name || 'Standby Reserve'}</span>
                    <span>Driver: {driver?.name || 'Depot'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: INTERACTIVE ROUTE & SCHEDULE MANAGEMENT PANEL (SRS Section 8 & 9) */}
      {activeTab === 'routes' && (() => {
        const currentRoute =
          routes.find((r) => r.id === selectedRouteTabId) || routes[0];
        const routeTrips = scheduledTrips.filter(
          (t) => t.routeId === currentRoute?.id
        );
        const assignedBus = buses.find(
          (b) => b.currentRouteId === currentRoute?.id
        );
        const routeCommutersCount = students.filter(
          (s) => s.routeId === currentRoute?.id
        ).length;

        return (
          <div className="space-y-6">
            {/* Route Selection Tabs Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-purple-50/70 p-4 rounded-2xl border border-purple-200/80">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
                  Select Route:
                </span>
                {routes.map((r) => {
                  const isSelected = r.id === currentRoute?.id;
                  const tripCount = scheduledTrips.filter((t) => t.routeId === r.id).length;
                  return (
                    <button
                      key={r.id}
                      onClick={() => setSelectedRouteTabId(r.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'bg-white text-slate-700 hover:bg-purple-100/70 border border-purple-200/60'
                      }`}
                    >
                      <span className="font-mono">{r.code}</span>
                      <span>·</span>
                      <span className="truncate max-w-[130px]">{r.name}</span>
                      <span
                        className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                          isSelected
                            ? 'bg-purple-800 text-purple-100'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {r.stops.length} Stops · {tripCount} Shifts
                      </span>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setShowAddRouteModal(true)}
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs self-start sm:self-auto cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>+ Create New Route</span>
              </button>
            </div>

            {currentRoute && (
              <div className="space-y-6">
                {/* Active Route Master Header Card */}
                <div className="rounded-2xl glass-panel p-5 border border-purple-200/80 shadow-xs bg-gradient-to-br from-white via-purple-50/20 to-pink-50/20">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-purple-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-xs bg-purple-100 text-purple-800 px-2.5 py-1 rounded-lg border border-purple-200">
                          {currentRoute.code}
                        </span>
                        <h2 className="text-lg font-black text-slate-900">
                          {currentRoute.name}
                        </h2>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                          Active Line
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-slate-700">
                          {currentRoute.startPoint}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
                        <span className="font-medium text-slate-700">
                          {currentRoute.endPoint}
                        </span>
                        <span>·</span>
                        <span>{currentRoute.totalDistanceKm} Total km</span>
                      </div>
                    </div>

                    {/* Quick Action Buttons for Active Route */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => setShowAddStopModal(currentRoute.id)}
                        className="px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Stop to Sequence</span>
                      </button>

                      <button
                        onClick={() => handleOpenAddTrip(currentRoute.id)}
                        className="px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Trip / Shift</span>
                      </button>

                      {routes.length > 1 && (
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                `Are you sure you want to permanently delete ${currentRoute.name}?`
                              )
                            ) {
                              deleteRoute(currentRoute.id);
                              setSelectedRouteTabId(
                                routes.find((r) => r.id !== currentRoute.id)?.id || ''
                              );
                            }
                          }}
                          className="p-2 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors"
                          title="Delete Route"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Route Summary Chips */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
                    <div className="p-2.5 rounded-xl bg-white border border-purple-100">
                      <div className="text-[10px] text-slate-500 font-semibold uppercase">
                        Total Stops
                      </div>
                      <div className="text-base font-black text-slate-900 mt-0.5 tabular-nums">
                        {currentRoute.stops.length} Stations
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-purple-100">
                      <div className="text-[10px] text-slate-500 font-semibold uppercase">
                        Scheduled Shifts
                      </div>
                      <div className="text-base font-black text-purple-700 mt-0.5 tabular-nums">
                        {routeTrips.length} Daily Shifts
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-purple-100">
                      <div className="text-[10px] text-slate-500 font-semibold uppercase">
                        Primary Bus
                      </div>
                      <div className="text-base font-black text-slate-900 mt-0.5">
                        {assignedBus?.busNumber || 'Rotational'}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-purple-100">
                      <div className="text-[10px] text-slate-500 font-semibold uppercase">
                        Registered Boarders
                      </div>
                      <div className="text-base font-black text-pink-600 mt-0.5 tabular-nums">
                        {routeCommutersCount} Students
                      </div>
                    </div>
                  </div>
                </div>

                {/* SUB-SECTION 1: INTERACTIVE STOP SEQUENCE & BUS TIMINGS */}
                <div className="rounded-2xl glass-panel p-5 border border-purple-200/80 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-100 pb-3">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <span>Stop Sequence &amp; Timetable Editor</span>
                        <span className="text-xs font-normal text-slate-500">
                          (Click any timing to edit)
                        </span>
                      </h3>
                      <p className="text-xs text-slate-500">
                        Manage stop order, boarding junctions, and scheduled arrival times.
                      </p>
                    </div>

                    <button
                      onClick={() => setShowAddStopModal(currentRoute.id)}
                      className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Add Stop to Sequence</span>
                    </button>
                  </div>

                  {/* Visual Flow Sequence */}
                  <div className="p-3 bg-purple-50/40 rounded-xl border border-purple-100 overflow-x-auto">
                    <div className="flex items-center gap-2 min-w-max text-xs">
                      {currentRoute.stops.map((stop, idx) => (
                        <React.Fragment key={stop.stopId}>
                          <div
                            onClick={() => {
                              setShowEditStopModal({
                                routeId: currentRoute.id,
                                stopId: stop.stopId,
                                stopName: stop.stopName,
                                landmark: stop.landmark,
                                scheduledTime: stop.scheduledTime,
                              });
                            }}
                            className="p-2.5 rounded-xl bg-white border border-purple-200 shadow-2xs hover:border-purple-400 hover:shadow-xs transition-all cursor-pointer group"
                            title="Click to edit stop timing or details"
                          >
                            <div className="flex items-center gap-1.5">
                              <span className="w-5 h-5 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center">
                                #{stop.sequence}
                              </span>
                              <span className="font-bold text-slate-800 group-hover:text-purple-600 transition-colors">
                                {stop.stopName}
                              </span>
                            </div>
                            <div className="text-[11px] font-mono font-bold text-purple-700 mt-1 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-pink-500" />
                              <span>{stop.scheduledTime}</span>
                              <Edit3 className="w-2.5 h-2.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                            </div>
                          </div>
                          {idx < currentRoute.stops.length - 1 && (
                            <ChevronRight className="w-4 h-4 text-purple-300 shrink-0" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Stops Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-purple-50/70 text-slate-700 font-semibold border-b border-purple-100">
                        <tr>
                          <th className="py-2.5 px-3">Seq #</th>
                          <th className="py-2.5 px-3">Stop Name</th>
                          <th className="py-2.5 px-3">Landmark</th>
                          <th className="py-2.5 px-3">Scheduled Arrival</th>
                          <th className="py-2.5 px-3">Boarders</th>
                          <th className="py-2.5 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-purple-100/60">
                        {currentRoute.stops.map((stop) => {
                          const count = students.filter(
                            (s) =>
                              s.routeId === currentRoute.id &&
                              s.pickupStopId === stop.stopId
                          ).length;

                          return (
                            <tr
                              key={stop.stopId}
                              className="hover:bg-purple-50/40 transition-colors"
                            >
                              <td className="py-2.5 px-3 font-mono font-bold text-slate-800">
                                #{stop.sequence}
                              </td>
                              <td className="py-2.5 px-3">
                                <div className="font-semibold text-slate-900">
                                  {stop.stopName}
                                </div>
                              </td>
                              <td className="py-2.5 px-3 text-slate-500">
                                {stop.landmark}
                              </td>
                              <td className="py-2.5 px-3">
                                {/* Clickable timing button */}
                                <button
                                  onClick={() => {
                                    setEditingStop({
                                      routeId: currentRoute.id,
                                      stopId: stop.stopId,
                                      stopName: stop.stopName,
                                      currentTime: stop.scheduledTime,
                                    });
                                    setEditTimingInput(stop.scheduledTime);
                                  }}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-100/80 hover:bg-purple-200 text-purple-900 font-mono font-bold text-xs transition-colors cursor-pointer border border-purple-200"
                                  title="Click to change bus timing"
                                >
                                  <Clock className="w-3 h-3 text-purple-600" />
                                  <span>{stop.scheduledTime}</span>
                                  <Edit3 className="w-3 h-3 text-purple-500 ml-0.5" />
                                </button>
                              </td>
                              <td className="py-2.5 px-3 text-slate-700">
                                <span className="font-semibold text-pink-600">
                                  {count}
                                </span>{' '}
                                Students
                              </td>
                              <td className="py-2.5 px-3 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => {
                                      setShowEditStopModal({
                                        routeId: currentRoute.id,
                                        stopId: stop.stopId,
                                        stopName: stop.stopName,
                                        landmark: stop.landmark,
                                        scheduledTime: stop.scheduledTime,
                                      });
                                    }}
                                    className="p-1.5 rounded-lg text-purple-700 hover:bg-purple-100 transition-colors"
                                    title="Edit Stop Details & Timing"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>

                                  {currentRoute.stops.length > 2 && (
                                    <button
                                      onClick={() => {
                                        if (
                                          window.confirm(
                                            `Delete stop "${stop.stopName}" from ${currentRoute.name}?`
                                          )
                                        ) {
                                          deleteStopFromRoute(
                                            currentRoute.id,
                                            stop.stopId
                                          );
                                        }
                                      }}
                                      className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                                      title="Remove stop"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* SUB-SECTION 2: TRIP SCHEDULE & SHIFT ENTRIES (Requested by User) */}
                <div className="rounded-2xl glass-panel p-5 border border-purple-200/80 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-100 pb-3">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Timer className="w-4 h-4 text-purple-600" />
                        <span>Route Trip Schedule &amp; Shift Timetable</span>
                      </h3>
                      <p className="text-xs text-slate-500">
                        Manage scheduled shifts (Morning Inbound, Afternoon Outbound, Dispersal, Exam Runs). Click to edit timings or delete specific trip entries from the schedule.
                      </p>
                    </div>

                    <button
                      onClick={() => handleOpenAddTrip(currentRoute.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs self-start sm:self-auto"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Add Trip Entry</span>
                    </button>
                  </div>

                  {/* Trip Schedule Cards Grid */}
                  {routeTrips.length === 0 ? (
                    <div className="p-8 text-center bg-purple-50/30 rounded-2xl border border-purple-100 space-y-2">
                      <Clock className="w-8 h-8 text-purple-300 mx-auto" />
                      <div className="font-bold text-slate-700 text-sm">
                        No scheduled trips found for {currentRoute.name}
                      </div>
                      <p className="text-xs text-slate-500">
                        Add regular or special shift entries to configure departure and arrival schedules.
                      </p>
                      <button
                        onClick={() => handleOpenAddTrip(currentRoute.id)}
                        className="mt-2 px-3.5 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700"
                      >
                        Create First Trip Entry
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {routeTrips.map((trip) => {
                        const tripBus = buses.find((b) => b.id === trip.busId);
                        const tripDriver = drivers.find((d) => d.id === trip.driverId);

                        return (
                          <div
                            key={trip.id}
                            className="p-4 rounded-2xl bg-white border border-purple-200/80 shadow-xs hover:border-purple-300 transition-all flex flex-col justify-between space-y-3"
                          >
                            <div className="space-y-2">
                              {/* Shift badge & Status */}
                              <div className="flex items-center justify-between gap-2">
                                <span
                                  className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wide ${
                                    trip.shiftType === 'Morning Inbound'
                                      ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                      : trip.shiftType === 'Afternoon Outbound'
                                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                      : trip.shiftType === 'Evening Return'
                                      ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                                      : 'bg-pink-100 text-pink-800 border border-pink-200'
                                  }`}
                                >
                                  {trip.shiftType}
                                </span>

                                <span
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                    trip.status === 'In Transit'
                                      ? 'bg-emerald-100 text-emerald-800 animate-pulse'
                                      : trip.status === 'Completed'
                                      ? 'bg-slate-100 text-slate-600'
                                      : trip.status === 'Cancelled'
                                      ? 'bg-rose-100 text-rose-800'
                                      : 'bg-blue-100 text-blue-800'
                                  }`}
                                >
                                  {trip.status}
                                </span>
                              </div>

                              {/* Title */}
                              <div>
                                <h4 className="font-bold text-slate-900 text-sm">
                                  {trip.tripTitle}
                                </h4>
                                <div className="text-[11px] text-slate-500">
                                  Days: {trip.daysActive}
                                </div>
                              </div>

                              {/* Departure & Arrival Times */}
                              <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100 flex items-center justify-between text-xs">
                                <div>
                                  <div className="text-[10px] text-slate-500 uppercase font-semibold">
                                    Departure
                                  </div>
                                  <div className="font-mono font-black text-purple-900 text-sm">
                                    {trip.departureTime}
                                  </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-purple-400" />
                                <div className="text-right">
                                  <div className="text-[10px] text-slate-500 uppercase font-semibold">
                                    Est. Arrival
                                  </div>
                                  <div className="font-mono font-black text-slate-900 text-sm">
                                    {trip.estimatedArrivalTime}
                                  </div>
                                </div>
                              </div>

                              {/* Assigned Bus & Driver */}
                              <div className="space-y-1 text-[11px] pt-1">
                                <div className="flex items-center justify-between text-slate-600">
                                  <span className="text-slate-400">Assigned Bus:</span>
                                  <span className="font-bold text-purple-900">
                                    {tripBus ? `${tripBus.busNumber} (${tripBus.registrationNumber})` : 'Unassigned'}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between text-slate-600">
                                  <span className="text-slate-400">Driver:</span>
                                  <span className="font-semibold text-slate-800">
                                    {tripDriver?.name || 'Staff Depot'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Trip Actions: Edit Timing & DELETE TRIP */}
                            <div className="pt-2 border-t border-purple-100 flex items-center justify-between gap-2">
                              <button
                                onClick={() => handleOpenEditTrip(trip)}
                                className="px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Edit Timing</span>
                              </button>

                              <button
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      `Are you sure you want to delete trip entry "${trip.tripTitle}" from the schedule?`
                                    )
                                  ) {
                                    handleDeleteTrip(trip.id);
                                  }
                                }}
                                className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-1.5 border border-rose-200 transition-colors cursor-pointer"
                                title="Delete this specific trip entry from schedule"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                                <span>Delete Trip</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* TAB: BUS PASS FACILITY */}
      {activeTab === 'passes' && (() => {
        const filteredPasses = busPasses.filter((pass) => {
          const matchSearch =
            passSearch === '' ||
            pass.studentName.toLowerCase().includes(passSearch.toLowerCase()) ||
            pass.enrollmentNumber.toLowerCase().includes(passSearch.toLowerCase()) ||
            pass.id.toLowerCase().includes(passSearch.toLowerCase());

          const matchStatus =
            passFilterStatus === 'all' || pass.status === passFilterStatus;

          const matchRoute =
            passFilterRoute === 'all' || pass.routeId === passFilterRoute;

          return matchSearch && matchStatus && matchRoute;
        });

        const totalFees = busPasses.reduce(
          (acc, p) => (p.feeStatus === 'Paid' ? acc + p.feeAmount : acc),
          0
        );

        return (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header & Metrics */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-purple-50 via-pink-50/40 to-white p-5 rounded-3xl border border-purple-200/80 shadow-xs">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg font-black text-slate-900">
                    Bus Pass &amp; Digital Card Facility
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-1 max-w-xl">
                  Issue, verify fee clearance, renew, and inspect digital transit passes with verified QR codes and hologram seals.
                </p>
              </div>

              <button
                onClick={() => setShowIssuePassModal(true)}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>+ Issue New Bus Pass</span>
              </button>
            </div>

            {/* Metrics Ribbon */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl glass-panel border border-purple-200">
                <div className="text-[11px] font-bold text-slate-500 uppercase">
                  Total Issued Passes
                </div>
                <div className="text-2xl font-black text-slate-900 mt-1 tabular-nums">
                  {busPasses.length}
                </div>
                <div className="text-[10px] text-slate-400">Institutional cards</div>
              </div>

              <div className="p-4 rounded-2xl glass-panel border border-purple-200">
                <div className="text-[11px] font-bold text-slate-500 uppercase">
                  Active Passes
                </div>
                <div className="text-2xl font-black text-emerald-600 mt-1 tabular-nums">
                  {busPasses.filter((p) => p.status === 'Active').length}
                </div>
                <div className="text-[10px] text-emerald-700 font-semibold">
                  Valid for boarding
                </div>
              </div>

              <div className="p-4 rounded-2xl glass-panel border border-purple-200">
                <div className="text-[11px] font-bold text-slate-500 uppercase">
                  Pending Renewal
                </div>
                <div className="text-2xl font-black text-amber-600 mt-1 tabular-nums">
                  {busPasses.filter((p) => p.status === 'Pending Renewal').length}
                </div>
                <div className="text-[10px] text-amber-700 font-semibold">
                  Requires verification
                </div>
              </div>

              <div className="p-4 rounded-2xl glass-panel border border-purple-200">
                <div className="text-[11px] font-bold text-slate-500 uppercase">
                  Collected Revenue
                </div>
                <div className="text-2xl font-black text-purple-700 mt-1 tabular-nums">
                  ₹{totalFees.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-slate-400">Term II transit fees</div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-purple-100 shadow-2xs">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search pass by student name, enrollment #, or pass ID..."
                  value={passSearch}
                  onChange={(e) => setPassSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-purple-200 text-xs focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={passFilterStatus}
                  onChange={(e) => setPassFilterStatus(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-purple-200 text-xs bg-white text-slate-700 font-medium"
                >
                  <option value="all">All Pass Statuses</option>
                  <option value="Active">Active Passes</option>
                  <option value="Pending Renewal">Pending Renewal</option>
                  <option value="Suspended">Suspended</option>
                </select>

                <select
                  value={passFilterRoute}
                  onChange={(e) => setPassFilterRoute(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-purple-200 text-xs bg-white text-slate-700 font-medium"
                >
                  <option value="all">All Routes</option>
                  {routes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.code} - {r.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Bus Passes Table */}
            <div className="rounded-2xl glass-panel border border-purple-200/80 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-purple-50/70 text-slate-700 font-semibold border-b border-purple-100">
                    <tr>
                      <th className="py-3 px-4">Student &amp; Pass ID</th>
                      <th className="py-3 px-4">Authorized Route &amp; Bus</th>
                      <th className="py-3 px-4">Pickup Stop</th>
                      <th className="py-3 px-4">Validity</th>
                      <th className="py-3 px-4">Fee Clearance</th>
                      <th className="py-3 px-4">Pass Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-100/60">
                    {filteredPasses.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="py-8 text-center text-slate-400 font-medium"
                        >
                          No bus passes match the current filter.
                        </td>
                      </tr>
                    ) : (
                      filteredPasses.map((pass) => (
                        <tr
                          key={pass.id}
                          className="hover:bg-purple-50/40 transition-colors"
                        >
                          {/* Student */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-purple-100 border border-purple-200 flex items-center justify-center font-bold text-purple-700 overflow-hidden shrink-0">
                                {pass.avatarUrl ? (
                                  <img
                                    src={pass.avatarUrl}
                                    alt={pass.studentName}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  pass.studentName[0]
                                )}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900">
                                  {pass.studentName}
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono">
                                  {pass.enrollmentNumber} · {pass.id}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Route & Bus */}
                          <td className="py-3 px-4">
                            <div className="font-semibold text-slate-800">
                              {pass.routeName}
                            </div>
                            <div className="inline-flex items-center gap-1 font-mono text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded font-bold mt-0.5">
                              <BusIcon className="w-3 h-3" />
                              <span>{pass.busNumber}</span>
                            </div>
                          </td>

                          {/* Pickup Stop */}
                          <td className="py-3 px-4">
                            <div className="font-medium text-slate-700">
                              {pass.pickupStopName}
                            </div>
                          </td>

                          {/* Validity */}
                          <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                            <div>{pass.validFrom}</div>
                            <div className="text-slate-400 text-[10px]">
                              to {pass.validUntil}
                            </div>
                          </td>

                          {/* Fee Clearance */}
                          <td className="py-3 px-4">
                            <div className="flex flex-col items-start gap-1">
                              <span
                                className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                  pass.feeStatus === 'Paid'
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                                }`}
                              >
                                {pass.feeStatus}
                              </span>
                              <span className="font-mono text-[10px] text-slate-500">
                                ₹{pass.feeAmount.toLocaleString('en-IN')}
                              </span>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-3 px-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                                pass.status === 'Active'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : pass.status === 'Pending Renewal'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                  : 'bg-rose-100 text-rose-800 border border-rose-200'
                              }`}
                            >
                              {pass.status}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setViewingPass(pass)}
                                className="px-2.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                                title="View & Print Digital Pass Card"
                              >
                                <QrCode className="w-3.5 h-3.5" />
                                <span>View Pass</span>
                              </button>

                              {pass.feeStatus !== 'Paid' && (
                                <button
                                  onClick={() =>
                                    updateBusPassStatus(pass.id, 'Active', 'Paid')
                                  }
                                  className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold border border-emerald-200"
                                  title="Mark Fee as Paid & Activate"
                                >
                                  Mark Paid
                                </button>
                              )}

                              {pass.status === 'Active' ? (
                                <button
                                  onClick={() =>
                                    updateBusPassStatus(pass.id, 'Suspended')
                                  }
                                  className="p-1 rounded-lg text-amber-600 hover:bg-amber-50"
                                  title="Suspend Pass"
                                >
                                  Suspend
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    updateBusPassStatus(pass.id, 'Active')
                                  }
                                  className="p-1 rounded-lg text-emerald-600 hover:bg-emerald-50 font-bold"
                                  title="Re-activate Pass"
                                >
                                  Activate
                                </button>
                              )}

                              <button
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      `Delete bus pass record for ${pass.studentName}?`
                                    )
                                  ) {
                                    deleteBusPass(pass.id);
                                  }
                                }}
                                className="p-1 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50"
                                title="Delete Pass Record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}

      {/* TAB 5: FLEET & DRIVERS (SRS Section 7) */}
      {activeTab === 'fleet' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Buses List */}
          <div className="rounded-2xl glass-panel p-5 border border-purple-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Fleet Vehicles</h3>
                <p className="text-xs text-slate-500">Bus IDs, registrations &amp; statuses</p>
              </div>
              <button
                onClick={() => setShowAddBusModal(true)}
                className="px-3 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Bus</span>
              </button>
            </div>

            <div className="space-y-2">
              {buses.map((bus) => (
                <div
                  key={bus.id}
                  className="p-3 rounded-xl border border-purple-100 bg-white flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                      <BusIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{bus.busNumber}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {bus.registrationNumber} · {bus.capacity} Seats
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={bus.status}
                      onChange={(e) => updateBusStatus(bus.id, e.target.value as Bus['status'])}
                      className="text-xs font-semibold px-2 py-1 rounded-lg border border-purple-200 bg-purple-50 text-purple-900 focus:outline-none"
                    >
                      <option value="Active">Active</option>
                      <option value="On Route">On Route</option>
                      <option value="Standby">Standby</option>
                      <option value="Delayed">Delayed</option>
                      <option value="Breakdown">Breakdown</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>

                    {buses.length > 1 && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete ${bus.busNumber} from fleet?`)) {
                            deleteBus(bus.id);
                          }
                        }}
                        className="p-1 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Bus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Drivers List */}
          <div className="rounded-2xl glass-panel p-5 border border-purple-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Driver Roster</h3>
                <p className="text-xs text-slate-500">Commercial licenses &amp; contact details</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddDriverModal(true)}
                  className="px-2.5 py-1 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Driver</span>
                </button>
                <span className="text-xs font-mono font-bold text-purple-800 bg-purple-50 px-2 py-1 rounded-lg border border-purple-200">
                  {drivers.length}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {drivers.map((drv) => {
                const assignedBus = buses.find((b) => b.id === drv.assignedBusId);
                return (
                  <div
                    key={drv.id}
                    className="p-3 rounded-xl border border-purple-100 bg-white flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{drv.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Lic: {drv.licenseNumber} · {drv.experienceYears}y exp
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-mono text-purple-900 font-semibold">{drv.mobile}</div>
                        <div className="text-[10px] text-slate-500">
                          Assigned: {assignedBus ? assignedBus.busNumber : 'Standby Pool'}
                        </div>
                      </div>

                      {drivers.length > 1 && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete driver ${drv.name}?`)) {
                              deleteDriver(drv.id);
                            }
                          }}
                          className="p-1 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Driver"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: STUDENT COMMUTERS */}
      {activeTab === 'students' && (() => {
        const filteredStudents = students.filter((s) => {
          const matchSearch =
            s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
            s.enrollmentNumber.toLowerCase().includes(studentSearch.toLowerCase()) ||
            s.email.toLowerCase().includes(studentSearch.toLowerCase());
          const matchRoute =
            studentRouteFilter === 'all' || s.routeId === studentRouteFilter;
          return matchSearch && matchRoute;
        });

        const totalPages = Math.ceil(filteredStudents.length / studentsPerPage) || 1;
        const displayedStudents = filteredStudents.slice(
          (studentCurrentPage - 1) * studentsPerPage,
          studentCurrentPage * studentsPerPage
        );

        return (
          <div className="space-y-4">
            {/* Storage & Scalability Architecture Banner */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 text-xs text-indigo-950 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-start gap-2.5">
                <Database className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900">
                    Student Commuters Database ({students.length} Total Registered Commuters)
                  </div>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    Data storage: Live browser state (localStorage cache) + relational PostgreSQL schema (SRS Section 21: <code className="bg-indigo-100 px-1 py-0.5 rounded text-indigo-800">students</code> table). Designed to scale to thousands of students with route-wise capacity load balancing.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  onClick={() => bulkAddDemoStudents(25)}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 transition-colors shadow-2xs cursor-pointer flex items-center gap-1"
                  title="Simulate adding 25 more students across campus routes"
                >
                  <span>⚡ Bulk Add +25 Students</span>
                </button>
                <button
                  onClick={handleExportStudentsCSV}
                  className="px-3 py-1.5 rounded-xl bg-white border border-indigo-200 text-indigo-900 font-semibold text-xs hover:bg-indigo-50 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
                <button
                  onClick={() => setShowAddStudentModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Student</span>
                </button>
              </div>
            </div>

            {/* Filter & Table Container */}
            <div className="rounded-2xl glass-panel p-5 border border-purple-200/80 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-100 pb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">Registered Passengers Roster</h3>
                  <span className="text-xs font-mono font-bold text-purple-800 bg-purple-50 px-2.5 py-0.5 rounded-lg border border-purple-200">
                    {filteredStudents.length} Found
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Search student / roll no..."
                    value={studentSearch}
                    onChange={(e) => {
                      setStudentSearch(e.target.value);
                      setStudentCurrentPage(1);
                    }}
                    className="text-xs px-3 py-1.5 rounded-xl border border-purple-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />

                  <select
                    value={studentRouteFilter}
                    onChange={(e) => {
                      setStudentRouteFilter(e.target.value);
                      setStudentCurrentPage(1);
                    }}
                    className="text-xs px-2.5 py-1.5 rounded-xl border border-purple-200 bg-white focus:outline-none text-slate-700 font-medium"
                  >
                    <option value="all">All Routes</option>
                    {routes.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-purple-50/70 text-slate-700 font-semibold border-b border-purple-100">
                    <tr>
                      <th className="py-2.5 px-3">Student Name</th>
                      <th className="py-2.5 px-3">Enrollment</th>
                      <th className="py-2.5 px-3">Department</th>
                      <th className="py-2.5 px-3">Assigned Route</th>
                      <th className="py-2.5 px-3">Pickup Stop</th>
                      <th className="py-2.5 px-3">Mobile Contact</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-100/60">
                    {displayedStudents.map((stu) => {
                      const r = routes.find((rt) => rt.id === stu.routeId);
                      const stop = r?.stops.find((st) => st.stopId === stu.pickupStopId);

                      return (
                        <tr key={stu.id} className="hover:bg-purple-50/40">
                          <td className="py-2.5 px-3 font-semibold text-slate-900">
                            <div>{stu.name}</div>
                            <div className="text-[10px] text-slate-400 font-normal">{stu.email}</div>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-purple-900">{stu.enrollmentNumber}</td>
                          <td className="py-2.5 px-3 text-slate-500">
                            <div>{stu.department}</div>
                            <div className="text-[10px] text-slate-400">{stu.semester}</div>
                          </td>
                          <td className="py-2.5 px-3 font-medium text-slate-800">{r?.name || 'Unassigned'}</td>
                          <td className="py-2.5 px-3">
                            <span className="font-semibold text-pink-700 bg-pink-50 px-2 py-0.5 rounded border border-pink-200">
                              {stop?.stopName || 'Stop'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-600">{stu.mobile}</td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => {
                                if (window.confirm(`Remove ${stu.name} from bus roster?`)) {
                                  deleteStudent(stu.id);
                                }
                              }}
                              className="p-1 rounded text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete Student"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination bar */}
              <div className="pt-3 border-t border-purple-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                <div>
                  Showing {Math.min(filteredStudents.length, (studentCurrentPage - 1) * studentsPerPage + 1)} to{' '}
                  {Math.min(filteredStudents.length, studentCurrentPage * studentsPerPage)} of{' '}
                  <strong className="text-slate-800">{filteredStudents.length}</strong> students
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    disabled={studentCurrentPage <= 1}
                    onClick={() => setStudentCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-2.5 py-1 rounded-lg border border-purple-200 bg-white hover:bg-purple-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-semibold"
                  >
                    Previous
                  </button>
                  <span className="px-2 font-mono text-xs">
                    Page {studentCurrentPage} of {totalPages}
                  </span>
                  <button
                    disabled={studentCurrentPage >= totalPages}
                    onClick={() => setStudentCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="px-2.5 py-1 rounded-lg border border-purple-200 bg-white hover:bg-purple-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-semibold"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* TAB 7: COMPLAINTS DESK (SRS Section 19) */}
      {activeTab === 'complaints' && (
        <div className="rounded-2xl glass-panel p-5 border border-purple-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Student Complaints &amp; Feedback Desk</h3>
              <p className="text-xs text-slate-500">
                Resolve passenger grievances regarding overcrowding, delays, and routes
              </p>
            </div>
            <span className="text-xs font-semibold text-purple-800 bg-purple-50 px-3 py-1 rounded-lg border border-purple-200">
              {complaints.length} Total Filed Tickets
            </span>
          </div>

          <div className="space-y-3">
            {complaints.map((comp) => (
              <div
                key={comp.id}
                className="p-4 rounded-xl border border-purple-100 bg-white space-y-2 shadow-2xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{comp.category}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        comp.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : comp.status === 'In Review'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {comp.status}
                    </span>
                    <span className="text-[10px] text-slate-400">by {comp.studentName} ({comp.studentEnrollment})</span>
                  </div>
                  <span className="text-[10px] text-slate-400 tabular-nums">{comp.createdAt}</span>
                </div>

                <p className="text-xs text-slate-700">{comp.description}</p>

                {comp.adminReply ? (
                  <div className="p-3 rounded-lg bg-purple-50 border border-purple-100 text-xs text-purple-900">
                    <span className="font-bold block text-purple-950 mb-0.5">Admin Response:</span>
                    <span>{comp.adminReply}</span>
                  </div>
                ) : (
                  <div className="pt-1">
                    <button
                      onClick={() => setShowReplyComplaintId(comp.id)}
                      className="px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-semibold border border-purple-200 flex items-center gap-1.5 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Reply &amp; Resolve Ticket</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: BROADCAST NOTIFICATIONS */}
      {activeTab === 'broadcast' && (
        <div className="rounded-2xl glass-panel p-6 border border-purple-200/80 shadow-xs max-w-2xl mx-auto space-y-4">
          <div className="border-b border-purple-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Broadcast Transit Announcement</h3>
            <p className="text-xs text-slate-500">
              Transmit instant push notifications to student and driver devices
            </p>
          </div>

          {broadcastSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Broadcast dispatched successfully to all commuters!</span>
            </div>
          )}

          <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Audience</label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="audience"
                    checked={broadcastAudience === 'all'}
                    onChange={() => setBroadcastAudience('all')}
                  />
                  <span>All Campus Commuters</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="audience"
                    checked={broadcastAudience === 'route'}
                    onChange={() => setBroadcastAudience('route')}
                  />
                  <span>Specific Route Only</span>
                </label>
              </div>
            </div>

            {broadcastAudience === 'route' && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Route</label>
                <select
                  value={broadcastRouteId}
                  onChange={(e) => setBroadcastRouteId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  {routes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.code})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Notification Title</label>
              <input
                type="text"
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                placeholder="e.g. Weather Alert, Exam Special Timing..."
                required
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Announcement Message</label>
              <textarea
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                rows={4}
                placeholder="Enter detailed message for passengers..."
                required
                className="w-full p-3 rounded-xl border border-slate-300"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Send Broadcast Alert</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 9: REPORTS & LOGS (SRS Section 20) */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="bg-purple-50/70 p-4 rounded-2xl border border-purple-200/80 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Transit Operations Report</h2>
              <p className="text-xs text-slate-500">Summary logs for October 2026 fleet operations</p>
            </div>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              Print / Export Report
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="rounded-2xl glass-panel p-5 border border-purple-200/80 shadow-xs space-y-3">
              <h3 className="font-bold text-slate-900 text-sm">Route-Wise Commuter Density</h3>
              <div className="space-y-2">
                {routes.map((r) => {
                  const studentCount = students.filter((s) => s.routeId === r.id).length;
                  const bus = buses.find(
                    (b) => b.id === assignments.find((a) => a.routeId === r.id)?.busId
                  );
                  return (
                    <div key={r.id} className="p-3 rounded-xl bg-purple-50/50 border border-purple-100 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900">{r.name}</div>
                        <div className="text-[10px] text-slate-500">
                          Assigned: {bus?.busNumber || 'None'} · {r.stops.length} Stops
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-extrabold text-purple-900">{studentCount} Registered</div>
                        <div className="text-[10px] text-slate-400">High efficiency</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl glass-panel p-5 border border-purple-200/80 shadow-xs space-y-3">
              <h3 className="font-bold text-slate-900 text-sm">Fleet Reliability Summary</h3>
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span>Breakdown Incident Frequency</span>
                  <strong className="text-slate-900 tabular-nums">{breakdowns.length} Reports</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span>Complaint Resolution Efficiency</span>
                  <strong className="text-emerald-700 tabular-nums">
                    {Math.round(
                      (complaints.filter((c) => c.status === 'Resolved').length /
                        (complaints.length || 1)) *
                        100
                    )}
                    %
                  </strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span>Average Route Punctuality</span>
                  <strong className="text-purple-900">96.4% on-schedule</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SAME-DAY BUS SWAP MODAL (SRS Section 11) */}
      {showSwapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl p-6 shadow-2xl border border-purple-200 max-w-md w-full space-y-4">
            <div className="flex items-center gap-2.5 text-purple-800">
              <RefreshCw className="w-5 h-5 text-purple-600" />
              <h3 className="text-base font-bold text-slate-900">Same-Day Bus Change</h3>
            </div>
            <p className="text-xs text-slate-500">
              Changing this bus will immediately update the student and driver dashboards and send an instant notification to all students on this route.
            </p>

            <form onSubmit={handleExecuteSwap} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Select New Bus to Assign
                </label>
                <select
                  value={selectedNewBusId}
                  onChange={(e) => setSelectedNewBusId(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  {availableBusesForSwap().map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.busNumber} ({b.registrationNumber}) — {b.capacity} Seats ({b.status})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason for Change</label>
                <input
                  type="text"
                  value={swapReason}
                  onChange={(e) => setSwapReason(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSwapModal(null)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold bg-purple-600 text-white rounded-lg hover:bg-purple-700 shadow-xs"
                >
                  Confirm &amp; Notify Students
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGN REPLACEMENT BUS MODAL (SRS Section 14) */}
      {showReplacementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl p-6 shadow-2xl border border-purple-200 max-w-md w-full space-y-4">
            <div className="flex items-center gap-2.5 text-purple-800">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h3 className="text-base font-bold text-slate-900">
                Deploy Available Replacement Bus
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Deploy an available vehicle from the fleet to take over the broken down bus route and alert students.
            </p>

            <form onSubmit={handleExecuteReplacement} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Select Replacement Vehicle
                </label>
                <div className="space-y-2">
                  {buses
                    .filter((b) => b.status !== 'Breakdown' && b.status !== 'Maintenance')
                    .map((b) => {
                      const occ = getBusOccupancy(b.id);
                      return (
                        <label
                          key={b.id}
                          className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                            selectedReplacementBusId === b.id
                              ? 'bg-purple-50 border-purple-400 ring-2 ring-purple-200'
                              : 'bg-white border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="replacementBus"
                              value={b.id}
                              checked={selectedReplacementBusId === b.id}
                              onChange={() => setSelectedReplacementBusId(b.id)}
                            />
                            <div>
                              <div className="font-bold text-slate-900">{b.busNumber}</div>
                              <div className="text-[10px] text-slate-500 font-mono">
                                Capacity: {b.capacity} · Available: {occ.availableSeats} Seats
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                            {b.status}
                          </span>
                        </label>
                      );
                    })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReplacementModal(null)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold bg-purple-600 text-white rounded-lg hover:bg-purple-700 shadow-xs"
                >
                  Deploy Replacement Bus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD BUS MODAL */}
      {showAddBusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl p-6 shadow-2xl border border-purple-200 max-w-md w-full space-y-4">
            <h3 className="text-base font-bold text-slate-900">Add New Bus to Fleet</h3>
            <form onSubmit={handleCreateBus} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Bus Number</label>
                <input
                  type="text"
                  placeholder="e.g. BUS-30"
                  value={newBusNumber}
                  onChange={(e) => setNewBusNumber(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Registration Plate</label>
                <input
                  type="text"
                  placeholder="e.g. MP-09-PQ-9988"
                  value={newBusReg}
                  onChange={(e) => setNewBusReg(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Seating Capacity</label>
                <input
                  type="number"
                  value={newBusCapacity}
                  onChange={(e) => setNewBusCapacity(Number(e.target.value))}
                  min={20}
                  max={80}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Driver</label>
                <select
                  value={newBusDriverId}
                  onChange={(e) => setNewBusDriverId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="">Standby Pool (No Driver)</option>
                  {drivers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.mobile})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddBusModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Save Bus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REPLY COMPLAINT MODAL */}
      {showReplyComplaintId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl p-6 shadow-2xl border border-purple-200 max-w-md w-full space-y-4">
            <h3 className="text-base font-bold text-slate-900">Reply &amp; Resolve Complaint</h3>
            <form onSubmit={handleResolveComplaint} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official Response</label>
                <textarea
                  value={complaintReplyText}
                  onChange={(e) => setComplaintReplyText(e.target.value)}
                  rows={4}
                  required
                  placeholder="Explain action taken or solution implemented..."
                  className="w-full p-3 rounded-xl border border-slate-300"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReplyComplaintId(null)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Mark Resolved &amp; Notify Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD STOP MODAL */}
      {showAddStopModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl p-6 shadow-2xl border border-purple-200 max-w-md w-full space-y-4">
            <h3 className="text-base font-bold text-slate-900">Add Stop to Route Sequence</h3>
            <form onSubmit={handleAddStopToRoute} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Stop Name</label>
                <input
                  type="text"
                  placeholder="e.g. Geeta Bhawan Square"
                  value={newStopName}
                  onChange={(e) => setNewStopName(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Landmark / Reference</label>
                <input
                  type="text"
                  placeholder="e.g. Near Temple Gate"
                  value={newStopLandmark}
                  onChange={(e) => setNewStopLandmark(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Scheduled Timing</label>
                <input
                  type="text"
                  value={newStopTime}
                  onChange={(e) => setNewStopTime(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddStopModal(null)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Add Stop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD DRIVER MODAL */}
      {showAddDriverModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl p-6 shadow-2xl border border-indigo-200 max-w-md w-full space-y-4">
            <h3 className="text-base font-bold text-slate-900">Add New Bus Driver</h3>
            <p className="text-xs text-slate-500">
              Register commercial driver profile with license number and contact.
            </p>
            <form onSubmit={handleCreateDriver} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Driver Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Manish Solanki"
                  value={newDriverName}
                  onChange={(e) => setNewDriverName(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile Contact</label>
                  <input
                    type="text"
                    placeholder="e.g. +91 98265 99011"
                    value={newDriverMobile}
                    onChange={(e) => setNewDriverMobile(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    value={newDriverExp}
                    onChange={(e) => setNewDriverExp(Number(e.target.value))}
                    min={1}
                    max={40}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Commercial License Number</label>
                <input
                  type="text"
                  placeholder="e.g. MP-IND-2021-98721"
                  value={newDriverLicense}
                  onChange={(e) => setNewDriverLicense(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assign to Vehicle (Optional)</label>
                <select
                  value={newDriverBusId}
                  onChange={(e) => setNewDriverBusId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="">Standby Driver Pool</option>
                  {buses.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.busNumber} ({b.registrationNumber}) — {b.status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddDriverModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer"
                >
                  Save Driver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD ROUTE MODAL */}
      {showAddRouteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl p-6 shadow-2xl border border-pink-200 max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900">Create New Campus Route</h3>
            <p className="text-xs text-slate-500">
              Set up route corridor, starting point, scheduled stops and assign an operational bus &amp; driver.
            </p>
            <form onSubmit={handleCreateRoute} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Route Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Khajrana - Campus Line"
                    value={newRouteName}
                    onChange={(e) => setNewRouteName(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Route Code</label>
                  <input
                    type="text"
                    placeholder="e.g. RT-KHAJRANA"
                    value={newRouteCode}
                    onChange={(e) => setNewRouteCode(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-300 uppercase font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Start Origin Point</label>
                  <input
                    type="text"
                    placeholder="e.g. Khajrana Square"
                    value={newRouteStart}
                    onChange={(e) => setNewRouteStart(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Destination Point</label>
                  <input
                    type="text"
                    value={newRouteEnd}
                    onChange={(e) => setNewRouteEnd(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Total Distance (km)</label>
                  <input
                    type="number"
                    value={newRouteDistance}
                    onChange={(e) => setNewRouteDistance(Number(e.target.value))}
                    min={5}
                    max={100}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assign Daily Bus</label>
                  <select
                    value={newRouteBusId}
                    onChange={(e) => setNewRouteBusId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="">Select bus or unassigned</option>
                    {buses.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.busNumber} ({b.capacity} Seats - {b.status})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assign Driver</label>
                  <select
                    value={newRouteDriverId}
                    onChange={(e) => setNewRouteDriverId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="">Select driver or unassigned</option>
                    {drivers.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.mobile})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Stops &amp; Scheduled Timings (Format: Stop Name: Time, one per line)
                </label>
                <textarea
                  value={newRouteStopsText}
                  onChange={(e) => setNewRouteStopsText(e.target.value)}
                  rows={4}
                  required
                  placeholder="Stop Name: Time (one per line)"
                  className="w-full p-3 rounded-xl border border-slate-300 font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddRouteModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold bg-pink-600 text-white rounded-lg hover:bg-pink-700 cursor-pointer shadow-xs"
                >
                  Create Route
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT STOP TIMING MODAL */}
      {editingStop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl p-6 shadow-2xl border border-purple-200 max-w-sm w-full space-y-4">
            <h3 className="text-base font-bold text-slate-900">Change Bus Stop Timing</h3>
            <p className="text-xs text-slate-500">
              Update scheduled arrival time for <strong>{editingStop.stopName}</strong>. This updates the timetable and live ETA for all commuters.
            </p>
            <form onSubmit={handleUpdateStopTiming} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Scheduled Arrival Time</label>
                <input
                  type="text"
                  value={editTimingInput}
                  onChange={(e) => setEditTimingInput(e.target.value)}
                  placeholder="e.g. 07:35 AM"
                  required
                  className="w-full p-2.5 rounded-xl border border-purple-300 font-mono text-sm font-bold text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingStop(null)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer shadow-xs"
                >
                  Save New Time
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD STUDENT MODAL */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl p-6 shadow-2xl border border-indigo-200 max-w-md w-full space-y-4">
            <h3 className="text-base font-bold text-slate-900">Register New Student Commuter</h3>
            <form onSubmit={handleCreateStudent} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Student Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Aditya Sharma"
                  value={newStuName}
                  onChange={(e) => setNewStuName(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Enrollment Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 0801CS221099"
                    value={newStuEnroll}
                    onChange={(e) => setNewStuEnroll(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile Contact</label>
                  <input
                    type="text"
                    placeholder="e.g. +91 98260 55412"
                    value={newStuMobile}
                    onChange={(e) => setNewStuMobile(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={newStuDept}
                    onChange={(e) => setNewStuDept(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Computer Science & Engineering">Computer Science</option>
                    <option value="Information Technology">Information Tech</option>
                    <option value="Electronics & Comm.">Electronics</option>
                    <option value="Mechanical Engineering">Mechanical</option>
                    <option value="Civil Engineering">Civil Engg</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Semester</label>
                  <select
                    value={newStuSem}
                    onChange={(e) => setNewStuSem(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="2nd Semester">2nd Semester</option>
                    <option value="4th Semester">4th Semester</option>
                    <option value="6th Semester">6th Semester</option>
                    <option value="8th Semester">8th Semester</option>
                  </select>
                </div>
              </div>

              <div className="pt-1 border-t border-slate-100 space-y-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assigned Route</label>
                  <select
                    value={newStuRouteId}
                    onChange={(e) => {
                      setNewStuRouteId(e.target.value);
                      const r = routes.find((rt) => rt.id === e.target.value);
                      if (r) setNewStuStopId(r.stops[0].stopId);
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    {routes.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} ({r.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pickup Stop</label>
                  <select
                    value={newStuStopId}
                    onChange={(e) => setNewStuStopId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium text-purple-900"
                  >
                    {(routes.find((r) => r.id === newStuRouteId) || routes[0])?.stops.map((st) => (
                      <option key={st.stopId} value={st.stopId}>
                        Stop #{st.sequence}: {st.stopName} ({st.scheduledTime})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer shadow-xs"
                >
                  Register Commuter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT STOP MODAL (NAME, LANDMARK & TIMINGS) */}
      {showEditStopModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl p-6 shadow-2xl border border-purple-200 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Edit Bus Stop &amp; Timings
              </h3>
              <button
                onClick={() => setShowEditStopModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Update stop arrival timing, location name, and landmark. This recalculates the route schedule and updates commuter timetables.
            </p>
            <form onSubmit={handleSaveStopDetails} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Stop Name
                </label>
                <input
                  type="text"
                  value={showEditStopModal.stopName}
                  onChange={(e) =>
                    setShowEditStopModal({
                      ...showEditStopModal,
                      stopName: e.target.value,
                    })
                  }
                  required
                  className="w-full p-2.5 rounded-xl border border-purple-300 font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Prominent Landmark
                </label>
                <input
                  type="text"
                  value={showEditStopModal.landmark}
                  onChange={(e) =>
                    setShowEditStopModal({
                      ...showEditStopModal,
                      landmark: e.target.value,
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-purple-300 text-slate-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Scheduled Arrival Time (e.g. 07:25 AM)
                </label>
                <input
                  type="text"
                  value={showEditStopModal.scheduledTime}
                  onChange={(e) =>
                    setShowEditStopModal({
                      ...showEditStopModal,
                      scheduledTime: e.target.value,
                    })
                  }
                  required
                  className="w-full p-2.5 rounded-xl border border-purple-300 font-mono text-sm font-bold text-purple-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-purple-100">
                <button
                  type="button"
                  onClick={() => setShowEditStopModal(null)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer shadow-xs"
                >
                  Save Stop Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT SCHEDULED TRIP MODAL */}
      {showAddTripModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl p-6 shadow-2xl border border-purple-200 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingTrip ? 'Edit Scheduled Trip & Timings' : 'Add New Trip to Schedule'}
              </h3>
              <button
                onClick={() => {
                  setShowAddTripModal(false);
                  setEditingTrip(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveTrip} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Trip Shift Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rau Morning Inbound Shift 1"
                  value={tripFormTitle}
                  onChange={(e) => setTripFormTitle(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-purple-300 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Shift Type
                  </label>
                  <select
                    value={tripFormShift}
                    onChange={(e) =>
                      setTripFormShift(e.target.value as ScheduledTrip['shiftType'])
                    }
                    className="w-full p-2.5 rounded-xl border border-purple-300 bg-white"
                  >
                    <option value="Morning Inbound">Morning Inbound</option>
                    <option value="Afternoon Outbound">Afternoon Outbound</option>
                    <option value="Evening Return">Evening Return</option>
                    <option value="Special Exam Run">Special Exam Run</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Operating Days
                  </label>
                  <input
                    type="text"
                    value={tripFormDays}
                    onChange={(e) => setTripFormDays(e.target.value)}
                    placeholder="Mon - Sat"
                    className="w-full p-2.5 rounded-xl border border-purple-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Departure Time
                  </label>
                  <input
                    type="text"
                    value={tripFormDepTime}
                    onChange={(e) => setTripFormDepTime(e.target.value)}
                    placeholder="07:15 AM"
                    required
                    className="w-full p-2.5 rounded-xl border border-purple-300 font-mono font-bold text-purple-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Estimated Arrival Time
                  </label>
                  <input
                    type="text"
                    value={tripFormArrTime}
                    onChange={(e) => setTripFormArrTime(e.target.value)}
                    placeholder="08:20 AM"
                    required
                    className="w-full p-2.5 rounded-xl border border-purple-300 font-mono font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Assigned Bus
                  </label>
                  <select
                    value={tripFormBusId}
                    onChange={(e) => setTripFormBusId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-purple-300 bg-white"
                  >
                    {buses.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.busNumber} ({b.capacity} Seats)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Assigned Driver
                  </label>
                  <select
                    value={tripFormDriverId}
                    onChange={(e) => setTripFormDriverId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-purple-300 bg-white"
                  >
                    {drivers.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {editingTrip && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Trip Status
                  </label>
                  <select
                    value={tripFormStatus}
                    onChange={(e) =>
                      setTripFormStatus(e.target.value as ScheduledTrip['status'])
                    }
                    className="w-full p-2.5 rounded-xl border border-purple-300 bg-white"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-purple-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddTripModal(false);
                    setEditingTrip(null);
                  }}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold bg-pink-600 text-white rounded-lg hover:bg-pink-700 cursor-pointer shadow-xs"
                >
                  {editingTrip ? 'Save Changes' : 'Add Trip to Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ISSUE NEW BUS PASS MODAL */}
      {showIssuePassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl p-6 shadow-2xl border border-purple-200 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-purple-600" />
                <span>Issue Digital Bus Pass</span>
              </h3>
              <button
                onClick={() => setShowIssuePassModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleIssueBusPass} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Select Student
                </label>
                <select
                  value={issuePassStuId}
                  onChange={(e) => {
                    setIssuePassStuId(e.target.value);
                    const s = students.find((st) => st.id === e.target.value);
                    if (s) {
                      setIssuePassRouteId(s.routeId);
                      setIssuePassStopId(s.pickupStopId);
                    }
                  }}
                  className="w-full p-2.5 rounded-xl border border-purple-300 bg-white font-medium"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.enrollmentNumber}) - {s.department}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Route Line
                  </label>
                  <select
                    value={issuePassRouteId}
                    onChange={(e) => {
                      setIssuePassRouteId(e.target.value);
                      const r = routes.find((rt) => rt.id === e.target.value);
                      if (r) setIssuePassStopId(r.stops[0]?.stopId || '');
                    }}
                    className="w-full p-2.5 rounded-xl border border-purple-300 bg-white"
                  >
                    {routes.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.code} - {r.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Authorized Bus #
                  </label>
                  <select
                    value={issuePassBusNumber}
                    onChange={(e) => setIssuePassBusNumber(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-purple-300 bg-white font-mono font-bold"
                  >
                    {buses.map((b) => (
                      <option key={b.id} value={b.busNumber}>
                        {b.busNumber} ({b.registrationNumber})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Pickup Stop
                </label>
                <select
                  value={issuePassStopId}
                  onChange={(e) => setIssuePassStopId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-purple-300 bg-white"
                >
                  {(
                    routes.find((r) => r.id === issuePassRouteId) || routes[0]
                  )?.stops.map((st) => (
                    <option key={st.stopId} value={st.stopId}>
                      Stop #{st.sequence}: {st.stopName} ({st.scheduledTime})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Fee Clearance Status
                  </label>
                  <select
                    value={issuePassFeeStatus}
                    onChange={(e) =>
                      setIssuePassFeeStatus(e.target.value as BusPass['feeStatus'])
                    }
                    className="w-full p-2.5 rounded-xl border border-purple-300 bg-white font-semibold"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending Verification">Pending Verification</option>
                    <option value="Exempted">Exempted</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Fee Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={issuePassFeeAmount}
                    onChange={(e) => setIssuePassFeeAmount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-purple-300 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Valid Until
                </label>
                <input
                  type="text"
                  value={issuePassValidUntil}
                  onChange={(e) => setIssuePassValidUntil(e.target.value)}
                  placeholder="31 Dec 2026"
                  className="w-full p-2.5 rounded-xl border border-purple-300 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-purple-100">
                <button
                  type="button"
                  onClick={() => setShowIssuePassModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer shadow-xs"
                >
                  Generate Digital Bus Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DIGITAL BUS PASS MODAL (VIEW / PRINT) */}
      <DigitalBusPassModal
        pass={viewingPass}
        isOpen={!!viewingPass}
        onClose={() => setViewingPass(null)}
      />
    </div>
  );
};
