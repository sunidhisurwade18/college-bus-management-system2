import React, { useState } from 'react';
import { useBus } from '../../context/BusContext';
import { LiveRouteMap } from '../map/LiveRouteMap';
import {
  Bus as BusIcon,
  Navigation,
  Clock,
  AlertTriangle,
  Play,
  CheckCircle2,
  Phone,
  ShieldAlert,
  Users,
  Gauge,
  CircleDot,
  Radio,
  FileText,
  AlertCircle,
  HelpCircle,
  Camera,
  QrCode,
} from 'lucide-react';
import { BusPassScannerModal } from '../pass/BusPassScannerModal';

export const DriverDashboard: React.FC = () => {
  const {
    currentDriver,
    driverBus,
    driverRoute,
    driverAssignment,
    students,
    startTrip,
    completeTrip,
    advanceTripStop,
    reportDelay,
    reportBreakdown,
    triggerEmergencySOS,
    getBusOccupancy,
  } = useBus();

  // Modals for driver actions
  const [showDelayModal, setShowDelayModal] = useState(false);
  const [delayMinutes, setDelayMinutes] = useState(10);
  const [delayReason, setDelayReason] = useState('Heavy traffic congestion on highway stretch');

  const [showBreakdownModal, setShowBreakdownModal] = useState(false);
  const [breakdownReason, setBreakdownReason] = useState(
    'Engine coolant overheating and abnormal noise near Rajendra Nagar'
  );
  const [breakdownLocation, setBreakdownLocation] = useState('Near Rajendra Nagar Metro Pillar 42');

  const [showSOSModal, setShowSOSModal] = useState(false);
  const [sosLocation, setSosLocation] = useState('Ring Road intersection, Rau highway exit');

  const [showQRScanner, setShowQRScanner] = useState(false);

  if (!currentDriver || !driverRoute || !driverBus || !driverAssignment) {
    return (
      <div className="p-8 text-center text-slate-500">
        Driver account or assigned daily bus not found.
      </div>
    );
  }

  const occupancy = getBusOccupancy(driverBus.id);
  const currentStopIndex = driverAssignment.currentStopIndex;
  const currentStop = driverRoute.stops[currentStopIndex] || driverRoute.stops[0];
  const nextStop = driverRoute.stops[Math.min(currentStopIndex + 1, driverRoute.stops.length - 1)];
  const isTripFinished = driverAssignment.tripStatus === 'Completed' || currentStopIndex >= driverRoute.stops.length - 1;

  // Passenger list for this route
  const routeStudents = students.filter((s) => s.routeId === driverRoute.id);

  const handleConfirmDelay = (e: React.FormEvent) => {
    e.preventDefault();
    reportDelay(driverAssignment.id, delayMinutes, delayReason);
    setShowDelayModal(false);
  };

  const handleConfirmBreakdown = (e: React.FormEvent) => {
    e.preventDefault();
    reportBreakdown(driverBus.id, breakdownReason, breakdownLocation);
    setShowBreakdownModal(false);
  };

  const handleConfirmSOS = (e: React.FormEvent) => {
    e.preventDefault();
    triggerEmergencySOS(currentDriver.id, sosLocation);
    setShowSOSModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Driver Console Header */}
      <div className="rounded-3xl bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-purple-200 border-2 border-purple-300 shadow-md shrink-0">
              {currentDriver.avatarUrl ? (
                <img
                  src={currentDriver.avatarUrl}
                  alt={currentDriver.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-purple-800 font-bold text-xl">
                  {currentDriver.name[0]}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                  Driver Console
                </span>
                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white border border-white/10 font-mono">
                  {currentDriver.licenseNumber}
                </span>
              </div>
              <h1 className="text-2xl font-extrabold text-white">{currentDriver.name}</h1>
              <p className="text-xs text-purple-200 mt-0.5 flex items-center gap-2">
                <span>{currentDriver.mobile}</span>
                <span>·</span>
                <span>{currentDriver.experienceYears} Years Exp</span>
                <span>·</span>
                <span>★ {currentDriver.rating} Rating</span>
              </p>
            </div>
          </div>

          {/* Current Vehicle Badge */}
          <div className="glass-panel text-slate-900 p-4 rounded-2xl min-w-[260px] bg-white/95 border border-purple-200/80 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Operating Vehicle
              </span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  driverBus.status === 'Breakdown'
                    ? 'bg-rose-100 text-rose-800'
                    : driverAssignment.tripStatus === 'Delayed'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {driverBus.status}
              </span>
            </div>
            <div className="text-xl font-black text-slate-900">{driverBus.busNumber}</div>
            <div className="text-xs text-slate-500 font-mono mt-0.5">
              {driverBus.registrationNumber} · {driverBus.capacity} Capacity
            </div>
          </div>
        </div>
      </div>

      {/* Primary Trip Action Controller (SRS Section 16) */}
      <div className="glass-panel rounded-2xl p-6 border border-purple-200/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-purple-600" />
              <span>Active Trip Controller</span>
            </h2>
            <p className="text-xs text-slate-500">
              Assigned Route: {driverRoute.name} ({driverRoute.code})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Trip Status:</span>
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full ${
                driverAssignment.tripStatus === 'Completed'
                  ? 'bg-slate-200 text-slate-800'
                  : driverAssignment.tripStatus === 'In Transit'
                  ? 'bg-purple-100 text-purple-900 border border-purple-200'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {driverAssignment.tripStatus}
            </span>
          </div>
        </div>

        {/* Step-by-Step Stop Advancement Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {driverAssignment.tripStatus === 'Not Started' ? (
            <button
              onClick={() => startTrip(driverAssignment.id)}
              className="py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors col-span-full shadow-sm cursor-pointer"
            >
              <Play className="w-4 h-4" />
              <span>Start Morning Route Trip</span>
            </button>
          ) : isTripFinished ? (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-center gap-2 col-span-full">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Trip Completed · All Students Arrived at Campus</span>
            </div>
          ) : (
            <>
              <button
                onClick={() => advanceTripStop(driverAssignment.id)}
                className="py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Arrived at Stop #{currentStopIndex + 2} ({nextStop?.stopName})</span>
              </button>

              <button
                onClick={() => completeTrip(driverAssignment.id)}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>End &amp; Complete Trip</span>
              </button>

              <button
                onClick={() => advanceTripStop(driverAssignment.id)}
                className="py-3 px-4 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Skip to Next Stop</span>
              </button>
            </>
          )}
        </div>

        {/* Operational Incident Reporting Strip */}
        <div className="pt-2 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowQRScanner(true)}
            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            title="Scan student digital bus pass QR code"
          >
            <Camera className="w-4 h-4" />
            <span>📷 Scan Student QR Pass (पास सत्यापन)</span>
          </button>

          <button
            onClick={() => setShowDelayModal(true)}
            className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Report Delay (+Minutes)</span>
          </button>

          <button
            onClick={() => setShowBreakdownModal(true)}
            className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Report Bus Breakdown</span>
          </button>

          <button
            onClick={() => setShowSOSModal(true)}
            className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors ml-auto shadow-xs cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>EMERGENCY SOS</span>
          </button>
        </div>
      </div>

      {/* Visual Live Map */}
      <LiveRouteMap
        route={driverRoute}
        bus={driverBus}
        assignment={driverAssignment}
      />

      {/* Route Stops Checklist & Passenger Manifest */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stops Sequence Checklist */}
        <div className="rounded-2xl glass-panel p-5 border border-purple-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-purple-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Stop Sequence &amp; Timings</h3>
              <p className="text-xs text-slate-500">Scheduled sequence for {driverRoute.name}</p>
            </div>
            <span className="text-xs font-mono font-bold text-purple-800 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
              {driverRoute.stops.length} Stops
            </span>
          </div>

          <div className="space-y-2">
            {driverRoute.stops.map((stop, idx) => {
              const isPast = idx < currentStopIndex;
              const isCurrent = idx === currentStopIndex;
              const boardingCount = routeStudents.filter((s) => s.pickupStopId === stop.stopId).length;

              return (
                <div
                  key={stop.stopId}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                    isCurrent
                      ? 'bg-purple-50/80 border-purple-300 shadow-2xs'
                      : isPast
                      ? 'bg-slate-50/50 border-slate-200/60 opacity-80'
                      : 'bg-white border-purple-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        isCurrent
                          ? 'bg-purple-600 text-white'
                          : isPast
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {isPast ? '✓' : idx + 1}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{stop.stopName}</div>
                      <div className="text-[10px] text-slate-400">{stop.landmark}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-mono font-semibold text-purple-900 tabular-nums">
                      {stop.scheduledTime}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {boardingCount > 0 ? (
                        <span className="font-semibold text-pink-600">
                          {boardingCount} Student{boardingCount > 1 ? 's' : ''} boarding
                        </span>
                      ) : (
                        'Transit pass'
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Passenger Manifest Table */}
        <div className="rounded-2xl glass-panel p-5 border border-purple-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-purple-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Student Passenger Manifest</h3>
              <p className="text-xs text-slate-500">Boarding roster for today's trip</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowQRScanner(true)}
                className="px-2.5 py-1 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                title="Open gate QR scanner"
              >
                <Camera className="w-3.5 h-3.5 text-purple-700" />
                <span>Verify Gate QR</span>
              </button>
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <Users className="w-3.5 h-3.5 text-purple-600" />
                <span className="font-bold tabular-nums">{occupancy.assignedCount}</span>
                <span>Students</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto max-h-[380px] overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-purple-50/70 text-slate-700 font-semibold sticky top-0 border-b border-purple-100">
                <tr>
                  <th className="py-2.5 px-3">Student</th>
                  <th className="py-2.5 px-3">Pickup Stop</th>
                  <th className="py-2.5 px-3">Dept</th>
                  <th className="py-2.5 px-3 text-right">Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-100/60">
                {routeStudents.map((stu) => {
                  const stop = driverRoute.stops.find((s) => s.stopId === stu.pickupStopId);
                  return (
                    <tr key={stu.id} className="hover:bg-purple-50/40">
                      <td className="py-2 px-3 font-semibold text-slate-900">
                        <div>{stu.name}</div>
                        <div className="text-[10px] text-slate-400 font-normal">
                          {stu.enrollmentNumber}
                        </div>
                      </td>
                      <td className="py-2 px-3 text-slate-700">
                        {stop?.stopName || 'Designated Stop'}
                      </td>
                      <td className="py-2 px-3 text-slate-500 text-[11px]">{stu.department}</td>
                      <td className="py-2 px-3 text-right font-mono text-[11px] text-purple-900">
                        <a
                          href={`tel:${stu.mobile}`}
                          className="hover:underline flex items-center justify-end gap-1"
                        >
                          <Phone className="w-3 h-3 text-purple-600" />
                          <span>{stu.mobile.slice(-5)}</span>
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* DELAY REPORT MODAL */}
      {showDelayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl p-6 shadow-2xl border border-purple-200 max-w-md w-full space-y-4">
            <div className="flex items-center gap-2.5 text-amber-800">
              <Clock className="w-5 h-5 text-amber-600" />
              <h3 className="text-base font-bold text-slate-900">Report Trip Delay</h3>
            </div>
            <p className="text-xs text-slate-500">
              Students on this route will receive an instant notification with the delay time and reason.
            </p>

            <form onSubmit={handleConfirmDelay} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Delay Estimated (Minutes)
                </label>
                <div className="flex items-center gap-2">
                  {[5, 10, 15, 20, 30].map((mins) => (
                    <button
                      type="button"
                      key={mins}
                      onClick={() => setDelayMinutes(mins)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        delayMinutes === mins
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      +{mins}m
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reason for Delay
                </label>
                <textarea
                  value={delayReason}
                  onChange={(e) => setDelayReason(e.target.value)}
                  rows={3}
                  required
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDelayModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-amber-600 text-white rounded-lg hover:bg-amber-700 shadow-xs"
                >
                  Broadcast Delay Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BREAKDOWN REPORT MODAL (SRS Section 13) */}
      {showBreakdownModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl p-6 shadow-2xl border border-rose-200 max-w-md w-full space-y-4">
            <div className="flex items-center gap-2.5 text-rose-800">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <h3 className="text-base font-bold text-slate-900">Report Bus Breakdown</h3>
            </div>
            <p className="text-xs text-slate-500">
              This will halt the current vehicle, alert the admin desk to deploy an available replacement bus, and notify all affected students.
            </p>

            <form onSubmit={handleConfirmBreakdown} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Problem Description
                </label>
                <textarea
                  value={breakdownReason}
                  onChange={(e) => setBreakdownReason(e.target.value)}
                  rows={3}
                  required
                  placeholder="e.g. Engine stall, punctured rear tire, brake air pressure failure..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current Breakdown Location
                </label>
                <input
                  type="text"
                  value={breakdownLocation}
                  onChange={(e) => setBreakdownLocation(e.target.value)}
                  required
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBreakdownModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-rose-600 text-white rounded-lg hover:bg-rose-700 shadow-xs"
                >
                  Confirm Breakdown &amp; Request Replacement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SOS MODAL */}
      {showSOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl p-6 shadow-2xl border-2 border-red-500 max-w-md w-full space-y-4">
            <div className="flex items-center gap-2.5 text-red-600">
              <ShieldAlert className="w-6 h-6 text-red-600 animate-pulse" />
              <h3 className="text-base font-black text-slate-900">CONFIRM EMERGENCY SOS</h3>
            </div>
            <p className="text-xs text-slate-600">
              Triggering this transmits an immediate high-priority emergency broadcast to Campus Security, Student Helpdesk, and Transport Control.
            </p>

            <form onSubmit={handleConfirmSOS} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Incident Location
                </label>
                <input
                  type="text"
                  value={sosLocation}
                  onChange={(e) => setSosLocation(e.target.value)}
                  required
                  className="w-full text-xs p-2.5 rounded-xl border border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSOSModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-md"
                >
                  TRANSMIT SOS NOW
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Driver Gate QR Scanner Modal */}
      <BusPassScannerModal
        isOpen={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        defaultBusNumber={driverBus.busNumber}
      />
    </div>
  );
};
