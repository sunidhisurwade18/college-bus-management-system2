import React, { useState } from 'react';
import { BusPass } from '../../types';
import { useBus } from '../../context/BusContext';
import { RealQRCode } from './RealQRCode';
import { generatePassQRPayload } from '../../utils/qrHelper';
import {
  X,
  RefreshCw,
  CheckCircle2,
  Calendar,
  CreditCard,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Clock,
  Bus as BusIcon,
} from 'lucide-react';

interface RenewBusPassModalProps {
  pass: BusPass;
  onClose: () => void;
  onRenewed?: () => void;
}

export const RenewBusPassModal: React.FC<RenewBusPassModalProps> = ({
  pass,
  onClose,
  onRenewed,
}) => {
  const { renewBusPass } = useBus();

  const [extensionOption, setExtensionOption] = useState<'1' | '6' | '12' | 'custom'>('6');
  const [customDate, setCustomDate] = useState<string>('2027-06-30');
  const [feeStatus, setFeeStatus] = useState<'Paid' | 'Exempted'>('Paid');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successDone, setSuccessDone] = useState(false);

  // Compute calculated new expiry date string
  const computeNewExpiryDate = (): string => {
    if (extensionOption === 'custom' && customDate) {
      const parts = customDate.split('-');
      if (parts.length === 3) {
        const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        return d.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
      }
    }

    const months = Number(extensionOption);
    const d = new Date();
    d.setMonth(d.getMonth() + months);
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const newValidUntil = computeNewExpiryDate();

  // Simulated updated pass preview
  const previewPass: BusPass = {
    ...pass,
    status: 'Active',
    feeStatus: feeStatus === 'Paid' ? 'Paid' : 'Exempted',
    validUntil: newValidUntil,
  };
  const previewQRPayload = generatePassQRPayload(previewPass);

  const handleConfirmRenewal = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const months = extensionOption === 'custom' ? 6 : Number(extensionOption);
      renewBusPass(
        pass.id,
        months,
        'Active',
        feeStatus,
        extensionOption === 'custom' ? newValidUntil : undefined
      );
      setIsSubmitting(false);
      setSuccessDone(true);
      setTimeout(() => {
        if (onRenewed) onRenewed();
        onClose();
      }, 1200);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-purple-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-5 sm:p-6 flex items-start justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <RefreshCw className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono tracking-widest text-purple-300">
                Transit Authority · Card Re-validation
              </div>
              <h3 className="text-lg font-black text-white">
                Renew &amp; Re-validate Bus Pass
              </h3>
              <p className="text-xs text-purple-200/80">
                {pass.studentName} · {pass.enrollmentNumber}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer relative z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto text-xs">
          {successDone ? (
            <div className="py-10 text-center space-y-3 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h4 className="text-lg font-black text-slate-900">
                पास सफलतापूर्वक वैध हो गया!
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Bus Pass for <strong>{pass.studentName}</strong> has been renewed and set to Active until <strong>{newValidUntil}</strong>. The student&apos;s unique QR code has been refreshed and is valid for boarding immediately.
              </p>
            </div>
          ) : (
            <>
              {/* Current Status Banner */}
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200/70 flex items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Current Card Status</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className={`px-2 py-0.5 rounded-md font-bold text-[11px] uppercase ${
                        pass.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : pass.status === 'Pending Renewal'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}
                    >
                      {pass.status}
                    </span>
                    <span className="text-slate-600">
                      Expired on: <strong className="font-mono text-slate-900">{pass.validUntil}</strong>
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Assigned Bus</div>
                  <div className="inline-flex items-center gap-1 font-mono text-xs font-bold text-purple-900 bg-white px-2 py-0.5 rounded-lg border border-purple-200 mt-0.5">
                    <BusIcon className="w-3.5 h-3.5 text-purple-600" />
                    <span>{pass.busNumber}</span>
                  </div>
                </div>
              </div>

              {/* Renewal Duration Selector */}
              <div>
                <label className="block font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-purple-600" />
                  <span>Choose Renewal Duration (नवीनीकरण अवधि चुनें)</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setExtensionOption('1')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      extensionOption === '1'
                        ? 'border-purple-600 bg-purple-50/80 ring-2 ring-purple-400'
                        : 'border-slate-200 bg-white hover:border-purple-300'
                    }`}
                  >
                    <div className="font-bold text-slate-900">+1 Month</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Exam / Short Term</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setExtensionOption('6')}
                    className={`p-3 rounded-2xl border text-left transition-all relative cursor-pointer ${
                      extensionOption === '6'
                        ? 'border-purple-600 bg-purple-50/80 ring-2 ring-purple-400'
                        : 'border-slate-200 bg-white hover:border-purple-300'
                    }`}
                  >
                    <span className="absolute -top-2 right-2 px-1.5 py-0.2 rounded bg-purple-600 text-white text-[9px] font-bold uppercase tracking-wider">
                      Popular
                    </span>
                    <div className="font-bold text-slate-900">+6 Months</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Next Semester Run</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setExtensionOption('12')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      extensionOption === '12'
                        ? 'border-purple-600 bg-purple-50/80 ring-2 ring-purple-400'
                        : 'border-slate-200 bg-white hover:border-purple-300'
                    }`}
                  >
                    <div className="font-bold text-slate-900">+1 Year</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Full Academic Session</div>
                  </button>
                </div>

                {extensionOption === 'custom' && (
                  <div className="mt-3">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Pick Exact Expiry Date
                    </label>
                    <input
                      type="date"
                      value={customDate}
                      onChange={(e) => setCustomDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs font-mono font-bold"
                    />
                  </div>
                )}
              </div>

              {/* Fee Clearance Option */}
              <div>
                <label className="block font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-purple-600" />
                  <span>Fee Clearance Verification (फीस सत्यापन)</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFeeStatus('Paid')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      feeStatus === 'Paid'
                        ? 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-300'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-slate-900">Fee Cleared (Paid)</div>
                      <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">₹8,500 Term Fee Received</div>
                    </div>
                    {feeStatus === 'Paid' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setFeeStatus('Exempted')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      feeStatus === 'Exempted'
                        ? 'border-purple-500 bg-purple-50/80 ring-2 ring-purple-300'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-slate-900">Exempted / Scholarship</div>
                      <div className="text-[10px] text-purple-700 font-semibold mt-0.5">Institutional Waiver</div>
                    </div>
                    {feeStatus === 'Exempted' && <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />}
                  </button>
                </div>
              </div>

              {/* Live Preview of Validity and Cryptographic QR */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white flex items-center justify-between gap-4 shadow-lg border border-purple-500/30">
                <div className="space-y-1.5 flex-1">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-purple-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>New Cryptographic QR Preview</span>
                  </div>
                  <div className="text-sm font-black text-white">
                    Status: <span className="text-emerald-400">ACTIVE</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-300">
                    <span className="line-through text-slate-500">{pass.validUntil}</span>
                    <ArrowRight className="w-3 h-3 text-emerald-400" />
                    <span className="font-mono font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40">
                      {newValidUntil}
                    </span>
                  </div>
                  <div className="text-[10px] text-purple-200/70 pt-1">
                    Gate scanner will verify identity and authorize bus entry immediately.
                  </div>
                </div>

                <div className="shrink-0 bg-white p-2 rounded-xl shadow-md flex flex-col items-center">
                  <RealQRCode value={previewQRPayload} size={84} />
                  <span className="text-[8px] font-mono font-bold text-slate-700 mt-1">VERIFIED QR</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        {!successDone && (
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleConfirmRenewal}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Re-validating Pass...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-200" />
                  <span>वैध बनाएं (Re-validate &amp; Activate Pass)</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
