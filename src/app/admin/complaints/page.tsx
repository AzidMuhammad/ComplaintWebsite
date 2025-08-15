'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter,
  Eye,
  Edit,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  MapPin,
  Calendar,
  FileText,
  X,
  Paperclip,
  Download,
  FileImage
} from 'lucide-react';

interface Complaint {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  title: string;
  description: string;
  category: 'listrik_padam' | 'tagihan' | 'instalasi' | 'lainnya';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
  location: string;
  customerNumber?: string;
  attachments?: string[];
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [newAdminNotes, setNewAdminNotes] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, []);

  useEffect(() => {
    filterComplaints();
  }, [complaints, searchTerm, statusFilter, priorityFilter]);

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
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterComplaints = () => {
    let filtered = complaints;

    if (searchTerm) {
      filtered = filtered.filter(complaint =>
        complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(complaint => complaint.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(complaint => complaint.priority === priorityFilter);
    }

    setFilteredComplaints(filtered);
  };

  const updateComplaintStatus = async (id: string, status: string, adminNotes?: string) => {
    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/complaints/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status, adminNotes }),
      });

      if (res.ok) {
        await fetchComplaints();
        setShowModal(false);
        setSelectedComplaint(null);
        setNewAdminNotes('');
      }
    } catch (error) {
      console.error('Error updating complaint:', error);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Menunggu' },
      in_progress: { color: 'bg-blue-100 text-blue-800', icon: AlertTriangle, text: 'Diproses' },
      resolved: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Selesai' },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'Ditolak' },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { color: 'bg-gray-100 text-gray-800', text: 'Rendah' },
      medium: { color: 'bg-yellow-100 text-yellow-800', text: 'Sedang' },
      high: { color: 'bg-orange-100 text-orange-800', text: 'Tinggi' },
      urgent: { color: 'bg-red-100 text-red-800', text: 'Mendesak' },
    };

    const config = priorityConfig[priority as keyof typeof priorityConfig];

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getCategoryText = (category: string) => {
    const categories = {
      listrik_padam: 'Listrik Padam',
      tagihan: 'Tagihan',
      instalasi: 'Instalasi',
      lainnya: 'Lainnya',
    };
    return categories[category as keyof typeof categories] || category;
  };

  const isImageFile = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  };

  const isPDFFile = (url: string) => {
    return /\.pdf$/i.test(url);
  };

  const getFileName = (url: string) => {
    return url.split('/').pop() || 'file';
  };

  const handleModalOpen = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setNewAdminNotes(complaint.adminNotes || '');
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Kelola Aduan</h1>
        <p className="text-gray-600">Kelola dan pantau semua aduan yang masuk</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari aduan, nama pengguna, atau lokasi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Semua Status</option>
            <option value="pending">Menunggu</option>
            <option value="in_progress">Diproses</option>
            <option value="resolved">Selesai</option>
            <option value="rejected">Ditolak</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Semua Prioritas</option>
            <option value="low">Rendah</option>
            <option value="medium">Sedang</option>
            <option value="high">Tinggi</option>
            <option value="urgent">Mendesak</option>
          </select>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aduan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prioritas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lampiran
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredComplaints.map((complaint) => (
                <tr key={complaint._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{complaint.title}</div>
                      <div className="text-sm text-gray-500 flex items-center space-x-4">
                        <span className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {complaint.user.name}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {complaint.location}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {getCategoryText(complaint.category)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(complaint.status)}
                  </td>
                  <td className="px-6 py-4">
                    {getPriorityBadge(complaint.priority)}
                  </td>
                  <td className="px-6 py-4">
                    {complaint.attachments && complaint.attachments.length > 0 ? (
                      <div className="flex items-center space-x-2">
                        <Paperclip className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {complaint.attachments.length} file
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Tidak ada</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(complaint.createdAt).toLocaleDateString('id-ID')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleModalOpen(complaint)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Lihat Detail"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleModalOpen(complaint)}
                        className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                        title="Update Status"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredComplaints.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada aduan</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                ? 'Tidak ada aduan yang sesuai dengan filter'
                : 'Belum ada aduan yang masuk'
              }
            </p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showModal && selectedComplaint && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
            <div className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" onClick={() => setShowModal(false)} />
            
            <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-white px-6 pt-6 pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Detail Aduan</h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
                    <p className="text-sm text-gray-900">{selectedComplaint.title}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                    <p className="text-sm text-gray-900 whitespace-pre-line">{selectedComplaint.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pelapor</label>
                      <p className="text-sm text-gray-900">{selectedComplaint.user.name}</p>
                      <p className="text-xs text-gray-500">{selectedComplaint.user.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
                      <p className="text-sm text-gray-900">{selectedComplaint.location}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                      <p className="text-sm text-gray-900">{getCategoryText(selectedComplaint.category)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Prioritas</label>
                      {getPriorityBadge(selectedComplaint.priority)}
                    </div>
                  </div>

                  {selectedComplaint.customerNumber && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Pelanggan</label>
                      <p className="text-sm text-gray-900 font-mono">{selectedComplaint.customerNumber}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status Saat Ini</label>
                    {getStatusBadge(selectedComplaint.status)}
                  </div>

                  {/* Attachments Section */}
                  {selectedComplaint.attachments && selectedComplaint.attachments.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Lampiran ({selectedComplaint.attachments.length})
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedComplaint.attachments.map((attachment, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                            {isImageFile(attachment) ? (
                              <div className="relative group">
                                <img
                                  src={attachment}
                                  alt={`Lampiran ${index + 1}`}
                                  className="w-full h-32 object-cover cursor-pointer"
                                  onClick={() => setSelectedImage(attachment)}
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-3">
                                  <button
                                    onClick={() => setSelectedImage(attachment)}
                                    className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                                    title="Lihat gambar"
                                  >
                                    <Eye className="w-4 h-4 text-white" />
                                  </button>
                                  <a
                                    href={attachment}
                                    download
                                    className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                                    title="Unduh file"
                                  >
                                    <Download className="w-4 h-4 text-white" />
                                  </a>
                                </div>
                                <div className="p-3 bg-white">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {getFileName(attachment)}
                                  </p>
                                  <p className="text-xs text-gray-500">Gambar</p>
                                </div>
                              </div>
                            ) : isPDFFile(attachment) ? (
                              <div className="p-4 bg-red-50 border-l-4 border-red-500">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <FileText className="w-8 h-8 text-red-600" />
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">
                                        {getFileName(attachment)}
                                      </p>
                                      <p className="text-xs text-gray-500">PDF Document</p>
                                    </div>
                                  </div>
                                  <div className="flex space-x-2">
                                    <a
                                      href={attachment}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                      title="Buka PDF"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </a>
                                    <a
                                      href={attachment}
                                      download
                                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                      title="Unduh PDF"
                                    >
                                      <Download className="w-4 h-4" />
                                    </a>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="p-4 bg-gray-50">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <FileText className="w-8 h-8 text-gray-600" />
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">
                                        {getFileName(attachment)}
                                      </p>
                                      <p className="text-xs text-gray-500">File</p>
                                    </div>
                                  </div>
                                  <a
                                    href={attachment}
                                    download
                                    className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                                    title="Unduh file"
                                  >
                                    <Download className="w-4 h-4" />
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Admin Notes Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Catatan Admin</label>
                    <textarea
                      value={newAdminNotes}
                      onChange={(e) => setNewAdminNotes(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Tambahkan catatan untuk pengguna..."
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Update Status</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <button
                      onClick={() => updateComplaintStatus(selectedComplaint._id, 'pending', newAdminNotes)}
                      disabled={updating}
                      className="px-3 py-2 bg-yellow-600 text-white text-sm rounded-md hover:bg-yellow-700 disabled:opacity-50 transition-colors"
                    >
                      Pending
                    </button>
                    <button
                      onClick={() => updateComplaintStatus(selectedComplaint._id, 'in_progress', newAdminNotes)}
                      disabled={updating}
                      className="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      Proses
                    </button>
                    <button
                      onClick={() => updateComplaintStatus(selectedComplaint._id, 'resolved', newAdminNotes)}
                      disabled={updating}
                      className="px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                      Selesai
                    </button>
                    <button
                      onClick={() => updateComplaintStatus(selectedComplaint._id, 'rejected', newAdminNotes)}
                      disabled={updating}
                      className="px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
                    >
                      Tolak
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              title="Tutup"
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={selectedImage}
              alt="Lampiran"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <div className="absolute bottom-4 right-4">
              <a
                href={selectedImage}
                download
                className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Unduh</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}