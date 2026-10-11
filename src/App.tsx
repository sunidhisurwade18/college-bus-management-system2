import React, { useState } from 'react';
import { BusProvider, useBus } from './context/BusContext';
import { Header } from './components/common/Header';
import { StudentDashboard } from './components/student/StudentDashboard';
import { DriverDashboard } from './components/driver/DriverDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { NotificationCenter } from './components/common/NotificationCenter';
import { ComplaintModal } from './components/student/ComplaintModal';
import { ProfileModal } from './components/common/ProfileModal';
import { HelpGuideModal } from './components/common/HelpGuideModal';
import { Phone, Mail, MapPin, ShieldCheck, Bus as BusIcon, Radio } from 'lucide-react';

const AppContent: React.FC = () => {
  const { role, setRole, isSimulating } = useBus();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F5FC] text-slate-900 selection:bg-purple-200 selection:text-purple-900">
      {/* Aesthetic ambient gradient blobs in background for soft blur pink/lavender atmosphere */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-300/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-10 right-10 w-96 h-96 bg-pink-300/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-1/2 left-10 w-80 h-80 bg-indigo-200/15 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Navigation Header */}
      <Header
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* Main Container Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {role === 'student' && (
          <StudentDashboard
            onOpenComplaintModal={() => setIsComplaintModalOpen(true)}
            onOpenProfileModal={() => setIsProfileModalOpen(true)}
          />
        )}

        {role === 'driver' && <DriverDashboard />}

        {role === 'admin' && <AdminDashboard />}
      </main>

      {/* Aesthetic Footer */}
      <footer className="mt-auto border-t border-purple-200/60 bg-white/70 backdrop-blur-md text-xs text-slate-500 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
              <BusIcon className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-800">CampusTransit</span>
            <span className="text-slate-400">·</span>
            <span>Smart College Bus Tracking &amp; Fleet Management</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-slate-600">
              <Phone className="w-3 h-3 text-purple-600" />
              <span>Transit Helpline: 1800-CAMPUS-BUS</span>
            </span>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="hover:text-purple-700 transition-colors cursor-pointer"
            >
              Account Profile
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => setRole(role === 'student' ? 'driver' : role === 'driver' ? 'admin' : 'student')}
              className="text-purple-600 font-semibold hover:underline cursor-pointer"
            >
              Switch Role ({role})
            </button>
          </div>
        </div>
      </footer>

      {/* Interactive Modals */}
      <NotificationCenter
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      <ComplaintModal
        isOpen={isComplaintModalOpen}
        onClose={() => setIsComplaintModalOpen(false)}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      <HelpGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onSelectRole={(newRole) => setRole(newRole)}
      />
    </div>
  );
};

export default function App() {
  return (
    <BusProvider>
      <AppContent />
    </BusProvider>
  );
}
