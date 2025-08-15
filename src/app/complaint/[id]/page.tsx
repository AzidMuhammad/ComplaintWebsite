'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  MapPin,
  User,
  Phone,
  Calendar,
  FileText,
  Zap,
  Building,
  Hash,
  Download,
  Eye,
  Paperclip,
  X
} from 'lucide-react';

interface ComplaintDetail {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  location: string;
  customerNumber?: string;
  attachments?: string[];
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ComplaintDetailPage() {
  const params = useParams();
  const [complaint, setComplaint] = useState<ComplaintDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchComplaint(params.id as string);
    }
  }, [params.id]);

  const fetchComplaint = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/complaints/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setComplaint(data);
      }
    } catch (error) {
      console.error('Error fetching complaint:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      pending: { 
        icon: <Clock className="w-5 h-5" />, 
        bg: 'bg-yellow-50', 
        border: 'border-yellow-200',
        text: 'text-yellow-800', 
        label: 'Menunggu Verifikasi',
        description: 'Aduan sedang dalam antrian untuk diverifikasi tim'
      },
      in_progress: { 
        icon: <AlertCircle className="w-5 h-5" />, 
        bg: 'bg-blue-50', 
        border: 'border-blue-200',
        text: 'text-blue-800', 
        label: 'Sedang Diproses',
        description: 'Tim teknis sedang menangani masalah Anda'
      },
      resolved: { 
        icon: <CheckCircle className="w-5 h-5" />, 
        bg: 'bg-green-50', 
        border: 'border-green-200',
        text: 'text-green-800', 
        label: 'Selesai Ditangani',
        description: 'Masalah telah berhasil diselesaikan'
      },
      rejected: { 
        icon: <XCircle className="w-5 h-5" />, 
        bg: 'bg-red-50', 
        border: 'border-red-200',
        text: 'text-red-800', 
        label: 'Ditolak',
        description: 'Aduan tidak dapat diproses lebih lanjut'
      },
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  const getPriorityConfig = (priority: string) => {
    const configs = {
      low: { bg: 'bg-gray-50', text: 'text-gray-700', label: 'Prioritas Rendah' },
      medium: { bg: 'bg-yellow-50', text: 'text-yellow-700', label: 'Prioritas Sedang' },
      high: { bg: 'bg-orange-50', text: 'text-orange-700', label: 'Prioritas Tinggi' },
      urgent: { bg: 'bg-red-50', text: 'text-red-700', label: 'Prioritas Urgent' },
    };
    return configs[priority as keyof typeof configs] || configs.medium;
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

  const timeline = [
    {
      status: 'pending',
      label: 'Aduan Diterima',
      description: 'Aduan berhasil dikirim dan masuk dalam sistem',
      completed: true,
    },
    {
      status: 'in_progress', 
      label: 'Sedang Diproses',
      description: 'Tim teknis telah mengambil alih dan menangani masalah',
      completed: complaint?.status === 'in_progress' || complaint?.status === 'resolved',
    },
    {
      status: 'resolved',
      label: 'Penyelesaian',
      description: 'Masalah telah diselesaikan dan aduan ditutup',
      completed: complaint?.status === 'resolved',
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Memuat detail aduan...</p>
        </div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Aduan tidak ditemukan</h2>
          <p className="text-gray-600 mb-4">Aduan yang Anda cari tidak tersedia atau telah dihapus.</p>
          <Link 
            href="/dashboard" 
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(complaint.status);
  const priorityConfig = getPriorityConfig(complaint.priority);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                title="Kembali ke Dashboard"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-600 rounded-xl">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-semibold text-gray-900">Detail Aduan</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Status Banner */}
          <div className={`${statusConfig.bg} ${statusConfig.border} border rounded-lg p-4`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={statusConfig.text}>
                  {statusConfig.icon}
                </div>
                <div>
                  <h3 className={`font-semibold ${statusConfig.text}`}>{statusConfig.label}</h3>
                  <p className={`text-sm ${statusConfig.text} opacity-80`}>{statusConfig.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Hash className="w-4 h-4" />
                <span className="font-mono">{complaint._id.slice(-8).toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Complaint Header */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <h1 className="text-xl font-bold text-gray-900 leading-tight">{complaint.title}</h1>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${priorityConfig.bg} ${priorityConfig.text}`}>
                    {priorityConfig.label}
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(complaint.createdAt).toLocaleDateString('id-ID', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FileText className="w-4 h-4" />
                    <span className="capitalize">{complaint.category.replace('_', ' ')}</span>
                  </div>
                </div>

                <div className="prose prose-sm max-w-none">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Deskripsi Masalah:</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{complaint.description}</p>
                </div>
              </div>

              {/* Attachments */}
              {complaint.attachments && complaint.attachments.length > 0 && (
                <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Paperclip className="w-5 h-5 text-gray-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Lampiran</h2>
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                      {complaint.attachments.length} file
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {complaint.attachments.map((attachment, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                        {isImageFile(attachment) ? (
                          <div className="relative group">
                            <Image
                              src={attachment}
                              alt={`Lampiran ${index + 1}`}
                              width={400}
                              height={200}
                              className="w-full h-32 object-cover"
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

              {/* Timeline */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Progress Timeline</h2>
                <div className="space-y-6">
                  {timeline.map((step, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                        step.completed 
                          ? 'bg-green-100 border-green-500' 
                          : 'bg-gray-100 border-gray-300'
                      }`}>
                        {step.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className={`font-medium ${step.completed ? 'text-green-800' : 'text-gray-500'}`}>
                            {step.label}
                          </h3>
                          {step.completed && (
                            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                              Selesai
                            </span>
                          )}
                        </div>
                        <p className={`text-sm mt-1 ${step.completed ? 'text-green-600' : 'text-gray-400'}`}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Admin Notes */}
              {complaint.adminNotes && (
                <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Catatan dari Tim Teknis</h2>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p className="text-blue-800 text-sm leading-relaxed">{complaint.adminNotes}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Details */}
            <div className="space-y-6">
              {/* Quick Info */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Detail</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-700">Lokasi Kejadian</p>
                      <p className="text-sm text-gray-600 mt-1">{complaint.location}</p>
                    </div>
                  </div>

                  {complaint.customerNumber && (
                    <div className="flex items-start space-x-3">
                      <Building className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-700">Nomor Pelanggan</p>
                        <p className="text-sm text-gray-600 mt-1 font-mono">{complaint.customerNumber}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-700">Dibuat</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(complaint.createdAt).toLocaleString('id-ID', {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-700">Terakhir Diperbarui</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(complaint.updatedAt).toLocaleString('id-ID', {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Bantuan & Kontak</h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="font-medium text-gray-800 mb-2">Hotline Darurat</h4>
                    <p className="text-gray-600">
                      <Phone className="w-4 h-4 inline mr-2" />
                      123 (24 jam)
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="font-medium text-gray-800 mb-2">Estimasi Penanganan</h4>
                    <p className="text-gray-600">
                      {complaint.priority === 'urgent' && '1-4 jam'}
                      {complaint.priority === 'high' && '4-12 jam'}
                      {complaint.priority === 'medium' && '1-2 hari kerja'}
                      {complaint.priority === 'low' && '2-5 hari kerja'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Aksi</h3>
                <div className="space-y-3">
                  <Link
                    href="/dashboard"
                    className="w-full inline-flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Kembali ke Dashboard</span>
                  </Link>
                  
                  {complaint.status !== 'resolved' && complaint.status !== 'rejected' && (
                    <button
                      className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
                      onClick={() => {
                      }}
                    >
                      Hubungi Tim Teknis
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Image Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
            <div className="relative max-w-4xl max-h-full">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              >
                <X className="w-8 h-8" />
              </button>
              <Image
                src={selectedImage}
                alt="Lampiran"
                width={800}
                height={600}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}