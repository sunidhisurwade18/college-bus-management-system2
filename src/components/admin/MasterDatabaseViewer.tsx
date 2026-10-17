import React, { useState } from 'react';
import { useBus } from '../../context/BusContext';
import {
  Database,
  Download,
  Copy,
  Check,
  Search,
  RefreshCcw,
  Table,
  FileCode,
  HardDrive,
  Layers,
  Sparkles,
  ArrowUpDown,
  ExternalLink,
} from 'lucide-react';

export const MasterDatabaseViewer: React.FC = () => {
  const {
    buses,
    drivers,
    routes,
    students,
    assignments,
    complaints,
    notifications,
    breakdowns,
    scheduledTrips,
    busPasses,
    resetToDemoData,
  } = useBus();

  type TableName =
    | 'students'
    | 'buses'
    | 'drivers'
    | 'routes'
    | 'scheduledTrips'
    | 'busPasses'
    | 'assignments'
    | 'complaints'
    | 'breakdowns';

  const [selectedTable, setSelectedTable] = useState<TableName>('students');
  const [viewMode, setViewMode] = useState<'table' | 'json'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);

  // Full database payload for export
  const fullDatabase = {
    metadata: {
      system: 'CampusTransit Management System',
      exportedAt: new Date().toISOString(),
      version: '2.5.0',
      storageEngine: 'Browser LocalStorage + Relational Schema',
    },
    tables: {
      buses,
      drivers,
      routes,
      students,
      scheduledTrips,
      busPasses,
      assignments,
      complaints,
      breakdowns,
      notifications,
    },
    counts: {
      buses: buses.length,
      drivers: drivers.length,
      routes: routes.length,
      stops: routes.reduce((sum, r) => sum + r.stops.length, 0),
      students: students.length,
      scheduledTrips: scheduledTrips.length,
      busPasses: busPasses.length,
      assignments: assignments.length,
      complaints: complaints.length,
      breakdowns: breakdowns.length,
    },
  };

  const handleDownloadJSON = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(fullDatabase, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `campus_transit_database_${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopyJSON = () => {
    const currentTableData = fullDatabase.tables[selectedTable];
    navigator.clipboard.writeText(JSON.stringify(currentTableData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tableList: { id: TableName; label: string; count: number; icon: string }[] = [
    { id: 'students', label: 'Students Roster', count: students.length, icon: '🎓' },
    { id: 'buses', label: 'Buses Fleet', count: buses.length, icon: '🚌' },
    { id: 'drivers', label: 'Drivers Registry', count: drivers.length, icon: '🧑‍✈️' },
    { id: 'routes', label: 'Routes & Stops', count: routes.length, icon: '🗺️' },
    { id: 'scheduledTrips', label: 'Scheduled Trips', count: scheduledTrips.length, icon: '⏰' },
    { id: 'busPasses', label: 'Bus Passes Issued', count: busPasses.length, icon: '🎫' },
    { id: 'assignments', label: 'Daily Allocations', count: assignments.length, icon: '📋' },
    { id: 'complaints', label: 'Complaints & Tickets', count: complaints.length, icon: '💬' },
    { id: 'breakdowns', label: 'Breakdown Logs', count: breakdowns.length, icon: '⚠️' },
  ];

  // Current active data filtered by search
  const rawTableData: any[] = fullDatabase.tables[selectedTable] || [];

  const filteredData = rawTableData.filter((item) => {
    if (!searchTerm.trim()) return true;
    const str = JSON.stringify(item).toLowerCase();
    return str.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Top Header Card */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white p-6 sm:p-7 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2 text-purple-300 text-xs font-semibold uppercase tracking-wider">
              <Database className="w-4 h-4" />
              <span>System Master Database Explorer · डेटाबेस दर्शक</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Live Database &amp; Storage Inspector
            </h2>
            <p className="text-xs text-purple-200/90 mt-1 max-w-2xl leading-relaxed">
              यहाँ आप पूरा लाइव डेटाबेस देख सकते हैं। जब भी आप कोई नई बस, छात्र, स्टॉप, ट्रिप या बस पास जोड़ते या बदलते हैं, वह तुरंत इस डेटाबेस में अपडेट होकर LocalStorage में स्टोर हो जाता है।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleDownloadJSON}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
              title="Download entire database as JSON file"
            >
              <Download className="w-4 h-4" />
              <span>Export Full DB (.json)</span>
            </button>
            <button
              onClick={() => {
                if (window.confirm('Reset all modified data back to initial default demo data?')) {
                  resetToDemoData();
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-purple-200 border border-white/15 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Reset all tables to default"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
              <span>Reset Demo Data</span>
            </button>
          </div>
        </div>

        {/* Live Storage Health Strip */}
        <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-white/5 backdrop-blur-xs p-3 rounded-xl border border-white/10">
            <div className="text-[10px] text-purple-300">Active Storage</div>
            <div className="font-bold text-white flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LocalStorage Sync</span>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-xs p-3 rounded-xl border border-white/10">
            <div className="text-[10px] text-purple-300">Total Entities</div>
            <div className="font-bold text-white mt-0.5 tabular-nums">
              {students.length + buses.length + routes.length + scheduledTrips.length + busPasses.length} Records
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-xs p-3 rounded-xl border border-white/10">
            <div className="text-[10px] text-purple-300">GPS Tracing Engine</div>
            <div className="font-bold text-white mt-0.5">Live Interpolation</div>
          </div>
          <div className="bg-white/5 backdrop-blur-xs p-3 rounded-xl border border-white/10">
            <div className="text-[10px] text-purple-300">Schema Compatibility</div>
            <div className="font-bold text-emerald-300 mt-0.5">PostgreSQL / Cloud SQL</div>
          </div>
        </div>
      </div>

      {/* Table Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {tableList.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setSelectedTable(t.id);
              setSearchTerm('');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
              selectedTable === t.id
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white border border-purple-200/80 text-slate-700 hover:bg-purple-50'
            }`}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono tabular-nums ${
                selectedTable === t.id
                  ? 'bg-white/20 text-white'
                  : 'bg-purple-100 text-purple-900'
              }`}
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Main Table & JSON Container */}
      <div className="rounded-2xl glass-panel p-5 border border-purple-200/80 shadow-xs space-y-4">
        {/* Controls row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-100 pb-3">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Table:</span>
                <code className="text-purple-700 bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-200 font-mono font-bold">
                  {selectedTable}
                </code>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Showing {filteredData.length} of {rawTableData.length} records in this collection
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={`Search in ${selectedTable}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-purple-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 w-44 sm:w-60"
              />
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-purple-100 text-xs">
              <button
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition-all ${
                  viewMode === 'table'
                    ? 'bg-white text-purple-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                <span>Table View</span>
              </button>
              <button
                onClick={() => setViewMode('json')}
                className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition-all ${
                  viewMode === 'json'
                    ? 'bg-white text-purple-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>JSON View</span>
              </button>
            </div>

            {/* Copy button */}
            <button
              onClick={handleCopyJSON}
              className="px-2.5 py-1.5 rounded-xl border border-purple-200 bg-white hover:bg-purple-50 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
              title="Copy current table JSON to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-purple-600" />
                  <span>Copy Table JSON</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Content Mode: Table View */}
        {viewMode === 'table' && (
          <div className="overflow-x-auto rounded-xl border border-purple-100">
            {filteredData.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No matching records found in table "{selectedTable}".
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-purple-50/80 text-purple-950 font-bold border-b border-purple-200">
                  <tr>
                    <th className="py-2.5 px-3 font-mono">#</th>
                    {Object.keys(filteredData[0] || {}).map((col) => (
                      <th key={col} className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[10px]">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-100/60 font-mono text-[11px]">
                  {filteredData.map((row, idx) => (
                    <tr key={row.id || idx} className="hover:bg-purple-50/40 transition-colors">
                      <td className="py-2 px-3 text-slate-400 font-bold tabular-nums">
                        {idx + 1}
                      </td>
                      {Object.keys(filteredData[0] || {}).map((col) => {
                        const val = row[col];
                        let rendered: React.ReactNode = String(val);

                        if (val === null || val === undefined) {
                          rendered = <span className="text-slate-300 italic">null</span>;
                        } else if (typeof val === 'boolean') {
                          rendered = (
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                val ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {val ? 'true' : 'false'}
                            </span>
                          );
                        } else if (typeof val === 'object') {
                          rendered = (
                            <span className="text-indigo-600 truncate max-w-[200px] inline-block font-sans">
                              {Array.isArray(val) ? `Array(${val.length})` : JSON.stringify(val)}
                            </span>
                          );
                        } else if (col.toLowerCase().includes('status')) {
                          rendered = (
                            <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold text-[10px] font-sans">
                              {String(val)}
                            </span>
                          );
                        } else if (col.toLowerCase().includes('id') || col.toLowerCase().includes('number')) {
                          rendered = <strong className="text-slate-900">{String(val)}</strong>;
                        }

                        return (
                          <td key={col} className="py-2 px-3 text-slate-700 whitespace-nowrap max-w-xs truncate">
                            {rendered}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Content Mode: JSON View */}
        {viewMode === 'json' && (
          <div className="rounded-xl bg-slate-950 text-emerald-400 p-4 font-mono text-xs overflow-x-auto max-h-[500px] border border-slate-800 shadow-inner">
            <pre className="whitespace-pre">
              {JSON.stringify(filteredData, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Explanatory Guide Box */}
      <div className="p-5 rounded-2xl bg-white border border-purple-200/80 shadow-2xs space-y-3 text-xs text-slate-700">
        <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span>डेटाबेस और लोकेशन ट्रैकिंग कैसे काम कर रही है? (Architecture Explanation)</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-100 space-y-1.5">
            <div className="font-bold text-purple-900 flex items-center gap-1.5">
              <span>📍 1. लोकेशन कैसे ट्रेस हो रही है? (GPS Tracking)</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              सिस्टम में हर रूट के सभी स्टॉप्स के वास्तविक अक्षांश/देशांतर (Latitude/Longitude) सेव हैं। जब <strong>"Simulate GPS"</strong> ऑन होता है या ड्राइवर <strong>"Advance to Next Stop"</strong> दबाता है, तो इंजन बस के लाइव कोऑर्डिनेट्स को अगले स्टॉप की तरफ स्मूथली आगे बढ़ाता है और मैप पर लाइव बस हिलती हुई दिखती है।
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-100 space-y-1.5">
            <div className="font-bold text-indigo-900 flex items-center gap-1.5">
              <span>💾 2. डेटा कहाँ सेव होता है और कैसे दिखता है?</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              आप जो भी नया डेटा जोड़ते हैं (जैसे नया छात्र, स्टॉप, ट्रिप या बस पास), वह तुरंत ब्राउज़र के <strong>LocalStorage</strong> में सेव हो जाता है और इस <strong>Master Database Explorer</strong> में ऊपर संबंधित टेबल में लाइव दिखने लगता है। आप ऊपर <strong>"Export Full DB (.json)"</strong> दबाकर पूरा डेटा कभी भी डाउनलोड कर सकते हैं।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
