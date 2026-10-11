import React, { useRef } from 'react';
import { BusPass } from '../../types';
import {
  Bus as BusIcon,
  ShieldCheck,
  Calendar,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Printer,
  Download,
  Sparkles,
  QrCode as QrCodeIcon,
  ExternalLink,
} from 'lucide-react';

interface DigitalBusPassCardProps {
  pass: BusPass;
  showPrintButton?: boolean;
}

export const DigitalBusPassCard: React.FC<DigitalBusPassCardProps> = ({
  pass,
  showPrintButton = true,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const isExpired = pass.status === 'Expired';
  const isPending = pass.status === 'Pending Renewal';
  const isActive = pass.status === 'Active';

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Physical / Digital Card Container */}
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white shadow-2xl border-2 border-purple-400/30 p-6 sm:p-7 transition-all print:border print:border-black print:text-black print:bg-white print:shadow-none"
      >
        {/* Holographic / Shimmer background ambient effects */}
        <div className="absolute -top-24 -right-24 w-56 h-56 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-pink-500/15 blur-2xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

        {/* Card Header: College Brand & Pass Title */}
        <div className="relative z-10 flex items-start justify-between border-b border-purple-500/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-purple-900/40">
              <BusIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-black tracking-widest text-purple-300">
                Central University Transit
              </div>
              <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                Official Digital Bus Pass
                <ShieldCheck className="w-4 h-4 text-emerald-400 inline shrink-0" />
              </h3>
              <div className="text-[11px] text-purple-200/80 font-mono">
                AY 2026–2027 · Term II
              </div>
            </div>
          </div>

          {/* Hologram / Verification Seal */}
          <div className="flex flex-col items-end">
            <div className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-400/20 to-purple-400/20 border border-amber-300/40 text-[10px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1 shadow-xs">
              <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
              <span>Verified Seal</span>
            </div>
            <span className="text-[9px] font-mono text-purple-300/70 mt-1">
              ID: {pass.id}
            </span>
          </div>
        </div>

        {/* Student Details & Photo Zone */}
        <div className="relative z-10 grid grid-cols-12 gap-4 mt-5">
          {/* Avatar / Photo */}
          <div className="col-span-4 sm:col-span-3 flex flex-col items-center">
            <div className="relative w-20 h-24 sm:w-22 sm:h-26 rounded-2xl overflow-hidden border-2 border-purple-300/40 bg-purple-900/40 shadow-inner flex items-center justify-center">
              {pass.avatarUrl ? (
                <img
                  src={pass.avatarUrl}
                  alt={pass.studentName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-700 to-indigo-800 flex items-center justify-center text-xl font-black text-white">
                  {pass.studentName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)}
                </div>
              )}
            </div>
            {/* Status Pill */}
            <div className="mt-2 text-center">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : isPending
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}
              >
                {isActive && <CheckCircle2 className="w-3 h-3" />}
                {isPending && <AlertTriangle className="w-3 h-3" />}
                {pass.status}
              </span>
            </div>
          </div>

          {/* Student Info Details */}
          <div className="col-span-8 sm:col-span-9 space-y-1.5 text-xs">
            <div>
              <div className="text-[10px] font-medium text-purple-300/80 uppercase tracking-wider">
                Student Name
              </div>
              <div className="text-base sm:text-lg font-black text-white tracking-tight">
                {pass.studentName}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-[10px] font-medium text-purple-300/80">
                  Enrollment #
                </div>
                <div className="font-mono font-bold text-pink-300">
                  {pass.enrollmentNumber}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-medium text-purple-300/80">
                  Semester
                </div>
                <div className="font-semibold text-purple-100">
                  {pass.semester}
                </div>
              </div>
            </div>

            <div>
              <div className="text-[10px] font-medium text-purple-300/80">
                Department
              </div>
              <div className="font-medium text-purple-200 line-clamp-1">
                {pass.department}
              </div>
            </div>
          </div>
        </div>

        {/* Transit Route & Pickup Stop Segment */}
        <div className="relative z-10 mt-5 rounded-2xl bg-white/5 border border-purple-400/20 p-3.5 space-y-2.5 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <BusIcon className="w-4 h-4 text-purple-400" />
              <span className="text-slate-300">Authorized Bus:</span>
              <span className="font-mono font-black text-amber-300 text-sm bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                {pass.busNumber}
              </span>
            </div>
            <div className="text-[11px] text-purple-300 font-mono">
              Issued: {pass.issuedDate}
            </div>
          </div>

          <div className="text-xs space-y-1 pt-1 border-t border-purple-500/20">
            <div className="flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-pink-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-300">Route: </span>
                <span className="font-bold text-white">{pass.routeName}</span>
              </div>
            </div>
            <div className="flex items-start gap-1.5 pl-5">
              <span className="text-slate-400">Designated Stop: </span>
              <span className="font-semibold text-pink-200">
                {pass.pickupStopName}
              </span>
            </div>
          </div>
        </div>

        {/* Validity & Fee Status */}
        <div className="relative z-10 mt-4 grid grid-cols-2 gap-3 text-xs">
          <div className="p-2.5 rounded-xl bg-purple-900/30 border border-purple-500/20">
            <div className="flex items-center gap-1.5 text-purple-300 text-[10px] uppercase font-bold">
              <Calendar className="w-3 h-3" />
              <span>Validity Period</span>
            </div>
            <div className="font-mono text-[11px] text-white mt-1 font-semibold">
              {pass.validFrom}
            </div>
            <div className="font-mono text-[11px] text-purple-200">
              to {pass.validUntil}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-purple-900/30 border border-purple-500/20">
            <div className="flex items-center justify-between text-[10px] uppercase font-bold text-purple-300">
              <span>Transit Fee</span>
              <span
                className={`px-1.5 py-0.2 rounded font-bold text-[9px] ${
                  pass.feeStatus === 'Paid'
                    ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30'
                    : 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                }`}
              >
                {pass.feeStatus}
              </span>
            </div>
            <div className="text-sm font-black text-white mt-1 font-mono">
              ₹{pass.feeAmount.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-slate-400">Institutional Term Fee</div>
          </div>
        </div>

        {/* QR Code & Barcode Verification Zone */}
        <div className="relative z-10 mt-4 pt-4 border-t border-purple-500/20 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-[11px] font-bold text-purple-200">
              <QrCodeIcon className="w-3.5 h-3.5 text-pink-400" />
              <span>Digital Scan Verification</span>
            </div>
            <p className="text-[10px] text-slate-400 max-w-[210px] leading-tight">
              Present this digital pass or physical printout to the driver upon boarding.
            </p>
            {/* Fake barcode bars visual */}
            <div className="flex items-center gap-[2px] h-5 opacity-70 mt-1">
              {[3, 1, 4, 1, 5, 2, 6, 2, 3, 1, 4, 2, 5, 1, 3, 2, 4, 1, 3, 5, 2, 4, 1, 6, 2].map(
                (w, i) => (
                  <span
                    key={i}
                    style={{ width: `${w * 1.5}px` }}
                    className="h-full bg-purple-200 rounded-xs"
                  />
                )
              )}
            </div>
          </div>

          {/* Stylized QR Code Container */}
          <div className="w-20 h-20 rounded-2xl bg-white p-1.5 shadow-lg flex items-center justify-center shrink-0">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full text-slate-900 fill-current"
            >
              {/* Outer corners */}
              <rect x="0" y="0" width="28" height="28" rx="4" />
              <rect x="4" y="4" width="20" height="20" rx="2" fill="white" />
              <rect x="8" y="8" width="12" height="12" rx="1" fill="currentColor" />

              <rect x="72" y="0" width="28" height="28" rx="4" />
              <rect x="76" y="4" width="20" height="20" rx="2" fill="white" />
              <rect x="80" y="8" width="12" height="12" rx="1" fill="currentColor" />

              <rect x="0" y="72" width="28" height="28" rx="4" />
              <rect x="4" y="76" width="20" height="20" rx="2" fill="white" />
              <rect x="8" y="80" width="12" height="12" rx="1" fill="currentColor" />

              {/* Data matrix dots */}
              <rect x="36" y="4" width="8" height="8" rx="1" />
              <rect x="48" y="4" width="8" height="8" rx="1" />
              <rect x="60" y="4" width="8" height="8" rx="1" />
              <rect x="36" y="16" width="8" height="8" rx="1" />
              <rect x="48" y="16" width="8" height="8" rx="1" />

              <rect x="4" y="36" width="8" height="8" rx="1" />
              <rect x="16" y="36" width="8" height="8" rx="1" />
              <rect x="4" y="48" width="8" height="8" rx="1" />
              <rect x="16" y="48" width="8" height="8" rx="1" />

              <rect x="36" y="36" width="12" height="12" rx="2" fill="#7e22ce" />
              <rect x="52" y="36" width="8" height="8" rx="1" />
              <rect x="64" y="36" width="8" height="8" rx="1" />
              <rect x="76" y="36" width="8" height="8" rx="1" />
              <rect x="88" y="36" width="8" height="8" rx="1" />

              <rect x="36" y="52" width="8" height="8" rx="1" />
              <rect x="48" y="52" width="12" height="12" rx="2" />
              <rect x="64" y="52" width="8" height="8" rx="1" />
              <rect x="80" y="52" width="8" height="8" rx="1" />

              <rect x="36" y="68" width="8" height="8" rx="1" />
              <rect x="52" y="68" width="8" height="8" rx="1" />
              <rect x="72" y="68" width="8" height="8" rx="1" />
              <rect x="84" y="68" width="8" height="8" rx="1" />

              <rect x="36" y="84" width="16" height="8" rx="1" />
              <rect x="56" y="84" width="8" height="8" rx="1" />
              <rect x="72" y="84" width="8" height="8" rx="1" />
              <rect x="88" y="84" width="8" height="8" rx="1" />
            </svg>
          </div>
        </div>
      </div>

      {/* Action Strip: Print / Download */}
      {showPrintButton && (
        <div className="mt-4 flex items-center justify-between gap-3 print:hidden">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Active digital credentials saved on device</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-purple-700 transition-colors shadow-sm cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
