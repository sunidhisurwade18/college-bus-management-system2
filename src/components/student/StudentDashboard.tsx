import React, { useState } from 'react';
import { useBus } from '../../context/BusContext';
import { LiveRouteMap } from '../map/LiveRouteMap';
import {
  Bus as BusIcon,
  MapPin,
  Clock,
  Users,
  AlertTriangle,
  RefreshCw,
  Phone,
  MessageSquarePlus,
  ShieldAlert,
  Calendar,
  Sparkles,
  Info,
  CheckCircle2,
  Share2,
  CreditCard,
  QrCode,
} from 'lucide-react';
import { DigitalBusPassCard } from '../pass/DigitalBusPassCard';

interface StudentDashboardProps {
  onOpenComplaintModal: () => void;
  onOpenProfileModal: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onOpenComplaintModal,
  onOpenProfileModal,
}) => {
  const {
    currentStudent,
    studentBus,
    studentRoute,
    studentAssignment,
    studentBusPass,
    drivers,
    getBusOccupancy,
    complaints,
    advanceTripStop,
    breakdowns,
  } = useBus();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'timetable' | 'pass' | 'complaints'
  >('overview');

  if (!currentStudent || !studentRoute) {
    return (
      <div className="p-8 text-center text-slate-500">
        Student account or assigned route not found.
      </div>
    );
  }

  const assignedDriver = drivers.find((d) => d.id === studentAssignment?.driverId) || drivers[0];
  const occupancy = studentBus ? getBusOccupancy(studentBus.id) : null;

  // Student's pickup stop details
  const pickupStop = studentRoute.stops.find((s) => s.stopId === currentStudent.pickupStopId) || studentRoute.stops[0];
  const currentStopIndex = studentAssignment?.currentStopIndex ?? 0;
  const currentStop = studentRoute.stops[currentStopIndex] || studentRoute.stops[0];

  // Check if bus is past, at, or before student's stop
  const pickupStopIndex = studentRoute.stops.findIndex((s) => s.stopId === pickupStop.stopId);
  const isBusApproachingPickup = currentStopIndex < pickupStopIndex;
  const isBusAtPickup = currentStopIndex === pickupStopIndex;
  const isBusPassedPickup = currentStopIndex > pickupStopIndex;

  // Student's own complaints
  const studentComplaints = complaints.filter((c) => c.studentId === currentStudent.id);

  // Active breakdown for this bus/route
  const activeBreakdown = breakdowns.find(
    (b) => !b.resolved && (b.busId === studentBus?.id || b.routeId === studentRoute.id)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Hero Welcome & Today's Bus Overview */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl">
        {/* Aesthetic background glows */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-16 w-60 h-60 rounded-full bg-pink-500/15 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2 text-purple-300 text-xs font-semibold uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5" />
              <span>Today's Transit · 11 October 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Hello, {currentStudent.name}
            </h1>
            <p className="text-sm text-purple-200/90 mt-1 max-w-xl">
              {currentStudent.department} · {currentStudent.enrollmentNumber} · {currentStudent.semester}
            </p>

            {/* Quick summary strip */}
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
              <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-pink-400" />
                <span>
                  Pickup: <strong className="text-white">{pickupStop.stopName}</strong>
                </span>
              </div>

              <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-300" />
                <span>
                  Scheduled: <strong className="text-white">{pickupStop.scheduledTime}</strong>
                </span>
              </div>

              <button
                onClick={onOpenProfileModal}
                className="text-xs text-purple-200 underline hover:text-white transition-colors cursor-pointer"
              >
                Change Pickup Stop
              </button>
            </div>
          </div>

          {/* Quick Bus Card Indicator */}
          <div className="glass-panel text-slate-900 p-5 rounded-2xl min-w-[280px] sm:min-w-[320px] shadow-lg border border-purple-200/80 bg-white/95">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <BusIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Today's Assigned Bus
                  </div>
                  <div className="text-lg font-extrabold text-slate-900 tracking-tight">
                    {studentBus?.busNumber || 'BUS-12'}
                  </div>
                </div>
              </div>

              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  studentBus?.status === 'Breakdown'
                    ? 'bg-rose-100 text-rose-800 border border-rose-200'
                    : studentAssignment?.status === 'Replaced'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : studentAssignment?.status === 'Changed'
                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                    : 'bg-purple-100 text-purple-800 border border-purple-200'
                }`}
              >
                {studentAssignment?.status === 'Replaced'
                  ? 'Replacement Bus'
                  : studentAssignment?.status === 'Changed'
                  ? 'Updated Bus'
                  : studentBus?.status || 'Active'}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Vehicle Reg:</span>
                <span className="font-semibold text-slate-900 font-mono">
                  {studentBus?.registrationNumber}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span>Driver:</span>
                <div className="flex items-center gap-1 font-semibold text-slate-900">
                  <span>{assignedDriver.name}</span>
                  <a
                    href={`tel:${assignedDriver.mobile}`}
                    className="p-1 rounded bg-purple-50 hover:bg-purple-100 text-purple-700"
                    title={`Call driver: ${assignedDriver.mobile}`}
                  >
                    <Phone className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span>Current Location:</span>
                <span className="font-bold text-purple-900">{currentStop.stopName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Same-day Bus Change OR Breakdown Banner Alert (SRS Section 11 & 14 & 15) */}
      {studentAssignment?.status === 'Changed' && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 shadow-xs animate-in slide-in-from-top-1">
          <RefreshCw className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-xs font-bold uppercase tracking-wide text-amber-800">
              Same-Day Bus Change Notice
            </h4>
            <p className="text-xs text-amber-800 mt-0.5">
              Your bus has been updated to <strong>{studentBus?.busNumber}</strong> today.
              {studentAssignment.replacementReason && (
                <span> Reason: {studentAssignment.replacementReason}.</span>
              )}
              {' '}Please board {studentBus?.busNumber} at <strong>{pickupStop.stopName}</strong> at {pickupStop.scheduledTime}.
            </p>
          </div>
        </div>
      )}

      {studentAssignment?.status === 'Replaced' && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3 shadow-xs animate-in slide-in-from-top-1">
          <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-xs font-bold uppercase tracking-wide text-emerald-800">
              Replacement Bus Dispatched
            </h4>
            <p className="text-xs text-emerald-800 mt-0.5">
              Replacement bus <strong>{studentBus?.busNumber}</strong> is active for your route!
              Driver: <strong>{assignedDriver.name}</strong> ({assignedDriver.mobile}).
              Please board {studentBus?.busNumber} at your scheduled pickup stop.
            </p>
          </div>
        </div>
      )}

      {activeBreakdown && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3 shadow-xs animate-in slide-in-from-top-1">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-xs font-bold uppercase tracking-wide text-rose-800">
              Breakdown Reported for Current Route
            </h4>
            <p className="text-xs text-rose-800 mt-0.5">
              Problem: <em>{activeBreakdown.problemDescription}</em>. Transport administration is deploying an available replacement bus. Please stay at your stop.
            </p>
          </div>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-purple-100 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'overview'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-purple-50'
          }`}
        >
          Live Tracking &amp; Route Map
        </button>

        <button
          onClick={() => setActiveTab('timetable')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'timetable'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-purple-50'
          }`}
        >
          Stop-Wise Timetable
        </button>

        <button
          onClick={() => setActiveTab('pass')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'pass'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-purple-50'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Digital Bus Pass</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
        </button>

        <button
          onClick={() => setActiveTab('complaints')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === 'complaints'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-purple-50'
          }`}
        >
          <span>Complaints &amp; Feedback</span>
          {studentComplaints.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-purple-200 text-purple-900 text-[10px] font-bold flex items-center justify-center tabular-nums">
              {studentComplaints.length}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: OVERVIEW & LIVE TRACKING */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Pickup Stop Status Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Student Stop Card */}
            <div className="rounded-2xl glass-panel p-5 border border-purple-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>Your Designated Stop</span>
                  <span className="text-pink-600 font-bold">Stop #{pickupStop.sequence}</span>
                </div>
                <div className="text-lg font-bold text-slate-900">{pickupStop.stopName}</div>
                <div className="text-xs text-slate-500 mt-0.5">{pickupStop.landmark}</div>
              </div>

              <div className="mt-4 pt-3 border-t border-purple-100 flex items-center justify-between text-xs">
                <div>
                  <div className="text-[10px] text-slate-400">Scheduled Time</div>
                  <div className="font-extrabold text-purple-900 tabular-nums">
                    {pickupStop.scheduledTime}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-slate-400">Status at Your Stop</div>
                  <div
                    className={`font-bold ${
                      isBusPassedPickup
                        ? 'text-slate-500'
                        : isBusAtPickup
                        ? 'text-emerald-600'
                        : 'text-purple-600'
                    }`}
                  >
                    {isBusPassedPickup
                      ? 'Departed'
                      : isBusAtPickup
                      ? 'Arriving Now'
                      : 'Approaching'}
                  </div>
                </div>
              </div>
            </div>

            {/* Capacity & Occupancy Card (SRS Section 12) */}
            {occupancy && (
              <div className="rounded-2xl glass-panel p-5 border border-purple-200/80 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-purple-600" />
                      <span>Bus Capacity &amp; Occupancy</span>
                    </span>
                    <span className="font-mono font-bold text-slate-800 tabular-nums">
                      {occupancy.occupancyPercent}%
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-extrabold text-slate-900 tabular-nums">
                      {occupancy.assignedCount}
                    </span>
                    <span className="text-xs text-slate-500">
                      / {occupancy.capacity} Total Seats
                    </span>
                  </div>

                  {/* Occupancy progress bar */}
                  <div className="w-full h-2.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
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

                <div className="mt-4 pt-3 border-t border-purple-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400">Available Seats: </span>
                    <strong className="text-emerald-700 font-bold tabular-nums">
                      {occupancy.availableSeats}
                    </strong>
                  </div>

                  {occupancy.status === 'near_capacity' && (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Near Full Capacity
                    </span>
                  )}
                  {occupancy.status === 'overloaded' && (
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      Overload Warning
                    </span>
                  )}
                  {occupancy.status === 'normal' && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Seats Comfortable
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Quick Actions & Help Card */}
            <div className="rounded-2xl glass-panel p-5 border border-purple-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Student Actions
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Experiencing delays, crowded seating, or need driver assistance?
                </p>
              </div>

              <div className="mt-4 space-y-2">
                <button
                  onClick={onOpenComplaintModal}
                  className="w-full py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MessageSquarePlus className="w-3.5 h-3.5 text-purple-600" />
                  <span>Report Issue / Feedback</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => advanceTripStop(studentAssignment?.id || '')}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition-colors"
                    title="Advance to next stop for simulation testing"
                  >
                    Simulate Next Stop
                  </button>
                  <button
                    onClick={onOpenProfileModal}
                    className="py-1.5 px-3 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 text-[11px] font-medium transition-colors"
                  >
                    My Profile
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Live Route Map */}
          <LiveRouteMap
            route={studentRoute}
            bus={studentBus}
            assignment={studentAssignment}
            highlightStopId={currentStudent.pickupStopId}
          />
        </div>
      )}

      {/* TAB 2: STOP-WISE TIMETABLE (SRS Section 9) */}
      {activeTab === 'timetable' && (
        <div className="rounded-2xl glass-panel p-5 border border-purple-200/80 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Stop-Wise Schedule &amp; Timetable
              </h3>
              <p className="text-xs text-slate-500">
                Route: {studentRoute.name} ({studentRoute.code})
              </p>
            </div>
            <div className="text-xs text-purple-700 bg-purple-50 px-3 py-1 rounded-lg border border-purple-200">
              Total Stops: {studentRoute.stops.length} · Distance: {studentRoute.totalDistanceKm} km
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-purple-50/70 text-slate-700 uppercase tracking-wider font-semibold border-b border-purple-100">
                <tr>
                  <th className="py-3 px-4">Seq</th>
                  <th className="py-3 px-4">Stop Name</th>
                  <th className="py-3 px-4">Landmark</th>
                  <th className="py-3 px-4">Scheduled Time</th>
                  <th className="py-3 px-4">Live Status</th>
                  <th className="py-3 px-4">Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-100/60">
                {studentRoute.stops.map((stop, idx) => {
                  const isCurrent = idx === currentStopIndex;
                  const isPast = idx < currentStopIndex;
                  const isPickup = stop.stopId === currentStudent.pickupStopId;

                  return (
                    <tr
                      key={stop.stopId}
                      className={`transition-colors ${
                        isPickup
                          ? 'bg-pink-50/70 font-medium'
                          : isCurrent
                          ? 'bg-purple-50/70'
                          : 'hover:bg-slate-50/60'
                      }`}
                    >
                      <td className="py-3 px-4 font-mono font-bold text-slate-800 tabular-nums">
                        #{stop.sequence}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900">{stop.stopName}</span>
                          {isPickup && (
                            <span className="px-2 py-0.5 rounded bg-pink-100 text-pink-700 border border-pink-200 text-[10px] font-bold">
                              Your Pickup Stop
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-500">{stop.landmark}</td>
                      <td className="py-3 px-4 font-mono font-bold text-purple-900 tabular-nums">
                        {stop.scheduledTime}
                      </td>
                      <td className="py-3 px-4">
                        {isPast ? (
                          <span className="text-slate-500 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                            <span>Departed</span>
                          </span>
                        ) : isCurrent ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>At Stop</span>
                          </span>
                        ) : (
                          <span className="text-slate-400">Upcoming</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-400 text-[11px]">
                        {idx === 0
                          ? 'Origin Departure'
                          : idx === studentRoute.stops.length - 1
                          ? 'Campus Arrival'
                          : 'Passenger Stop'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: DIGITAL BUS PASS FACILITY */}
      {activeTab === 'pass' && (() => {
        const effectiveBusPass = studentBusPass || {
          id: `PASS-2026-${currentStudent.enrollmentNumber.slice(-4)}`,
          studentId: currentStudent.id,
          studentName: currentStudent.name,
          enrollmentNumber: currentStudent.enrollmentNumber,
          department: currentStudent.department,
          semester: currentStudent.semester,
          routeId: studentRoute.id,
          routeName: studentRoute.name,
          pickupStopId: pickupStop.stopId,
          pickupStopName: `${pickupStop.stopName} (Stop #${pickupStop.sequence})`,
          busNumber: studentBus?.busNumber || 'BUS-12',
          validFrom: '01 Jul 2026',
          validUntil: '31 Dec 2026',
          status: 'Active' as const,
          feeStatus: 'Paid' as const,
          feeAmount: 8500,
          qrCodeData: `CAMPUS-PASS-VERIFIED:${currentStudent.enrollmentNumber}:${studentRoute.code}:${studentBus?.busNumber || 'BUS-12'}`,
          issuedDate: '28 Jun 2026',
          avatarUrl: currentStudent.avatarUrl,
        };

        return (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-purple-50 via-pink-50/40 to-white p-5 rounded-2xl border border-purple-200/80 shadow-2xs">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-purple-600" />
                  <span>Your Official Digital Transit Pass</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Carry this digital bus pass or print a physical copy to board your authorized college bus.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-1.5 shadow-2xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Active &amp; Fee Cleared</span>
                </span>
              </div>
            </div>

            <DigitalBusPassCard pass={effectiveBusPass} showPrintButton={true} />
          </div>
        );
      })()}

      {/* TAB 3: COMPLAINTS & FEEDBACK (SRS Section 19) */}
      {activeTab === 'complaints' && (
        <div className="rounded-2xl glass-panel p-5 border border-purple-200/80 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Your Complaints &amp; Feedback History
              </h3>
              <p className="text-xs text-slate-500">
                Direct communication with the college transport administration
              </p>
            </div>
            <button
              onClick={onOpenComplaintModal}
              className="px-3.5 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700 transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Submit New Complaint</span>
            </button>
          </div>

          {studentComplaints.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <MessageSquarePlus className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-semibold">No complaints submitted</p>
              <p className="text-xs text-slate-400 mt-1">
                You have not filed any tickets regarding bus timing, capacity or drivers.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {studentComplaints.map((comp) => (
                <div
                  key={comp.id}
                  className="p-4 rounded-xl border border-purple-100 bg-white/80 space-y-2 shadow-2xs"
                >
                  <div className="flex items-center justify-between gap-2">
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
                    </div>
                    <span className="text-[10px] text-slate-400 tabular-nums">
                      {comp.createdAt}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">{comp.description}</p>

                  {comp.adminReply && (
                    <div className="mt-2 p-3 rounded-lg bg-purple-50/80 border border-purple-100 text-xs text-purple-900">
                      <span className="font-bold text-purple-950 block mb-0.5">
                        Transport Desk Response:
                      </span>
                      <span>{comp.adminReply}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
