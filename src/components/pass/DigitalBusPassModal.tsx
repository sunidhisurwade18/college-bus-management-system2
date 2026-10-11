import React from 'react';
import { BusPass } from '../../types';
import { DigitalBusPassCard } from './DigitalBusPassCard';
import { X, ShieldCheck, Printer, Download, Sparkles } from 'lucide-react';

interface DigitalBusPassModalProps {
  pass: BusPass | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DigitalBusPassModal: React.FC<DigitalBusPassModalProps> = ({
  pass,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !pass) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-purple-200 overflow-hidden flex flex-col max-h-[95vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-100 bg-gradient-to-r from-purple-50 via-pink-50/50 to-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Campus Transit Bus Pass
              </h3>
              <p className="text-[11px] text-slate-500 font-mono">
                Pass ID: {pass.id}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto">
          <DigitalBusPassCard pass={pass} showPrintButton={true} />
        </div>
      </div>
    </div>
  );
};
