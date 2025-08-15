'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Zap,
  Bell,
  User,
  LogOut,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Complaint {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
}

export default function UserDashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/complaints', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setComplaints(data);
      }
    } catch (error) {
      toast.error('Gagal memuat data aduan');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'in_progress':
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      resolved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityBadge = (priority: string) => {
    const badges = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800',
    };
    return badges[priority as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || complaint.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'pending').length,
    inProgress: complaints.filter(c => c.status === 'in_progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-6">
              <Link href="/" className="flex items-center space-x-3">
                <div className="p-2 bg-blue-600 rounded-xl">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-semibold text-gray-900">PLN Selatpanjang</span>
              </Link>
              <div className="hidden lg:block h-6 w-px bg-gray-300"></div>
              <h1 className="hidden lg:block text-sm font-medium text-gray-700">Dashboard Pengguna</h1>
            </div>

            <div className="flex items-center space-x-3">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-gray-50">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                  <div className="text-xs text-gray-600 truncate max-w-32">{user?.email}</div>
                </div>
              </div>
              
              <button 
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-red-50 text-gray-600 hover:text-red-600 transition-colors duration-200"
                title="Keluar"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Selamat datang kembali, {user?.name}
          </h2>
          <p className="text-gray-600 text-sm">
            Kelola dan pantau status pengaduan listrik Anda dengan mudah
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { 
              label: 'Total Aduan', 
              value: stats.total, 
              icon: <FileText className="w-5 h-5" />,
              color: 'blue',
              bgColor: 'bg-blue-50',
              textColor: 'text-blue-600'
            },
            { 
              label: 'Menunggu', 
              value: stats.pending, 
              icon: <Clock className="w-5 h-5" />,
              color: 'yellow',
              bgColor: 'bg-yellow-50',
              textColor: 'text-yellow-600'
            },
            { 
              label: 'Diproses', 
              value: stats.inProgress, 
              icon: <AlertCircle className="w-5 h-5" />,
              color: 'blue',
              bgColor: 'bg-blue-50',
              textColor: 'text-blue-600'
            },
            { 
              label: 'Selesai', 
              value: stats.resolved, 
              icon: <CheckCircle className="w-5 h-5" />,
              color: 'green',
              bgColor: 'bg-green-50',
              textColor: 'text-green-600'
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center ${stat.textColor}`}>
                  {stat.icon}
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Actions and Filters */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-sm mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari berdasarkan judul atau deskripsi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm w-full sm:w-80 transition-colors"
                />
              </div>
              
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-8 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none text-sm min-w-40 transition-colors"
                >
                  <option value="all">Semua Status</option>
                  <option value="pending">Menunggu</option>
                  <option value="in_progress">Diproses</option>
                  <option value="resolved">Selesai</option>
                  <option value="rejected">Ditolak</option>
                </select>
              </div>
            </div>

            <Link
              href="/complaint/new"
              className="inline-flex items-center space-x-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Aduan Baru</span>
            </Link>
          </div>
        </div>

        {/* Complaints List */}
        <div className="space-y-4">
          {filteredComplaints.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white/70 backdrop-blur-sm rounded-xl p-12 border border-white/20 shadow-sm text-center"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm || filterStatus !== 'all' ? 'Tidak ada hasil' : 'Belum ada aduan'}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Tidak ditemukan aduan yang sesuai dengan kriteria pencarian. Coba ubah filter atau kata kunci.'
                  : 'Anda belum memiliki aduan. Mulai dengan membuat aduan pertama untuk melaporkan masalah listrik.'
                }
              </p>
              {!searchTerm && filterStatus === 'all' && (
                <Link
                  href="/complaint/new"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  <Plus className="w-5 h-5" />
                  <span>Buat Aduan Pertama</span>
                </Link>
              )}
            </motion.div>
          ) : (
            <div className="space-y-3">
              {filteredComplaints.map((complaint, index) => (
                <motion.div
                  key={complaint._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-3">
                        {getStatusIcon(complaint.status)}
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{complaint.title}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(complaint.status)}`}>
                          {complaint.status === 'pending' && 'Menunggu'}
                          {complaint.status === 'in_progress' && 'Diproses'}
                          {complaint.status === 'resolved' && 'Selesai'}
                          {complaint.status === 'rejected' && 'Ditolak'}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
                        {complaint.description}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-3 text-xs">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full font-medium ${getPriorityBadge(complaint.priority)}`}>
                          {complaint.priority === 'low' && 'Prioritas Rendah'}
                          {complaint.priority === 'medium' && 'Prioritas Sedang'}
                          {complaint.priority === 'high' && 'Prioritas Tinggi'}
                          {complaint.priority === 'urgent' && 'Urgent'}
                        </span>
                        <span className="text-gray-500">
                          {new Date(complaint.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                        <span className="text-gray-500 capitalize">
                          {complaint.category.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    
                    <Link
                      href={`/complaint/${complaint._id}`}
                      className="ml-6 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 whitespace-nowrap"
                    >
                      Lihat Detail
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Show results count */}
        {filteredComplaints.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Menampilkan {filteredComplaints.length} dari {complaints.length} aduan
            </p>
          </div>
        )}
      </main>
    </div>
  );
}