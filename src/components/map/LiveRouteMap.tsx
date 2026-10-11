import React, { useState } from 'react';
import { BusRoute, RouteStop, Bus, DailyAssignment } from '../../types';
import {
  MapPin,
  Navigation,
  Clock,
  Gauge,
  Info,
  CheckCircle2,
  CircleDot,
  Radio,
  Sparkles,
} from 'lucide-react';

interface LiveRouteMapProps {
  route: BusRoute;
  bus?: Bus;
  assignment?: DailyAssignment;
  highlightStopId?: string; // e.g. student's pickup stop
  onSelectStop?: (stop: RouteStop) => void;
}

export const LiveRouteMap: React.FC<LiveRouteMapProps> = ({
  route,
  bus,
  assignment,
  highlightStopId,
  onSelectStop,
}) => {
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null);

  const currentStopIndex = assignment?.currentStopIndex ?? bus?.currentStopIndex ?? 0;
  const currentStop = route.stops[currentStopIndex] || route.stops[0];
  const nextStop = route.stops[Math.min(currentStopIndex + 1, route.stops.length - 1)];

  // Calculate route progress %
  const totalStops = route.stops.length;
  const progressPercent = totalStops > 1 ? Math.min(100, Math.round((currentStopIndex / (totalStops - 1)) * 100)) : 0;

  const handleStopClick = (stop: RouteStop) => {
    setSelectedStopId(stop.stopId);
    if (onSelectStop) onSelectStop(stop);
  };

  const selectedStop = route.stops.find((s) => s.stopId === (selectedStopId || highlightStopId));

  return (
    <div className="rounded-2xl glass-panel p-5 border border-purple-200/80 shadow-sm overflow-hidden">
      {/* Top Map Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-purple-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-100 text-purple-700">
              <Navigation className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-slate-900">{route.name}</h3>
            <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200/60">
              {route.code}
            </span>
          </div>
          <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
            <span>{route.startPoint}</span>
            <span className="text-purple-400">→</span>
            <span>{route.endPoint}</span>
            <span>•</span>
            <span className="tabular-nums">{route.totalDistanceKm} km total</span>
          </div>
        </div>

        {/* Live GPS Telemetry pill strip */}
        <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50/80 border border-purple-200 text-purple-900 font-medium">
            <Gauge className="w-3.5 h-3.5 text-purple-600" />
            <span className="tabular-nums font-semibold">{bus?.speedKmH || 0} km/h</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-pink-50/80 border border-pink-200 text-pink-900 font-medium">
            <Radio className="w-3.5 h-3.5 text-pink-600 animate-pulse" />
            <span className="font-semibold">Live GPS</span>
          </div>
        </div>
      </div>

      {/* Visual Route Canvas */}
      <div className="py-6 px-2 sm:px-4">
        {/* Dynamic Route Progress Timeline */}
        <div className="relative">
          {/* Background Connecting Line */}
          <div className="absolute top-5 left-4 right-4 h-1.5 bg-slate-100 rounded-full" />
          {/* Active Gradient Filled Line */}
          <div
            className="absolute top-5 left-4 h-1.5 bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 rounded-full transition-all duration-700"
            style={{ width: `calc(${progressPercent}% * 0.95)` }}
          />

          {/* Stops List along the horizontal line */}
          <div className="relative flex justify-between items-start gap-1">
            {route.stops.map((stop, index) => {
              const isPast = index < currentStopIndex;
              const isCurrent = index === currentStopIndex;
              const isPickupStop = stop.stopId === highlightStopId;
              const isSelected = stop.stopId === selectedStopId;

              return (
                <div
                  key={stop.stopId}
                  onClick={() => handleStopClick(stop)}
                  className="flex flex-col items-center group cursor-pointer text-center max-w-[90px] sm:max-w-[110px]"
                >
                  {/* Pin Circle */}
                  <div className="relative mb-2">
                    {/* Animated Ripple for current bus stop */}
                    {isCurrent && (
                      <span className="absolute -inset-1.5 rounded-full bg-purple-400/40 animate-ping" />
                    )}

                    <div
                      className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-xs ${
                        isCurrent
                          ? 'bg-gradient-to-tr from-purple-600 to-pink-600 text-white ring-4 ring-purple-100 scale-110'
                          : isPickupStop
                          ? 'bg-pink-500 text-white ring-4 ring-pink-100'
                          : isPast
                          ? 'bg-purple-200 text-purple-800'
                          : 'bg-white border-2 border-slate-300 text-slate-500 group-hover:border-purple-400'
                      }`}
                    >
                      {isCurrent ? (
                        <Navigation className="w-5 h-5 text-white" />
                      ) : isPickupStop ? (
                        <MapPin className="w-4 h-4 text-white" />
                      ) : isPast ? (
                        <CheckCircle2 className="w-4 h-4 text-purple-700" />
                      ) : (
                        <span className="text-xs font-bold tabular-nums">{stop.sequence}</span>
                      )}
                    </div>

                    {/* Bus Indicator if bus is here */}
                    {isCurrent && (
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-purple-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                        {bus?.busNumber || 'Bus'}
                      </div>
                    )}
                  </div>

                  {/* Stop Name */}
                  <span
                    className={`text-xs font-semibold leading-tight line-clamp-2 transition-colors ${
                      isPickupStop
                        ? 'text-pink-700 font-bold'
                        : isCurrent
                        ? 'text-purple-900 font-bold'
                        : 'text-slate-700 group-hover:text-purple-700'
                    }`}
                  >
                    {stop.stopName}
                  </span>

                  {/* Scheduled Time */}
                  <span className="text-[10px] text-slate-400 tabular-nums mt-0.5">
                    {stop.scheduledTime}
                  </span>

                  {/* Tag for student's personal pickup stop */}
                  {isPickupStop && (
                    <span className="mt-1 px-1.5 py-0.5 rounded bg-pink-100 text-pink-700 border border-pink-200 text-[9px] font-bold whitespace-nowrap">
                      Your Stop
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Route Journey Status Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 rounded-xl bg-purple-50/60 border border-purple-100 mt-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white border border-purple-200 flex items-center justify-center text-purple-700 shrink-0">
            <CircleDot className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500">Current Station</div>
            <div className="text-xs font-bold text-slate-900">{currentStop.stopName}</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white border border-purple-200 flex items-center justify-center text-pink-700 shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500">Next Approaching Stop</div>
            <div className="text-xs font-bold text-slate-900">
              {nextStop ? `${nextStop.stopName} (${nextStop.estimatedTime})` : 'Destination Reached'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white border border-purple-200 flex items-center justify-center text-indigo-700 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500">Route Status</div>
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>{assignment?.tripStatus || bus?.status || 'Active'}</span>
              {assignment?.delayMinutes ? (
                <span className="text-amber-700 text-[10px] font-semibold bg-amber-100 px-1.5 rounded">
                  +{assignment.delayMinutes} min delay
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Selected / Highlighted Stop Details Card */}
      {selectedStop && (
        <div className="mt-3 p-3 rounded-xl bg-white border border-purple-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <MapPin className="w-4 h-4 text-purple-600 shrink-0" />
            <div>
              <span className="font-bold text-slate-800">
                Stop #{selectedStop.sequence}: {selectedStop.stopName}
              </span>
              <span className="text-slate-400 mx-1.5">·</span>
              <span className="text-slate-500">{selectedStop.landmark}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="font-semibold text-purple-900 tabular-nums">
              Scheduled: {selectedStop.scheduledTime}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
