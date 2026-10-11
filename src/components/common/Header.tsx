import React, { useState } from 'react';
import { useBus } from '../../context/BusContext';
import {
  Bus as BusIcon,
  Bell,
  User,
  Shield,
  Navigation,
  Play,
  Pause,
  RotateCcw,
  AlertTriangle,
  ChevronDown,
  Check,
} from 'lucide-react';
import { UserRole } from '../../types';

interface HeaderProps {
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onOpenGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNotifications,
  onOpenProfile,
  onOpenGuide,
}) => {
  const {
    role,
    setRole,
    currentStudent,
    currentDriver,
    students,
    drivers,
    setCurrentStudentId,
    setCurrentDriverId,
    notifications,
    isSimulating,
    setIsSimulating,
    resetToDemoData,
    breakdowns,
  } = useBus();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const activeBreakdownsCount = breakdowns.filter((b) => !b.resolved).length;

  const handleRoleSelect = (newRole: UserRole) => {
    setRole(newRole);
    setShowRoleMenu(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-purple-200/60 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 flex items-center justify-center text-white shadow-sm shadow-purple-500/20">
            <BusIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-slate-900">
                CampusTransit
              </span>
              <span className="hidden sm:inline-block text-[11px] font-semibold text-purple-700 bg-purple-100/80 px-2 py-0.5 rounded-md border border-purple-200/60">
                College Bus Portal
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-slate-500 leading-none mt-0.5">
              Centralized Tracking &amp; Fleet Management
            </p>
          </div>
        </div>

        {/* Center Zone: Role Switcher Tabs */}
        <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-purple-100 shadow-inner">
          <button
            onClick={() => handleRoleSelect('student')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              role === 'student'
                ? 'bg-white text-purple-900 shadow-xs border border-purple-200/80'
                : 'text-slate-600 hover:text-purple-700'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Student</span>
          </button>

          <button
            onClick={() => handleRoleSelect('driver')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              role === 'driver'
                ? 'bg-white text-purple-900 shadow-xs border border-purple-200/80'
                : 'text-slate-600 hover:text-purple-700'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Driver</span>
          </button>

          <button
            onClick={() => handleRoleSelect('admin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              role === 'admin'
                ? 'bg-white text-purple-900 shadow-xs border border-purple-200/80'
                : 'text-slate-600 hover:text-purple-700'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin Desk</span>
          </button>
        </div>

        {/* Right Zone: Controls & Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* How to Use / Guide button */}
          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-200 transition-colors cursor-pointer"
            title="How to use this app / गाइड"
          >
            <span>💡 गाइड / Guide</span>
          </button>

          {/* Live Simulator Toggle */}
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            title={isSimulating ? 'Pause GPS route simulation' : 'Start live GPS route simulation'}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
              isSimulating
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-white/80 text-slate-700 border-purple-200 hover:bg-purple-50'
            }`}
          >
            {isSimulating ? (
              <>
                <Pause className="w-3.5 h-3.5 text-emerald-600" />
                <span className="tabular-nums">Live Sim Active</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-purple-600" />
                <span>Simulate GPS</span>
              </>
            )}
          </button>

          {/* Breakdown Alert Indicator if any */}
          {activeBreakdownsCount > 0 && (
            <div
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold"
              title={`${activeBreakdownsCount} active breakdown reported`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 animate-bounce" />
              <span className="hidden md:inline tabular-nums">
                {activeBreakdownsCount} Breakdown
              </span>
            </div>
          )}

          {/* Notifications Button */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-lg text-slate-600 hover:text-purple-900 hover:bg-purple-50 border border-transparent hover:border-purple-200 transition-colors"
            title="System Notifications"
            aria-label="Open notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center tabular-nums shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User selector & details */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 p-1.5 sm:px-2.5 rounded-xl bg-purple-50/80 hover:bg-purple-100/80 border border-purple-200/80 transition-colors text-left"
            >
              <div className="w-7 h-7 rounded-lg overflow-hidden bg-purple-200 border border-purple-300 flex items-center justify-center shrink-0">
                {role === 'student' && currentStudent?.avatarUrl ? (
                  <img
                    src={currentStudent.avatarUrl}
                    alt={currentStudent.name}
                    className="w-full h-full object-cover"
                  />
                ) : role === 'driver' && currentDriver?.avatarUrl ? (
                  <img
                    src={currentDriver.avatarUrl}
                    alt={currentDriver.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs font-bold text-purple-700 uppercase">
                    {role[0]}
                  </span>
                )}
              </div>
              <div className="hidden lg:block text-xs">
                <div className="font-semibold text-slate-800 leading-tight">
                  {role === 'student'
                    ? currentStudent?.name
                    : role === 'driver'
                    ? currentDriver?.name
                    : 'Fleet Admin'}
                </div>
                <div className="text-[10px] text-purple-600 leading-tight capitalize">
                  {role}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Persona switcher dropdown */}
            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white shadow-xl border border-purple-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1.5 border-b border-purple-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Switch Persona / Role
                </div>

                {role === 'student' && (
                  <div className="py-1">
                    <div className="px-3 py-1 text-[11px] text-purple-600 font-medium">
                      Select Student Account:
                    </div>
                    {students.slice(0, 4).map((stu) => (
                      <button
                        key={stu.id}
                        onClick={() => {
                          setCurrentStudentId(stu.id);
                          setShowRoleMenu(false);
                        }}
                        className={`w-full px-3 py-1.5 text-xs text-left flex items-center justify-between hover:bg-purple-50 ${
                          currentStudent?.id === stu.id
                            ? 'text-purple-900 font-semibold bg-purple-50/60'
                            : 'text-slate-700'
                        }`}
                      >
                        <div>
                          <div>{stu.name}</div>
                          <div className="text-[10px] text-slate-400">
                            {stu.enrollmentNumber}
                          </div>
                        </div>
                        {currentStudent?.id === stu.id && (
                          <Check className="w-3.5 h-3.5 text-purple-600" />
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {role === 'driver' && (
                  <div className="py-1">
                    <div className="px-3 py-1 text-[11px] text-purple-600 font-medium">
                      Select Driver Account:
                    </div>
                    {drivers.slice(0, 3).map((drv) => (
                      <button
                        key={drv.id}
                        onClick={() => {
                          setCurrentDriverId(drv.id);
                          setShowRoleMenu(false);
                        }}
                        className={`w-full px-3 py-1.5 text-xs text-left flex items-center justify-between hover:bg-purple-50 ${
                          currentDriver?.id === drv.id
                            ? 'text-purple-900 font-semibold bg-purple-50/60'
                            : 'text-slate-700'
                        }`}
                      >
                        <div>
                          <div>{drv.name}</div>
                          <div className="text-[10px] text-slate-400">
                            Bus {drv.assignedBusId?.toUpperCase()}
                          </div>
                        </div>
                        {currentDriver?.id === drv.id && (
                          <Check className="w-3.5 h-3.5 text-purple-600" />
                        )}
                      </button>
                    ))}
                  </div>
                )}

                <div className="border-t border-purple-100 my-1"></div>

                <button
                  onClick={() => {
                    setShowRoleMenu(false);
                    onOpenProfile();
                  }}
                  className="w-full px-3 py-1.5 text-xs text-left text-slate-700 hover:bg-purple-50 flex items-center gap-2"
                >
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>Profile &amp; Settings</span>
                </button>

                <button
                  onClick={() => {
                    setShowRoleMenu(false);
                    resetToDemoData();
                  }}
                  className="w-full px-3 py-1.5 text-xs text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Demo Data</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
