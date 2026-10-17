import React, { useRef, useState } from 'react';
import { BusPass } from '../../types';
import { RealQRCode } from './RealQRCode';
import { QRDetailsModal } from './QRDetailsModal';
import { BusPassScannerModal } from './BusPassScannerModal';
import { generatePassQRPayload } from '../../utils/qrHelper';
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
  Camera,
  Maximize2,
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
  const [showQRDetails, setShowQRDetails] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const isExpired = pass.status === 'Expired';
  const isPending = pass.status === 'Pending Renewal';
  const isActive = pass.status === 'Active';

  const qrPayload = generatePassQRPayload(pass);

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
              <Calendar className="w-3 3" />
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

        {/* QR Code & Barcode Verification Zone with Real 2D Barcode */}
        <div className="relative z-10 mt-4 pt-4 border-t border-purple-500/20 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-[11px] font-bold text-purple-200">
              <QrCodeIcon className="w-3.5 h-3.5 text-pink-400" />
              <span>Digital Scan Verification</span>
            </div>
            <p className="text-[10px] text-slate-400 max-w-[210px] leading-tight">
              Scannable by any mobile camera or conductor terminal for instant gate verification.
            </p>
            <button
              onClick={() => setShowQRDetails(true)}
              className="mt-1 text-[10px] text-pink-300 hover:text-white underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Maximize2 className="w-3 h-3" />
              <span>Tap to Enlarge QR &amp; Raw Details</span>
            </button>
          </div>

          {/* REAL DYNAMIC QR CODE CONTAINER */}
          <button
            onClick={() => setShowQRDetails(true)}
            className="w-22 h-22 rounded-2xl bg-white p-1.5 shadow-xl hover:scale-105 transition-transform flex flex-col items-center justify-center shrink-0 border-2 border-purple-300/40 cursor-pointer group"
            title="Click to enlarge scannable QR code"
          >
            <RealQRCode
              value={qrPayload}
              size={76}
              colorDark="#0f172a"
              colorLight="#ffffff"
              errorCorrectionLevel="M"
            />
            <span className="text-[8px] font-black tracking-tight text-slate-700 uppercase group-hover:text-purple-700 mt-0.5">
              SCAN QR
            </span>
          </button>
        </div>
      </div>

      {/* Action Strip: Print / Inspect / Scan */}
      {showPrintButton && (
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Real 2D QR Code Active &amp; Scannable</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowQRDetails(true)}
              className="px-3 py-1.5 rounded-xl border border-purple-200 bg-white hover:bg-purple-50 text-purple-900 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <QrCodeIcon className="w-3.5 h-3.5 text-purple-600" />
              <span>Inspect QR</span>
            </button>

            <button
              onClick={() => setShowScanner(true)}
              className="px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-purple-700" />
              <span>Test Scanner</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-purple-700 transition-colors shadow-sm cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>
      )}

      {/* Enlarged QR Details Modal */}
      <QRDetailsModal
        pass={pass}
        isOpen={showQRDetails}
        onClose={() => setShowQRDetails(false)}
        onOpenScanner={() => setShowScanner(true)}
      />

      {/* Gate Scanner Modal */}
      <BusPassScannerModal
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        defaultBusNumber={pass.busNumber}
      />
    </div>
  );
};
