import React, { useState, useEffect } from 'react';
import {
  Car,
  Calendar,
  Users,
  Compass,
  Wrench,
  Mail,
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Search,
  Filter,
  AlertTriangle
} from 'lucide-react';
import { adminService } from '../../services/admin/adminService';
import { destinationService } from '../../services/destinations/destinationService';
import {
  Booking,
  ContactMessage,
  DashboardSummary,
  Destination,
  District,
  Vehicle,
  VehicleMaintenance
} from '../../types';
import Badge from '../../components/common/Badge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';

type AdminTab = 'overview' | 'vehicles' | 'bookings' | 'maintenance' | 'messages';

const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(true);

  // Vehicles state
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [vehicleForm, setVehicleForm] = useState({
    make: '',
    model: '',
    manufacturingYear: 2023,
    category: 'SUV' as 'Car' | 'SUV' | 'Van' | 'Compact' | 'Luxury',
    description: '',
    registrationNumber: '',
    passengerCapacity: 5,
    luggageCapacity: 3,
    transmission: 'Automatic' as 'Automatic' | 'Manual' | 'Auto',
    fuelType: 'Petrol' as 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric',
    dailyRate: 15000,
    listingStatus: 'AVAILABLE' as 'AVAILABLE' | 'MAINTENANCE' | 'UNAVAILABLE' | 'ARCHIVED',
    primaryImageUrl: ''
  });

  // Bookings state
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  // Maintenance state
  const [maintenanceList, setMaintenanceList] = useState<VehicleMaintenance[]>([]);
  const [maintenanceLoading, setMaintenanceLoading] = useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [maintForm, setMaintForm] = useState({
    vehicleId: 1,
    startDateTime: '',
    endDateTime: '',
    reason: '',
    status: 'SCHEDULED'
  });

  // Messages state
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  // Load KPI overview
  const loadSummary = async () => {
    setLoadingSummary(true);
    try {
      const data = await adminService.getDashboardSummary();
      setSummary(data);
    } catch (err) {
      console.error('Failed to load dashboard summary', err);
    } finally {
      setLoadingSummary(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  // Load Tab Data
  useEffect(() => {
    if (activeTab === 'vehicles') {
      loadVehicles();
    } else if (activeTab === 'bookings') {
      loadBookings();
    } else if (activeTab === 'maintenance') {
      loadMaintenance();
    } else if (activeTab === 'messages') {
      loadMessages();
    }
  }, [activeTab]);

  const loadVehicles = async () => {
    setVehiclesLoading(true);
    try {
      const data = await adminService.getAdminVehicles(0, 50);
      setVehicles(data.content);
    } catch (err) {
      console.error(err);
    } finally {
      setVehiclesLoading(false);
    }
  };

  const loadBookings = async () => {
    setBookingsLoading(true);
    try {
      const data = await adminService.getAdminBookings(0, 50);
      setBookings(data.content);
    } catch (err) {
      console.error(err);
    } finally {
      setBookingsLoading(false);
    }
  };

  const loadMaintenance = async () => {
    setMaintenanceLoading(true);
    try {
      const data = await adminService.getMaintenance();
      setMaintenanceList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setMaintenanceLoading(false);
    }
  };

  const loadMessages = async () => {
    setMessagesLoading(true);
    try {
      const data = await adminService.getContactMessages(0, 50);
      setMessages(data.content);
    } catch (err) {
      console.error(err);
    } finally {
      setMessagesLoading(false);
    }
  };

  // Vehicle Actions
  const handleOpenNewVehicle = () => {
    setEditingVehicle(null);
    setVehicleForm({
      make: 'Toyota',
      model: '',
      manufacturingYear: 2023,
      category: 'Car',
      description: '',
      registrationNumber: '',
      passengerCapacity: 5,
      luggageCapacity: 3,
      transmission: 'Automatic',
      fuelType: 'Petrol',
      dailyRate: 12000,
      listingStatus: 'AVAILABLE',
      primaryImageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'
    });
    setIsVehicleModalOpen(true);
  };

  const handleOpenEditVehicle = (veh: Vehicle) => {
    setEditingVehicle(veh);
    setVehicleForm({
      make: veh.make,
      model: veh.model,
      manufacturingYear: veh.manufacturingYear,
      category: veh.category,
      description: veh.description || '',
      registrationNumber: veh.registrationNumber,
      passengerCapacity: veh.passengerCapacity,
      luggageCapacity: veh.luggageCapacity,
      transmission: veh.transmission,
      fuelType: veh.fuelType,
      dailyRate: veh.dailyRate,
      listingStatus: veh.listingStatus,
      primaryImageUrl: veh.primaryImageUrl
    });
    setIsVehicleModalOpen(true);
  };

  const handleSaveVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingVehicle) {
        await adminService.updateVehicle(editingVehicle.id, vehicleForm);
      } else {
        await adminService.createVehicle(vehicleForm);
      }
      setIsVehicleModalOpen(false);
      loadVehicles();
      loadSummary();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save vehicle.');
    }
  };

  const handleDeleteVehicle = async (id: number) => {
    if (!confirm('Are you sure you want to delete/archive this vehicle?')) return;
    try {
      await adminService.deleteVehicle(id);
      loadVehicles();
      loadSummary();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete vehicle.');
    }
  };

  // Booking Status Action
  const handleUpdateBookingStatus = async (id: number, status: string) => {
    try {
      await adminService.updateBookingStatus(id, status);
      loadBookings();
      loadSummary();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update booking status.');
    }
  };

  // Maintenance Actions
  const handleCreateMaintenance = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminService.scheduleMaintenance(maintForm);
      setIsMaintenanceModalOpen(false);
      loadMaintenance();
      loadSummary();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to schedule maintenance.');
    }
  };

  const handleDeleteMaintenance = async (id: number) => {
    if (!confirm('Remove this maintenance block?')) return;
    try {
      await adminService.deleteMaintenance(id);
      loadMaintenance();
      loadSummary();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to remove maintenance.');
    }
  };

  // Message Action
  const handleMarkMessageRead = async (id: number) => {
    try {
      await adminService.markMessageAsRead(id);
      loadMessages();
      loadSummary();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-[#0B3B3C] text-xs font-bold uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Operations Control
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              TourLynk <span className="text-[#0B3B3C]">Admin Console</span>
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Manage fleet reservations, vehicle inventory, maintenance schedules, and customer inquiries.
            </p>
          </div>

          <button
            onClick={() => {
              loadSummary();
              if (activeTab === 'vehicles') loadVehicles();
              if (activeTab === 'bookings') loadBookings();
              if (activeTab === 'maintenance') loadMaintenance();
              if (activeTab === 'messages') loadMessages();
            }}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs rounded-xl shadow-xs transition"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Data
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8 border-b border-slate-200 scrollbar-none">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'vehicles', label: 'Vehicles Fleet', icon: Car },
            { id: 'bookings', label: 'Reservations', icon: Calendar },
            { id: 'maintenance', label: 'Maintenance', icon: Wrench },
            { id: 'messages', label: 'Inquiries', icon: Mail }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-[#0B3B3C] text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.id === 'messages' && summary?.unreadContactMessages ? (
                  <span className="w-5 h-5 bg-[#F5B041] text-slate-950 rounded-full text-[10px] font-black flex items-center justify-center">
                    {summary.unreadContactMessages}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            {loadingSummary ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <LoadingSkeleton key={i} className="h-28 rounded-2xl" />
                ))}
              </div>
            ) : summary ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Fleet Total</span>
                    <Car className="w-5 h-5 text-[#0B3B3C]" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900">{summary.totalVehicles}</div>
                  <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
                    {summary.availableVehicles} Available now
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Confirmed Bookings</span>
                    <Calendar className="w-5 h-5 text-amber-500" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900">{summary.confirmedBookings}</div>
                  <span className="text-[11px] text-slate-500 font-medium mt-1 block">
                    {summary.upcomingBookings} upcoming / pending
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Registered Users</span>
                    <Users className="w-5 h-5 text-teal-600" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900">{summary.totalUsers}</div>
                  <span className="text-[11px] text-slate-500 font-medium mt-1 block">Active platform tourists</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">In Maintenance</span>
                    <Wrench className="w-5 h-5 text-rose-500" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900">{summary.activeMaintenance}</div>
                  <span className="text-[11px] text-rose-600 font-medium mt-1 block">Vehicles in service</span>
                </div>
              </div>
            ) : null}

            {/* Recent Bookings in Overview */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Recent Booking Requests</h3>
                  <p className="text-xs text-slate-500">Latest reservations placed through the platform</p>
                </div>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className="text-xs font-bold text-[#0B3B3C] hover:underline"
                >
                  View All Reservations →
                </button>
              </div>

              {summary?.recentBookings && summary.recentBookings.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase tracking-wider">
                        <th className="py-3 px-4 font-semibold">Ref</th>
                        <th className="py-3 px-4 font-semibold">User</th>
                        <th className="py-3 px-4 font-semibold">Vehicle</th>
                        <th className="py-3 px-4 font-semibold">Dates</th>
                        <th className="py-3 px-4 font-semibold">Total</th>
                        <th className="py-3 px-4 font-semibold">Status</th>
                        <th className="py-3 px-4 font-semibold text-right">Quick Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {summary.recentBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-50/70 transition">
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-800">{b.bookingReference}</td>
                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-slate-900 block">{b.userName}</span>
                            <span className="text-[11px] text-slate-400">{b.userEmail}</span>
                          </td>
                          <td className="py-3.5 px-4 font-medium text-slate-800">
                            {b.vehicleMake} {b.vehicleModel}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">
                            {new Date(b.startDateTime).toLocaleDateString()} ({b.totalDays}d)
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-900">
                            LKR {b.totalAmount.toLocaleString()}
                          </td>
                          <td className="py-3.5 px-4">
                            <Badge
                              variant={
                                b.bookingStatus === 'CONFIRMED'
                                  ? 'success'
                                  : b.bookingStatus === 'PENDING'
                                  ? 'warning'
                                  : b.bookingStatus === 'COMPLETED'
                                  ? 'info'
                                  : 'danger'
                              }
                            >
                              {b.bookingStatus}
                            </Badge>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            {b.bookingStatus === 'PENDING' && (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleUpdateBookingStatus(b.id, 'CONFIRMED')}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px]"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => handleUpdateBookingStatus(b.id, 'REJECTED')}
                                  className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-[10px]"
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-slate-500 py-6 text-center">No recent bookings found.</p>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: VEHICLES FLEET */}
        {activeTab === 'vehicles' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Fleet Inventory</h3>
                <p className="text-xs text-slate-500">Configure vehicles, daily rental rates, and statuses</p>
              </div>
              <button
                type="button"
                onClick={handleOpenNewVehicle}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0B3B3C] hover:bg-[#0E4D52] text-white font-bold text-xs rounded-xl shadow-sm transition"
              >
                <Plus className="w-4 h-4" /> Add Vehicle
              </button>
            </div>

            {vehiclesLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <LoadingSkeleton key={i} className="h-12 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4 font-semibold">Vehicle</th>
                      <th className="py-3 px-4 font-semibold">Category</th>
                      <th className="py-3 px-4 font-semibold">Reg. No</th>
                      <th className="py-3 px-4 font-semibold">Specs</th>
                      <th className="py-3 px-4 font-semibold">Daily Rate</th>
                      <th className="py-3 px-4 font-semibold">Listing Status</th>
                      <th className="py-3 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {vehicles.map((v) => (
                      <tr key={v.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={v.primaryImageUrl}
                              alt={v.model}
                              className="w-12 h-10 rounded-lg object-cover bg-slate-100"
                            />
                            <div>
                              <span className="font-bold text-slate-900 block">
                                {v.make} {v.model}
                              </span>
                              <span className="text-[10px] text-slate-400">{v.manufacturingYear}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-700">{v.category}</td>
                        <td className="py-3 px-4 font-mono font-medium text-slate-600">{v.registrationNumber}</td>
                        <td className="py-3 px-4 text-slate-500">
                          {v.passengerCapacity} Seats • {v.transmission} • {v.fuelType}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          LKR {v.dailyRate.toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={
                              v.listingStatus === 'AVAILABLE'
                                ? 'success'
                                : v.listingStatus === 'MAINTENANCE'
                                ? 'warning'
                                : 'danger'
                            }
                          >
                            {v.listingStatus}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditVehicle(v)}
                              className="p-1.5 text-slate-600 hover:text-[#0B3B3C] hover:bg-slate-100 rounded-lg transition"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteVehicle(v.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                              title="Delete/Archive"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: RESERVATIONS */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">All Reservations</h3>
              <p className="text-xs text-slate-500">Approve, reject, or mark bookings as completed</p>
            </div>

            {bookingsLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <LoadingSkeleton key={i} className="h-12 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4 font-semibold">Ref</th>
                      <th className="py-3 px-4 font-semibold">Customer</th>
                      <th className="py-3 px-4 font-semibold">Vehicle</th>
                      <th className="py-3 px-4 font-semibold">Rental Window</th>
                      <th className="py-3 px-4 font-semibold">Amount</th>
                      <th className="py-3 px-4 font-semibold">Status</th>
                      <th className="py-3 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">{b.bookingReference}</td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-slate-900 block">{b.userName}</span>
                          <span className="text-[10px] text-slate-400">{b.userEmail}</span>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-800">
                          {b.vehicleMake} {b.vehicleModel}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {new Date(b.startDateTime).toLocaleDateString()} –{' '}
                          {new Date(b.endDateTime).toLocaleDateString()}
                          <span className="block text-[10px] text-slate-400">({b.totalDays} Days)</span>
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          LKR {b.totalAmount.toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={
                              b.bookingStatus === 'CONFIRMED'
                                ? 'success'
                                : b.bookingStatus === 'PENDING'
                                ? 'warning'
                                : b.bookingStatus === 'COMPLETED'
                                ? 'info'
                                : 'danger'
                            }
                          >
                            {b.bookingStatus}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <select
                            value={b.bookingStatus}
                            onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value)}
                            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#0B3B3C]"
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="CANCELLED">CANCELLED</option>
                            <option value="REJECTED">REJECTED</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: MAINTENANCE */}
        {activeTab === 'maintenance' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Vehicle Maintenance Windows</h3>
                <p className="text-xs text-slate-500">
                  Scheduled service automatically blocks vehicle availability during the selected dates
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMaintForm({
                    vehicleId: vehicles[0]?.id || 1,
                    startDateTime: '',
                    endDateTime: '',
                    reason: '',
                    status: 'SCHEDULED'
                  });
                  setIsMaintenanceModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0B3B3C] hover:bg-[#0E4D52] text-white font-bold text-xs rounded-xl shadow-sm transition"
              >
                <Plus className="w-4 h-4" /> Schedule Maintenance
              </button>
            </div>

            {maintenanceLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <LoadingSkeleton key={i} className="h-12 rounded-xl" />
                ))}
              </div>
            ) : maintenanceList.length === 0 ? (
              <p className="text-xs text-slate-500 py-8 text-center">No maintenance windows scheduled.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4 font-semibold">Vehicle</th>
                      <th className="py-3 px-4 font-semibold">Registration</th>
                      <th className="py-3 px-4 font-semibold">Maintenance Period</th>
                      <th className="py-3 px-4 font-semibold">Reason</th>
                      <th className="py-3 px-4 font-semibold">Status</th>
                      <th className="py-3 px-4 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {maintenanceList.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3 px-4 font-bold text-slate-900">{m.vehicleModel}</td>
                        <td className="py-3 px-4 font-mono text-slate-600">{m.vehicleRegistrationNumber}</td>
                        <td className="py-3 px-4 text-slate-700">
                          {new Date(m.startDateTime).toLocaleDateString()} –{' '}
                          {new Date(m.endDateTime).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-slate-600">{m.reason}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            {m.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteMaintenance(m.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: INQUIRIES */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Customer Inquiries</h3>
              <p className="text-xs text-slate-500">Contact form messages submitted by travelers</p>
            </div>

            {messagesLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <LoadingSkeleton key={i} className="h-14 rounded-xl" />
                ))}
              </div>
            ) : messages.length === 0 ? (
              <p className="text-xs text-slate-500 py-8 text-center">No messages received yet.</p>
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-4 rounded-2xl border transition ${
                      msg.status === 'NEW'
                        ? 'bg-amber-50/50 border-amber-200'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{msg.name}</span>
                        <span className="text-xs text-slate-500 font-mono">({msg.email})</span>
                        {msg.status === 'NEW' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 uppercase">
                            New
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(msg.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-800 mb-1">{msg.subject}</div>
                    <p className="text-xs text-slate-600 leading-relaxed">{msg.message}</p>
                    {msg.status === 'NEW' && (
                      <div className="mt-3 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleMarkMessageRead(msg.id)}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
                        >
                          Mark as Read
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Vehicle Form Modal */}
      {isVehicleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-900">
                {editingVehicle ? 'Edit Vehicle Details' : 'Add New Vehicle'}
              </h3>
              <button
                type="button"
                onClick={() => setIsVehicleModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveVehicle} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Make</label>
                  <input
                    type="text"
                    required
                    value={vehicleForm.make}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, make: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Model</label>
                  <input
                    type="text"
                    required
                    value={vehicleForm.model}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, model: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Year</label>
                  <input
                    type="number"
                    required
                    value={vehicleForm.manufacturingYear}
                    onChange={(e) =>
                      setVehicleForm({ ...vehicleForm, manufacturingYear: parseInt(e.target.value) || 2023 })
                    }
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={vehicleForm.category}
                    onChange={(e: any) => setVehicleForm({ ...vehicleForm, category: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Car">Car</option>
                    <option value="SUV">SUV</option>
                    <option value="Van">Van</option>
                    <option value="Compact">Compact</option>
                    <option value="Luxury">Luxury</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Reg. Number</label>
                  <input
                    type="text"
                    required
                    value={vehicleForm.registrationNumber}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, registrationNumber: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Transmission</label>
                  <select
                    value={vehicleForm.transmission}
                    onChange={(e: any) => setVehicleForm({ ...vehicleForm, transmission: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Fuel Type</label>
                  <select
                    value={vehicleForm.fuelType}
                    onChange={(e: any) => setVehicleForm({ ...vehicleForm, fuelType: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Daily Rate (LKR)</label>
                  <input
                    type="number"
                    required
                    value={vehicleForm.dailyRate}
                    onChange={(e) =>
                      setVehicleForm({ ...vehicleForm, dailyRate: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Passenger Capacity</label>
                  <input
                    type="number"
                    value={vehicleForm.passengerCapacity}
                    onChange={(e) =>
                      setVehicleForm({ ...vehicleForm, passengerCapacity: parseInt(e.target.value) || 4 })
                    }
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Luggage Capacity</label>
                  <input
                    type="number"
                    value={vehicleForm.luggageCapacity}
                    onChange={(e) =>
                      setVehicleForm({ ...vehicleForm, luggageCapacity: parseInt(e.target.value) || 2 })
                    }
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Listing Status</label>
                  <select
                    value={vehicleForm.listingStatus}
                    onChange={(e: any) => setVehicleForm({ ...vehicleForm, listingStatus: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="MAINTENANCE">MAINTENANCE</option>
                    <option value="UNAVAILABLE">UNAVAILABLE</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Primary Image URL</label>
                <input
                  type="url"
                  required
                  value={vehicleForm.primaryImageUrl}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, primaryImageUrl: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={vehicleForm.description}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, description: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsVehicleModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0B3B3C] hover:bg-[#0E4D52] text-white rounded-xl font-bold"
                >
                  Save Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Maintenance Form Modal */}
      {isMaintenanceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Schedule Vehicle Maintenance</h3>
              <button
                type="button"
                onClick={() => setIsMaintenanceModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMaintenance} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Vehicle</label>
                <select
                  value={maintForm.vehicleId}
                  onChange={(e) => setMaintForm({ ...maintForm, vehicleId: parseInt(e.target.value) })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.make} {v.model} ({v.registrationNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Start Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={maintForm.startDateTime}
                  onChange={(e) => setMaintForm({ ...maintForm, startDateTime: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">End Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={maintForm.endDateTime}
                  onChange={(e) => setMaintForm({ ...maintForm, endDateTime: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Maintenance Reason</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Periodic engine overhaul, brake pad replacement"
                  value={maintForm.reason}
                  onChange={(e) => setMaintForm({ ...maintForm, reason: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsMaintenanceModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0B3B3C] hover:bg-[#0E4D52] text-white rounded-xl font-bold"
                >
                  Block Dates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
