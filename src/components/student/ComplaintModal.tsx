import React, { useState } from 'react';
import { useBus } from '../../context/BusContext';
import { X, MessageSquarePlus, CheckCircle2 } from 'lucide-react';
import { Complaint } from '../../types';

interface ComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ComplaintModal: React.FC<ComplaintModalProps> = ({ isOpen, onClose }) => {
  const { currentStudent, studentBus, studentRoute, submitComplaint } = useBus();

  const [category, setCategory] = useState<Complaint['category']>('Timing problem');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Complaint['priority']>('Medium');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen || !currentStudent) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    submitComplaint({
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      studentEnrollment: currentStudent.enrollmentNumber,
      routeId: currentStudent.routeId,
      busId: studentBus?.id || 'bus-12',
      category,
      description,
      priority,
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setDescription('');
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-purple-200 max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-purple-100 flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700">
              <MessageSquarePlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Submit Bus Complaint</h3>
              <p className="text-xs text-slate-500">Route: {studentRoute?.name || 'Assigned Route'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {isSubmitted ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
            <h4 className="text-base font-bold text-slate-900">Complaint Logged Successfully</h4>
            <p className="text-xs text-slate-500">
              The transport authority has received your report. You can track updates on your student dashboard.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Issue Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Complaint['category'])}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium"
              >
                <option value="Bus not arriving">Bus not arriving</option>
                <option value="Overcrowding">Bus overcrowding / no seats</option>
                <option value="Timing problem">Timing problem / delay</option>
                <option value="Wrong bus assignment">Wrong bus assignment</option>
                <option value="Driver issue">Driver issue / rash driving</option>
                <option value="Route problem">Route detour / stop skipped</option>
                <option value="Other">Other transit feedback</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Priority Level</label>
              <div className="flex items-center gap-2">
                {(['Low', 'Medium', 'High'] as Complaint['priority'][]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex-1 py-1.5 rounded-lg font-semibold transition-colors ${
                      priority === p
                        ? p === 'High'
                          ? 'bg-rose-500 text-white shadow-xs'
                          : p === 'Medium'
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-purple-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Description of the Issue
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
                placeholder="Please describe what happened, the stop location, and time..."
                className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 font-bold bg-purple-600 text-white rounded-lg hover:bg-purple-700 shadow-xs cursor-pointer"
              >
                Submit Ticket
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
