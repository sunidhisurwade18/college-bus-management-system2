import React, { useState } from 'react';
import { useBus } from '../../context/BusContext';
import { X, User, Check, MapPin, Save } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const {
    role,
    currentStudent,
    currentDriver,
    routes,
    updateStudentProfile,
    updateStudentPickupStop,
  } = useBus();

  // Student form state
  const [name, setName] = useState(currentStudent?.name || '');
  const [mobile, setMobile] = useState(currentStudent?.mobile || '');
  const [email, setEmail] = useState(currentStudent?.email || '');
  const [selectedRouteId, setSelectedRouteId] = useState(currentStudent?.routeId || routes[0]?.id || '');
  const [selectedStopId, setSelectedStopId] = useState(currentStudent?.pickupStopId || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const currentSelectedRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'student' && currentStudent) {
      updateStudentProfile(currentStudent.id, {
        name,
        mobile,
        email,
      });
      updateStudentPickupStop(currentStudent.id, selectedRouteId, selectedStopId || currentSelectedRoute.stops[0].stopId);
    }
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-purple-200 max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-purple-100 flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {role === 'student' ? 'Student Transit Profile' : 'User Account Profile'}
              </h3>
              <p className="text-xs text-slate-500">View and update contact &amp; pickup stops</p>
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
        <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          {role === 'student' && currentStudent ? (
            <>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Enrollment Number
                  </label>
                  <input
                    type="text"
                    value={currentStudent.enrollmentNumber}
                    disabled
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile Contact</label>
                  <input
                    type="text"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">College Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              {/* Route & Pickup Stop Selection (SRS Section 8 & 9) */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Assigned College Route
                  </label>
                  <select
                    value={selectedRouteId}
                    onChange={(e) => {
                      setSelectedRouteId(e.target.value);
                      const newRoute = routes.find((r) => r.id === e.target.value);
                      if (newRoute) {
                        setSelectedStopId(newRoute.stops[0].stopId);
                      }
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
                  <label className="block font-semibold text-slate-700 mb-1">
                    Designated Pickup Stop
                  </label>
                  <select
                    value={selectedStopId}
                    onChange={(e) => setSelectedStopId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium text-purple-900"
                  >
                    {currentSelectedRoute.stops.map((stop) => (
                      <option key={stop.stopId} value={stop.stopId}>
                        Stop #{stop.sequence}: {stop.stopName} (Scheduled: {stop.scheduledTime})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">User Role</label>
                <div className="p-2.5 rounded-xl bg-purple-50 text-purple-900 font-bold capitalize">
                  {role} Account
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Name</label>
                <div className="p-2.5 rounded-xl bg-slate-50 text-slate-800 font-medium">
                  {role === 'driver' ? currentDriver?.name : 'Transport System Administrator'}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-4 py-2 font-bold bg-purple-600 text-white rounded-lg hover:bg-purple-700 shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
