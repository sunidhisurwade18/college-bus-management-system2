import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Bus,
  Driver,
  BusRoute,
  Student,
  DailyAssignment,
  Complaint,
  SystemNotification,
  BreakdownEvent,
  UserRole,
  TripStatus,
  ScheduledTrip,
  BusPass,
  RouteStop,
} from '../types';
import {
  INITIAL_BUSES,
  INITIAL_DRIVERS,
  INITIAL_ROUTES,
  INITIAL_STUDENTS,
  INITIAL_ASSIGNMENTS,
  INITIAL_COMPLAINTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_BREAKDOWNS,
  INITIAL_SCHEDULED_TRIPS,
  INITIAL_BUS_PASSES,
} from '../data/initialData';

interface OccupancyInfo {
  busId: string;
  busNumber: string;
  capacity: number;
  assignedCount: number;
  availableSeats: number;
  occupancyPercent: number;
  status: 'normal' | 'near_capacity' | 'overloaded' | 'underutilized';
}

interface BusContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentStudentId: string;
  setCurrentStudentId: (id: string) => void;
  currentDriverId: string;
  setCurrentDriverId: (id: string) => void;

  buses: Bus[];
  drivers: Driver[];
  routes: BusRoute[];
  students: Student[];
  assignments: DailyAssignment[];
  complaints: Complaint[];
  notifications: SystemNotification[];
  breakdowns: BreakdownEvent[];
  scheduledTrips: ScheduledTrip[];
  busPasses: BusPass[];

  // Active view helpers
  currentStudent: Student | undefined;
  currentDriver: Driver | undefined;
  studentAssignment: DailyAssignment | undefined;
  studentBus: Bus | undefined;
  studentRoute: BusRoute | undefined;
  studentBusPass: BusPass | undefined;
  driverAssignment: DailyAssignment | undefined;
  driverBus: Bus | undefined;
  driverRoute: BusRoute | undefined;

  // Actions
  changeAssignedBus: (routeId: string, newBusId: string, reason: string) => void;
  reportBreakdown: (busId: string, problemDescription: string, locationText?: string) => void;
  assignReplacementBus: (breakdownId: string, replacementBusId: string) => void;
  reportDelay: (assignmentId: string, minutes: number, reason: string) => void;
  advanceTripStop: (assignmentId: string) => void;
  startTrip: (assignmentId: string) => void;
  completeTrip: (assignmentId: string) => void;
  triggerEmergencySOS: (driverId: string, locationText: string) => void;

  submitComplaint: (complaint: Omit<Complaint, 'id' | 'createdAt' | 'status'>) => void;
  resolveComplaint: (complaintId: string, reply: string) => void;

  sendBroadcastNotification: (
    title: string,
    message: string,
    type: SystemNotification['type'],
    targetAudience: 'all' | 'route',
    targetRouteId?: string
  ) => void;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;

  updateStudentPickupStop: (studentId: string, routeId: string, stopId: string) => void;
  updateStudentProfile: (studentId: string, updates: Partial<Student>) => void;
  addStudent: (student: Omit<Student, 'id'>) => void;
  deleteStudent: (studentId: string) => void;
  bulkAddDemoStudents: (count?: number) => void;

  addBus: (bus: Omit<Bus, 'id' | 'currentStopIndex' | 'lastUpdated'>) => void;
  deleteBus: (busId: string) => void;
  updateBusStatus: (busId: string, status: Bus['status']) => void;
  addDriver: (driver: Omit<Driver, 'id'>) => void;
  deleteDriver: (driverId: string) => void;
  addRoute: (route: BusRoute, defaultBusId?: string, defaultDriverId?: string) => void;
  deleteRoute: (routeId: string) => void;
  updateRouteStops: (routeId: string, stops: BusRoute['stops']) => void;
  updateStopTiming: (routeId: string, stopId: string, newTime: string) => void;
  updateStopDetails: (
    routeId: string,
    stopId: string,
    updates: { stopName?: string; landmark?: string; scheduledTime?: string }
  ) => void;
  addStopToRoute: (
    routeId: string,
    stop: { stopName: string; landmark: string; scheduledTime: string }
  ) => void;
  deleteStopFromRoute: (routeId: string, stopId: string) => void;

  // Scheduled trip actions
  addScheduledTrip: (trip: Omit<ScheduledTrip, 'id'>) => void;
  updateScheduledTrip: (tripId: string, updates: Partial<ScheduledTrip>) => void;
  deleteScheduledTrip: (tripId: string) => void;

  // Bus pass actions
  issueBusPass: (pass: Omit<BusPass, 'id' | 'issuedDate'>) => void;
  updateBusPassStatus: (passId: string, status: BusPass['status'], feeStatus?: BusPass['feeStatus']) => void;
  deleteBusPass: (passId: string) => void;

  getBusOccupancy: (busId: string) => OccupancyInfo;
  resetToDemoData: () => void;
  isSimulating: boolean;
  setIsSimulating: (simulating: boolean) => void;
}

