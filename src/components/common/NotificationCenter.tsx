import React, { useState } from 'react';
import { useBus } from '../../context/BusContext';
import {
  X,
  Bell,
  CheckCheck,
  AlertTriangle,
  RefreshCw,
  Clock,
  Megaphone,
  Radio,
} from 'lucide-react';
import { SystemNotification } from '../../types';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationAsRead, markAllNotificationsRead } = useBus();
  const [filter, setFilter] = useState<string>('all');

  if (!isOpen) return null;

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === 'all') return true;
    if (filter === 'bus_change') return notif.type === 'bus_change' || notif.type === 'replacement';
    if (filter === 'delay') return notif.type === 'delay';
    if (filter === 'breakdown') return notif.type === 'breakdown' || notif.type === 'sos';
    return true;
  });

  const getIcon = (type: SystemNotification['type']) => {
    switch (type) {
      case 'bus_change':
      case 'replacement':
        return <RefreshCw className="w-4 h-4 text-purple-600" />;
      case 'breakdown':
      case 'sos':
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case 'delay':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'announcement':
      default:
        return <Megaphone className="w-4 h-4 text-indigo-600" />;
    }
  };

  const getBadgeStyle = (type: SystemNotification['type']) => {
    switch (type) {
      case 'bus_change':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'replacement':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'breakdown':
      case 'sos':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'delay':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-purple-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-purple-100 flex items-center justify-between bg-gradient-to-r from-purple-50/70 to-pink-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">System Notifications</h2>
              <p className="text-xs text-slate-500">Live fleet and route transit updates</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={markAllNotificationsRead}
              className="text-xs text-purple-700 hover:text-purple-900 font-semibold px-2 py-1 rounded-md hover:bg-purple-100/50 flex items-center gap-1 transition-colors"
              title="Mark all as read"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mark all read</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="px-5 py-2.5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-1.5 overflow-x-auto text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors shrink-0 ${
              filter === 'all'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-purple-100/60'
            }`}
          >
            All Updates
          </button>
          <button
            onClick={() => setFilter('bus_change')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors shrink-0 ${
              filter === 'bus_change'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-purple-100/60'
            }`}
          >
            Bus Changes &amp; Replacements
          </button>
          <button
            onClick={() => setFilter('delay')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors shrink-0 ${
              filter === 'delay'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-purple-100/60'
            }`}
          >
            Delays
          </button>
          <button
            onClick={() => setFilter('breakdown')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors shrink-0 ${
              filter === 'breakdown'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-purple-100/60'
            }`}
          >
            Breakdowns / SOS
          </button>
        </div>

        {/* Notification list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Radio className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-medium">No notifications in this category</p>
              <p className="text-xs text-slate-400 mt-1">You are all caught up with transit alerts</p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markNotificationAsRead(notif.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  notif.read
                    ? 'bg-white border-slate-200/80 text-slate-700 opacity-80'
                    : 'bg-purple-50/50 border-purple-200 text-slate-900 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white border border-purple-100 shadow-2xs shrink-0">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-semibold text-xs text-slate-900 truncate">
                        {notif.title}
                      </span>
                      <span className="text-[10px] text-slate-400 tabular-nums shrink-0">
                        {notif.createdAt}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{notif.message}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border ${getBadgeStyle(
                          notif.type
                        )}`}
                      >
                        {notif.type.replace('_', ' ')}
                      </span>
                      {notif.busId && (
                        <span className="text-[10px] text-slate-500 font-medium">
                          Vehicle: {notif.busId.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-purple-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Total: {notifications.length} alerts</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
