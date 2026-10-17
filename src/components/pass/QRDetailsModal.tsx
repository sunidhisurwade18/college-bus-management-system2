import React, { useState } from 'react';
import { BusPass } from '../../types';
import { RealQRCode } from './RealQRCode';
import { generatePassQRPayload } from '../../utils/qrHelper';
import {
  X,
  QrCode,
  ShieldCheck,
  Copy,
  Check,
  Download,
  ExternalLink,
  CheckCircle2,
  Calendar,
  Bus as BusIcon,
  MapPin,
  Sparkles,
  Camera,
} from 'lucide-react';

interface QRDetailsModalProps {
  pass: BusPass;
  isOpen: boolean;
  onClose: () => void;
  onOpenScanner?: () => void;
}

export const QRDetailsModal: React.FC<QRDetailsModalProps> = ({
  pass,
  isOpen,
  onClose,
  onOpenScanner,
}) => {
  const [copied, setCopied] = useState(false);
  const [showRawJson, setShowRawJson] = useState(false);

  if (!isOpen) return null;

  const payloadString = generatePassQRPayload(pass);

  const handleCopy = () => {
    navigator.clipboard.writeText(payloadString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    // Generate QR canvas snapshot and download
    const canvas = document.getElementById(`pass-qr-canvas-${pass.id}`)?.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `bus_pass_qr_${pass.enrollmentNumber}.png`;
      a.click();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-purple-200 max-w-lg w-full max-h-[92vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-purple-100 flex items-center justify-between bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-sm">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Unique Student QR Identity</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600 inline" />
              </h3>
              <p className="text-xs text-slate-500">
                Encrypted Transit Credentials for {pass.studentName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 text-xs text-slate-700">
          {/* Centered Large QR Code */}
          <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-b from-purple-50/70 to-white rounded-3xl border border-purple-100 space-y-4 shadow-inner">
            <div
              id={`pass-qr-canvas-${pass.id}`}
              className="p-4 bg-white rounded-2xl shadow-md border-2 border-purple-200/80"
            >
              <RealQRCode
                value={payloadString}
                size={220}
                colorDark="#1e1b4b"
                errorCorrectionLevel="H"
              />
            </div>

            <div className="text-center space-y-1">
              <div className="font-extrabold text-sm text-slate-900 flex items-center justify-center gap-1.5">
                <span>{pass.studentName}</span>
                <span className="font-mono text-xs text-pink-600">({pass.enrollmentNumber})</span>
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                Pass ID: <strong className="text-purple-900">{pass.id}</strong>
              </div>
              <div className="text-[11px] text-emerald-700 font-bold flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Standard 2D Barcode (ISO/IEC 18004 Compliant)</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <button
                onClick={handleDownloadQR}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PNG</span>
              </button>

              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-xl bg-white border border-purple-200 hover:bg-purple-50 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-purple-600" />
                    <span>Copy Raw JSON</span>
                  </>
                )}
              </button>

              {onOpenScanner && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenScanner();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Test in Gate Scanner</span>
                </button>
              )}
            </div>
          </div>

          {/* Decoded Attributes Checklist */}
          <div className="rounded-2xl border border-purple-100 p-4 bg-white shadow-2xs space-y-3">
            <h4 className="font-bold text-slate-900 text-xs flex items-center justify-between">
              <span>What is verified when this QR is scanned?</span>
              <span className="text-[10px] text-purple-600 font-mono">100% Tamper-Evident</span>
            </h4>

            <div className="grid grid-cols-2 gap-2.5 text-[11px]">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-[10px] text-slate-400">Authorized Bus</div>
                <div className="font-mono font-bold text-slate-900 mt-0.5">{pass.busNumber}</div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-[10px] text-slate-400">Designated Stop</div>
                <div className="font-semibold text-slate-900 mt-0.5 truncate">{pass.pickupStopName}</div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-[10px] text-slate-400">Validity Period</div>
                <div className="font-mono text-slate-900 mt-0.5">{pass.validUntil}</div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-[10px] text-slate-400">Fee Clearance</div>
                <div className="font-bold text-emerald-700 mt-0.5">{pass.feeStatus} (₹{pass.feeAmount})</div>
              </div>
            </div>
          </div>

          {/* Toggle raw JSON view */}
          <div>
            <button
              onClick={() => setShowRawJson(!showRawJson)}
              className="text-[11px] font-semibold text-purple-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{showRawJson ? 'Hide' : 'Show'} Encrypted QR Raw Payload Data</span>
            </button>

            {showRawJson && (
              <div className="mt-2 p-3 bg-slate-950 text-emerald-400 rounded-xl font-mono text-[10px] overflow-x-auto border border-slate-800">
                <pre>{payloadString}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