const BusContext = createContext<BusContextType | undefined>(undefined);

const STORAGE_KEY = 'smart_campus_bus_state_v1';

export const BusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load persisted state or initial
  const [role, setRole] = useState<UserRole>('student');
  const [currentStudentId, setCurrentStudentId] = useState<string>('stu-1');
  const [currentDriverId, setCurrentDriverId] = useState<string>('driver-ramesh');

  const [buses, setBuses] = useState<Bus[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_buses`);
    return saved ? JSON.parse(saved) : INITIAL_BUSES;
  });

  const [drivers, setDrivers] = useState<Driver[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_drivers`);
    return saved ? JSON.parse(saved) : INITIAL_DRIVERS;
  });

  const [routes, setRoutes] = useState<BusRoute[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_routes`);
    return saved ? JSON.parse(saved) : INITIAL_ROUTES;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_students`);
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [assignments, setAssignments] = useState<DailyAssignment[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_assignments`);
    return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
  });

  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_complaints`);
    return saved ? JSON.parse(saved) : INITIAL_COMPLAINTS;
  });

  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_notifications`);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [breakdowns, setBreakdowns] = useState<BreakdownEvent[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_breakdowns`);
    return saved ? JSON.parse(saved) : INITIAL_BREAKDOWNS;
  });

  const [scheduledTrips, setScheduledTrips] = useState<ScheduledTrip[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_trips`);
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULED_TRIPS;
  });

  const [busPasses, setBusPasses] = useState<BusPass[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_bus_passes`);
    return saved ? JSON.parse(saved) : INITIAL_BUS_PASSES;
  });

  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_buses`, JSON.stringify(buses));
  }, [buses]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_drivers`, JSON.stringify(drivers));
  }, [drivers]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_routes`, JSON.stringify(routes));
  }, [routes]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_students`, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_assignments`, JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_complaints`, JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_notifications`, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_breakdowns`, JSON.stringify(breakdowns));
  }, [breakdowns]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_trips`, JSON.stringify(scheduledTrips));
  }, [scheduledTrips]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_bus_passes`, JSON.stringify(busPasses));
  }, [busPasses]);

  // Derived current user data
  const currentStudent = useMemo(() => {
    return students.find((s) => s.id === currentStudentId) || students[0];
  }, [students, currentStudentId]);

  const currentDriver = useMemo(() => {
    return drivers.find((d) => d.id === currentDriverId) || drivers[0];
  }, [drivers, currentDriverId]);

  const studentAssignment = useMemo(() => {
    if (!currentStudent) return undefined;
    return assignments.find((a) => a.routeId === currentStudent.routeId);
  }, [assignments, currentStudent]);

  const studentBus = useMemo(() => {
    if (!studentAssignment) return undefined;
    return buses.find((b) => b.id === studentAssignment.busId);
  }, [buses, studentAssignment]);

  const studentRoute = useMemo(() => {
    if (!currentStudent) return undefined;
    return routes.find((r) => r.id === currentStudent.routeId);
  }, [routes, currentStudent]);

  const studentBusPass = useMemo(() => {
    if (!currentStudent) return undefined;
    return busPasses.find((p) => p.studentId === currentStudent.id);
  }, [busPasses, currentStudent]);

  const driverAssignment = useMemo(() => {
    if (!currentDriver) return undefined;
    return assignments.find((a) => a.driverId === currentDriver.id);
  }, [assignments, currentDriver]);

  const driverBus = useMemo(() => {
    if (!driverAssignment) return undefined;
    return buses.find((b) => b.id === driverAssignment.busId);
  }, [buses, driverAssignment]);

  const driverRoute = useMemo(() => {
    if (!driverAssignment) return undefined;
    return routes.find((r) => r.id === driverAssignment.routeId);
  }, [routes, driverAssignment]);

  // Occupancy helper
  const getBusOccupancy = (busId: string): OccupancyInfo => {
    const bus = buses.find((b) => b.id === busId);
    const capacity = bus?.capacity || 50;

    // Find assignment for this bus
    const assignment = assignments.find((a) => a.busId === busId);
    let assignedCount = 0;

    if (assignment) {
      // In college buses, e.g. for BUS-12 on Rau Route, base commuters = 47 plus current explicit students
      const routeStudents = students.filter((s) => s.routeId === assignment.routeId).length;
      if (assignment.routeId === 'route-rau') {
        assignedCount = 45 + routeStudents; // default ~49 to match SRS example of 49/52
      } else if (assignment.routeId === 'route-vijaynagar') {
        assignedCount = 28 + routeStudents; // ~30 to match SRS example of 30/52
      } else {
        assignedCount = 38 + routeStudents;
      }
    } else {
      assignedCount = 0;
    }

    const availableSeats = Math.max(0, capacity - assignedCount);
    const occupancyPercent = Math.min(120, Math.round((assignedCount / capacity) * 100));

    let status: OccupancyInfo['status'] = 'normal';
    if (occupancyPercent > 100) status = 'overloaded';
    else if (occupancyPercent >= 90) status = 'near_capacity';
    else if (occupancyPercent < 40 && assignedCount > 0) status = 'underutilized';

    return {
      busId,
      busNumber: bus?.busNumber || busId,
      capacity,
      assignedCount,
      availableSeats,
      occupancyPercent,
      status,
    };
  };

  // Same-Day Bus Change (SRS Section 10 & 11)
  const changeAssignedBus = (routeId: string, newBusId: string, reason: string) => {
    const targetRoute = routes.find((r) => r.id === routeId);
    const oldAssignment = assignments.find((a) => a.routeId === routeId);
    const newBus = buses.find((b) => b.id === newBusId);
    const oldBus = buses.find((b) => b.id === oldAssignment?.busId);

    if (!newBus || !targetRoute) return;

    const oldBusNumber = oldBus?.busNumber || 'Previous Bus';
    const newBusNumber = newBus.busNumber;

    // Update assignment
    setAssignments((prev) =>
      prev.map((a) => {
        if (a.routeId === routeId) {
          return {
            ...a,
            busId: newBusId,
            status: 'Changed',
            originalBusId: a.originalBusId || oldBus?.id,
            replacementReason: reason,
            changedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
        }
        return a;
      })
    );

    // Update bus states
    setBuses((prev) =>
      prev.map((b) => {
        if (b.id === newBusId) {
          return { ...b, status: 'On Route', currentRouteId: routeId };
        }
        if (oldBus && b.id === oldBus.id) {
          return { ...b, status: 'Standby', currentRouteId: undefined };
        }
        return b;
      })
    );

    // Dispatch broadcast notification to affected students
    const notificationId = `notif-${Date.now()}`;
    const newNotif: SystemNotification = {
      id: notificationId,
      targetAudience: 'route',
      targetRouteId: routeId,
      title: 'Same-Day Bus Change Alert',
      message: `Your bus has been changed from ${oldBusNumber} to ${newBusNumber} today. Reason: ${reason}. Please board ${newBusNumber} at your scheduled pickup stop.`,
      type: 'bus_change',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      busId: newBusId,
    };

    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Report Bus Breakdown (SRS Section 13)
  const reportBreakdown = (busId: string, problemDescription: string, locationText?: string) => {
    const bus = buses.find((b) => b.id === busId);
    const assignment = assignments.find((a) => a.busId === busId);
    const driver = drivers.find((d) => d.id === bus?.assignedDriverId);

    const breakdownId = `bd-${Date.now()}`;
    const newBreakdown: BreakdownEvent = {
      id: breakdownId,
      busId,
      routeId: assignment?.routeId || bus?.currentRouteId || '',
      driverId: driver?.id || '',
      problemDescription,
      locationText: locationText || 'En route',
      reportedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      resolved: false,
    };

    setBreakdowns((prev) => [newBreakdown, ...prev]);

    // Update bus status
    setBuses((prev) =>
      prev.map((b) => (b.id === busId ? { ...b, status: 'Breakdown', speedKmH: 0 } : b))
    );

    // Update assignment status
    if (assignment) {
      setAssignments((prev) =>
        prev.map((a) => (a.id === assignment.id ? { ...a, tripStatus: 'Halted' } : a))
      );
    }

    // Send notification to students
    const notif: SystemNotification = {
      id: `notif-${Date.now()}`,
      targetAudience: assignment ? 'route' : 'all',
      targetRouteId: assignment?.routeId,
      title: `Bus Breakdown: ${bus?.busNumber}`,
      message: `${bus?.busNumber} has reported a breakdown (${problemDescription}). The transport desk is actively arranging a replacement bus. Please stay at your stop.`,
      type: 'breakdown',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      busId,
    };

    setNotifications((prev) => [notif, ...prev]);
  };

  // Assign Replacement Bus (SRS Section 14)
  const assignReplacementBus = (breakdownId: string, replacementBusId: string) => {
    const breakdown = breakdowns.find((b) => b.id === breakdownId);
    if (!breakdown) return;

    const brokenBus = buses.find((b) => b.id === breakdown.busId);
    const replacementBus = buses.find((b) => b.id === replacementBusId);
    const replacementDriver = drivers.find((d) => d.assignedBusId === replacementBusId);

    if (!brokenBus || !replacementBus) return;

    // Mark breakdown resolved with replacement bus
    setBreakdowns((prev) =>
      prev.map((b) => (b.id === breakdownId ? { ...b, resolved: true, replacementBusId } : b))
    );

    // Update assignment to point to replacement bus
    setAssignments((prev) =>
      prev.map((a) => {
        if (a.routeId === breakdown.routeId || a.busId === breakdown.busId) {
          return {
            ...a,
            busId: replacementBusId,
            driverId: replacementDriver?.id || a.driverId,
            status: 'Replaced',
            tripStatus: 'In Transit',
            originalBusId: brokenBus.id,
            replacementReason: `Replacement dispatched for broken down ${brokenBus.busNumber} (${breakdown.problemDescription})`,
            changedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
        }
        return a;
      })
    );

    // Update bus statuses
    setBuses((prev) =>
      prev.map((b) => {
        if (b.id === replacementBusId) {
          return { ...b, status: 'On Route', currentRouteId: breakdown.routeId, speedKmH: 38 };
        }
        return b;
      })
    );

    // Broadcast clear replacement notification to students
    const notif: SystemNotification = {
      id: `notif-${Date.now()}`,
      targetAudience: 'route',
      targetRouteId: breakdown.routeId,
      title: 'Replacement Bus Deployed',
      message: `Replacement bus ${replacementBus.busNumber} has been assigned for your route to replace ${brokenBus.busNumber}. Driver: ${replacementDriver?.name || 'Assigned Driver'}. Expected to reach stops smoothly.`,
      type: 'replacement',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      busId: replacementBusId,
    };

    setNotifications((prev) => [notif, ...prev]);
  };

  // Report Delay
  const reportDelay = (assignmentId: string, minutes: number, reason: string) => {
    const assignment = assignments.find((a) => a.id === assignmentId);
    if (!assignment) return;

    const bus = buses.find((b) => b.id === assignment.busId);

    setAssignments((prev) =>
      prev.map((a) =>
        a.id === assignmentId
          ? { ...a, delayMinutes: minutes, delayReason: reason, tripStatus: 'Delayed' }
          : a
      )
    );

    setBuses((prev) =>
      prev.map((b) => (b.id === assignment.busId ? { ...b, status: 'Delayed' } : b))
    );

    // Notify students
    const notif: SystemNotification = {
      id: `notif-${Date.now()}`,
      targetAudience: 'route',
      targetRouteId: assignment.routeId,
      title: `Delay Alert: ${bus?.busNumber} (+${minutes} Mins)`,
      message: `${bus?.busNumber} is running approximately ${minutes} minutes behind schedule. Reason: ${reason}.`,
      type: 'delay',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      busId: bus?.id,
    };

    setNotifications((prev) => [notif, ...prev]);
  };

  // Advance Trip Stop (Driver simulation or manual control)
  const advanceTripStop = (assignmentId: string) => {
    const assignment = assignments.find((a) => a.id === assignmentId);
    if (!assignment) return;

    const route = routes.find((r) => r.id === assignment.routeId);
    if (!route) return;

    const nextIndex = assignment.currentStopIndex + 1;
    const isCompleted = nextIndex >= route.stops.length - 1;

    setAssignments((prev) =>
      prev.map((a) => {
        if (a.id === assignmentId) {
          return {
            ...a,
            currentStopIndex: Math.min(nextIndex, route.stops.length - 1),
            tripStatus: isCompleted ? 'Completed' : 'In Transit',
          };
        }
        return a;
      })
    );

    // Update bus state
    setBuses((prev) =>
      prev.map((b) => {
        if (b.id === assignment.busId) {
          return {
            ...b,
            currentStopIndex: Math.min(nextIndex, route.stops.length - 1),
            status: isCompleted ? 'Active' : 'On Route',
            speedKmH: isCompleted ? 0 : 35,
            lastUpdated: 'Just now',
          };
        }
        return b;
      })
    );
  };

  const startTrip = (assignmentId: string) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === assignmentId ? { ...a, tripStatus: 'In Transit', currentStopIndex: 0 } : a))
    );
    const assignment = assignments.find((a) => a.id === assignmentId);
    if (assignment) {
      setBuses((prev) =>
        prev.map((b) =>
          b.id === assignment.busId ? { ...b, status: 'On Route', currentStopIndex: 0, speedKmH: 30 } : b
        )
      );
    }
  };

  const completeTrip = (assignmentId: string) => {
    const assignment = assignments.find((a) => a.id === assignmentId);
    setAssignments((prev) =>
      prev.map((a) => (a.id === assignmentId ? { ...a, tripStatus: 'Completed' } : a))
    );
    if (assignment) {
      setBuses((prev) =>
        prev.map((b) =>
          b.id === assignment.busId ? { ...b, status: 'Active', speedKmH: 0, lastUpdated: 'Trip finished' } : b
        )
      );
    }
  };

  const triggerEmergencySOS = (driverId: string, locationText: string) => {
    const driver = drivers.find((d) => d.id === driverId);
    const bus = buses.find((b) => b.id === driver?.assignedBusId);

    const notif: SystemNotification = {
      id: `notif-${Date.now()}`,
      targetAudience: 'all',
      title: `EMERGENCY SOS: ${bus?.busNumber || 'College Bus'}`,
      message: `Emergency SOS triggered by Driver ${driver?.name || 'Staff'} at ${locationText}. Campus Security and Transit Dispatch have been dispatched immediately.`,
      type: 'sos',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      busId: bus?.id,
    };

    setNotifications((prev) => [notif, ...prev]);
  };

  // Complaints
  const submitComplaint = (compData: Omit<Complaint, 'id' | 'createdAt' | 'status'>) => {
    const newComplaint: Complaint = {
      ...compData,
      id: `comp-${Date.now()}`,
      createdAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'Pending',
    };
    setComplaints((prev) => [newComplaint, ...prev]);
  };

  const resolveComplaint = (complaintId: string, reply: string) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === complaintId
          ? {
              ...c,
              status: 'Resolved',
              adminReply: reply,
              resolvedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          : c
      )
    );
  };

  // Notifications
  const sendBroadcastNotification = (
    title: string,
    message: string,
    type: SystemNotification['type'],
    targetAudience: 'all' | 'route',
    targetRouteId?: string
  ) => {
    const newNotif: SystemNotification = {
      id: `notif-${Date.now()}`,
      targetAudience,
      targetRouteId,
      title,
      message,
      type,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Student Profile Updates
  const updateStudentPickupStop = (studentId: string, routeId: string, stopId: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, routeId, pickupStopId: stopId } : s))
    );
  };

  const updateStudentProfile = (studentId: string, updates: Partial<Student>) => {
    setStudents((prev) => prev.map((s) => (s.id === studentId ? { ...s, ...updates } : s)));
  };

  const addStudent = (studentData: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...studentData,
      id: `stu-${Date.now()}`,
    };
    setStudents((prev) => [newStudent, ...prev]);
  };

  const deleteStudent = (studentId: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
  };

  const bulkAddDemoStudents = (count: number = 25) => {
    const firstNames = ['Amit', 'Pooja', 'Rahul', 'Neha', 'Vikas', 'Kiran', 'Siddharth', 'Tanvi', 'Deepak', 'Megha', 'Harsh', 'Ankita', 'Nitin', 'Divya', 'Saurabh'];
    const lastNames = ['Sharma', 'Verma', 'Patel', 'Joshi', 'Singh', 'Gupta', 'Chouhan', 'Tiwari', 'Yadav', 'Malviya', 'Pandey', 'Mishra'];
    const departments = ['Computer Science', 'Information Tech', 'Electronics', 'Mechanical', 'Civil Engg'];

    const newBatch: Student[] = [];
    for (let i = 0; i < count; i++) {
      const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
      const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
      const targetRoute = routes[i % routes.length] || routes[0];
      const targetStop = targetRoute.stops[Math.floor(Math.random() * targetRoute.stops.length)] || targetRoute.stops[0];
      const enroll = `0801CS22${1100 + students.length + i}`;

      newBatch.push({
        id: `stu-bulk-${Date.now()}-${i}`,
        enrollmentNumber: enroll,
        name: `${fn} ${ln}`,
        email: `${fn.toLowerCase()}.${ln.toLowerCase()}@college.edu.in`,
        mobile: `+91 98${Math.floor(10000000 + Math.random() * 90000000)}`,
        department: departments[i % departments.length],
        semester: `${(i % 8) + 1}th Semester`,
        routeId: targetRoute.id,
        pickupStopId: targetStop.stopId,
      });
    }

    setStudents((prev) => [...prev, ...newBatch]);
  };

  // Fleet & Routes
  const addBus = (busData: Omit<Bus, 'id' | 'currentStopIndex' | 'lastUpdated'>) => {
    const newBusId = `bus-${Date.now().toString().slice(-4)}`;
    const newBus: Bus = {
      ...busData,
      id: newBusId,
      currentStopIndex: 0,
      lastUpdated: 'Just now',
    };
    setBuses((prev) => [...prev, newBus]);

    // If driver was assigned, update driver's record
    if (busData.assignedDriverId) {
      setDrivers((prev) =>
        prev.map((d) => (d.id === busData.assignedDriverId ? { ...d, assignedBusId: newBusId } : d))
      );
    }
  };

  const deleteBus = (busId: string) => {
    setBuses((prev) => prev.filter((b) => b.id !== busId));
    setDrivers((prev) => prev.map((d) => (d.assignedBusId === busId ? { ...d, assignedBusId: undefined } : d)));
  };

  const updateBusStatus = (busId: string, status: Bus['status']) => {
    setBuses((prev) => prev.map((b) => (b.id === busId ? { ...b, status } : b)));
  };

  const addDriver = (driverData: Omit<Driver, 'id'>) => {
    const newDriverId = `driver-${Date.now().toString().slice(-4)}`;
    const newDriver: Driver = {
      ...driverData,
      id: newDriverId,
    };
    setDrivers((prev) => [...prev, newDriver]);

    // If bus was assigned, update bus's record
    if (driverData.assignedBusId) {
      setBuses((prev) =>
        prev.map((b) => (b.id === driverData.assignedBusId ? { ...b, assignedDriverId: newDriverId } : b))
      );
    }
  };

  const deleteDriver = (driverId: string) => {
    setDrivers((prev) => prev.filter((d) => d.id !== driverId));
    setBuses((prev) => prev.map((b) => (b.assignedDriverId === driverId ? { ...b, assignedDriverId: '' } : b)));
  };

  const addRoute = (route: BusRoute, defaultBusId?: string, defaultDriverId?: string) => {
    setRoutes((prev) => [...prev, route]);

    // Automatically create a daily assignment for this route so it's live!
    if (defaultBusId && defaultDriverId) {
      const newAssignment: DailyAssignment = {
        id: `assign-${Date.now()}`,
        date: '2026-10-11',
        routeId: route.id,
        busId: defaultBusId,
        driverId: defaultDriverId,
        status: 'Scheduled',
        tripStatus: 'Not Started',
        currentStopIndex: 0,
        delayMinutes: 0,
      };
      setAssignments((prev) => [...prev, newAssignment]);
      setBuses((prev) =>
        prev.map((b) => (b.id === defaultBusId ? { ...b, currentRouteId: route.id, status: 'Active' } : b))
      );
    }
  };

  const deleteRoute = (routeId: string) => {
    setRoutes((prev) => prev.filter((r) => r.id !== routeId));
    setAssignments((prev) => prev.filter((a) => a.routeId !== routeId));
  };

  const updateRouteStops = (routeId: string, stops: BusRoute['stops']) => {
    setRoutes((prev) => prev.map((r) => (r.id === routeId ? { ...r, stops } : r)));
  };

  const updateStopTiming = (routeId: string, stopId: string, newTime: string) => {
    setRoutes((prev) =>
      prev.map((r) => {
        if (r.id === routeId) {
          const updatedStops = r.stops.map((s) =>
            s.stopId === stopId ? { ...s, scheduledTime: newTime, estimatedTime: newTime } : s
          );
          return { ...r, stops: updatedStops };
        }
        return r;
      })
    );
  };

  const deleteStopFromRoute = (routeId: string, stopId: string) => {
    setRoutes((prev) =>
      prev.map((r) => {
        if (r.id === routeId) {
          const remaining = r.stops.filter((s) => s.stopId !== stopId);
          // Re-sequence 1, 2, 3...
          const resequenced = remaining.map((s, idx) => ({ ...s, sequence: idx + 1 }));
          return { ...r, stops: resequenced };
        }
        return r;
      })
    );
  };

  const updateStopDetails = (
    routeId: string,
    stopId: string,
    updates: { stopName?: string; landmark?: string; scheduledTime?: string }
  ) => {
    setRoutes((prev) =>
      prev.map((r) => {
        if (r.id === routeId) {
          const updatedStops = r.stops.map((s) =>
            s.stopId === stopId
              ? {
                  ...s,
                  ...(updates.stopName ? { stopName: updates.stopName } : {}),
                  ...(updates.landmark ? { landmark: updates.landmark } : {}),
                  ...(updates.scheduledTime ? { scheduledTime: updates.scheduledTime, estimatedTime: updates.scheduledTime } : {}),
                }
              : s
          );
          return { ...r, stops: updatedStops };
        }
        return r;
      })
    );
  };

  const addStopToRoute = (
    routeId: string,
    newStopData: { stopName: string; landmark: string; scheduledTime: string }
  ) => {
    setRoutes((prev) =>
      prev.map((r) => {
        if (r.id === routeId) {
          const newSequence = r.stops.length + 1;
          const newStop: RouteStop = {
            stopId: `stop-${Date.now().toString().slice(-4)}`,
            stopName: newStopData.stopName,
            landmark: newStopData.landmark,
            sequence: newSequence,
            scheduledTime: newStopData.scheduledTime,
            estimatedTime: newStopData.scheduledTime,
            distanceFromPreviousKm: 3.5,
          };
          return {
            ...r,
            stops: [...r.stops, newStop],
            totalDistanceKm: Number((r.totalDistanceKm + 3.5).toFixed(1)),
          };
        }
        return r;
      })
    );
  };

  // Scheduled Trips Actions
  const addScheduledTrip = (tripData: Omit<ScheduledTrip, 'id'>) => {
    const newTrip: ScheduledTrip = {
      ...tripData,
      id: `trip-${Date.now().toString().slice(-5)}`,
    };
    setScheduledTrips((prev) => [newTrip, ...prev]);
  };

  const updateScheduledTrip = (tripId: string, updates: Partial<ScheduledTrip>) => {
    setScheduledTrips((prev) =>
      prev.map((t) => (t.id === tripId ? { ...t, ...updates } : t))
    );
  };

  const deleteScheduledTrip = (tripId: string) => {
    setScheduledTrips((prev) => prev.filter((t) => t.id !== tripId));
  };

  // Bus Pass Actions
  const issueBusPass = (passData: Omit<BusPass, 'id' | 'issuedDate'>) => {
    const newPass: BusPass = {
      ...passData,
      id: `PASS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      issuedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    setBusPasses((prev) => [newPass, ...prev]);
  };

  const updateBusPassStatus = (passId: string, status: BusPass['status'], feeStatus?: BusPass['feeStatus']) => {
    setBusPasses((prev) =>
      prev.map((p) =>
        p.id === passId
          ? {
              ...p,
              status,
              ...(feeStatus ? { feeStatus } : {}),
            }
          : p
      )
    );
  };

  const deleteBusPass = (passId: string) => {
    setBusPasses((prev) => prev.filter((p) => p.id !== passId));
  };

  // Reset demo data
  const resetToDemoData = () => {
    localStorage.removeItem(`${STORAGE_KEY}_buses`);
    localStorage.removeItem(`${STORAGE_KEY}_drivers`);
    localStorage.removeItem(`${STORAGE_KEY}_routes`);
    localStorage.removeItem(`${STORAGE_KEY}_students`);
    localStorage.removeItem(`${STORAGE_KEY}_assignments`);
    localStorage.removeItem(`${STORAGE_KEY}_complaints`);
    localStorage.removeItem(`${STORAGE_KEY}_notifications`);
    localStorage.removeItem(`${STORAGE_KEY}_breakdowns`);
    localStorage.removeItem(`${STORAGE_KEY}_trips`);
    localStorage.removeItem(`${STORAGE_KEY}_bus_passes`);

    setBuses(INITIAL_BUSES);
    setDrivers(INITIAL_DRIVERS);
    setRoutes(INITIAL_ROUTES);
    setStudents(INITIAL_STUDENTS);
    setAssignments(INITIAL_ASSIGNMENTS);
    setComplaints(INITIAL_COMPLAINTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setBreakdowns(INITIAL_BREAKDOWNS);
    setScheduledTrips(INITIAL_SCHEDULED_TRIPS);
    setBusPasses(INITIAL_BUS_PASSES);
    setRole('student');
    setCurrentStudentId('stu-1');
    setCurrentDriverId('driver-ramesh');
    setIsSimulating(false);
  };

  // Live simulation ticker when simulation is enabled
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      // Find the Rau Route assignment as primary simulation
      const rauAssignment = assignments.find((a) => a.routeId === 'route-rau');
      if (rauAssignment && rauAssignment.tripStatus === 'In Transit') {
        const rauRoute = routes.find((r) => r.id === 'route-rau');
        if (rauRoute) {
          const nextIdx = (rauAssignment.currentStopIndex + 1) % rauRoute.stops.length;
          setAssignments((prev) =>
            prev.map((a) =>
              a.id === rauAssignment.id ? { ...a, currentStopIndex: nextIdx } : a
            )
          );
          setBuses((prev) =>
            prev.map((b) =>
              b.id === rauAssignment.busId
                ? {
                    ...b,
                    currentStopIndex: nextIdx,
                    speedKmH: Math.floor(28 + Math.random() * 16),
                    fuelPercentage: Math.max(10, b.fuelPercentage - 0.1),
                    lastUpdated: 'Live GPS Ping',
                  }
                : b
            )
          );
        }
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [isSimulating, assignments, routes]);

  return (
    <BusContext.Provider
      value={{
        role,
        setRole,
        currentStudentId,
        setCurrentStudentId,
        currentDriverId,
        setCurrentDriverId,
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
        currentStudent,
        currentDriver,
        studentAssignment,
        studentBus,
        studentRoute,
        studentBusPass,
        driverAssignment,
        driverBus,
        driverRoute,
        changeAssignedBus,
        reportBreakdown,
        assignReplacementBus,
        reportDelay,
        advanceTripStop,
        startTrip,
        completeTrip,
        triggerEmergencySOS,
        submitComplaint,
        resolveComplaint,
        sendBroadcastNotification,
        markNotificationAsRead,
        markAllNotificationsRead,
        updateStudentPickupStop,
        updateStudentProfile,
        addStudent,
        deleteStudent,
        bulkAddDemoStudents,
        addBus,
        deleteBus,
        updateBusStatus,
        addDriver,
        deleteDriver,
        addRoute,
        deleteRoute,
        updateRouteStops,
        updateStopTiming,
        updateStopDetails,
        addStopToRoute,
        deleteStopFromRoute,
        addScheduledTrip,
        updateScheduledTrip,
        deleteScheduledTrip,
        issueBusPass,
        updateBusPassStatus,
        deleteBusPass,
        getBusOccupancy,
        resetToDemoData,
        isSimulating,
        setIsSimulating,
      }}
    >
      {children}
    </BusContext.Provider>
  );
};

export const useBus = () => {
  const context = useContext(BusContext);
  if (!context) {
    throw new Error('useBus must be used within a BusProvider');
  }
  return context;
};
