'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  FileText, 
  MapPin, 
  Phone, 
  Upload, 
  AlertCircle,
  Zap,
  Building,
  X,
  FileImage,
  FileCheck,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

interface UploadedFile {
  originalName: string;
  filename: string;
  size: number;
  type: string;
  url: string;
}

export default function NewComplaintPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'listrik_padam',
    priority: 'medium',
    location: '',
    customerNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploadLoading, setUploadLoading] = useState(false);
  const router = useRouter();

  const categories = [
    { value: 'listrik_padam', label: 'Listrik Padam', icon: '⚡' },
    { value: 'tagihan', label: 'Masalah Tagihan', icon: '💰' },
    { value: 'instalasi', label: 'Instalasi Baru', icon: '🔧' },
    { value: 'lainnya', label: 'Lainnya', icon: '📋' },
  ];

  const priorities = [
    { value: 'low', label: 'Rendah', description: 'Tidak mendesak', color: 'gray' },
    { value: 'medium', label: 'Sedang', description: 'Perlu perhatian', color: 'yellow' },
    { value: 'high', label: 'Tinggi', description: 'Segera ditangani', color: 'orange' },
    { value: 'urgent', label: 'Urgent', description: 'Darurat', color: 'red' },
  ];

  const handleFileUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;

    setUploadLoading(true);
    const formData = new FormData();
    
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setUploadedFiles(prev => [...prev, ...result.files]);
        toast.success(`${result.files.length} file berhasil diupload`);
      } else {
        toast.error(result.message || 'Gagal mengupload file');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat mengupload file');
    } finally {
      setUploadLoading(false);
    }
  };

  const removeFile = (filename: string) => {
    setUploadedFiles(prev => prev.filter(file => file.filename !== filename));
    toast.success('File berhasil dihapus');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <FileImage className="w-5 h-5 text-blue-600" />;
    } else if (type === 'application/pdf') {
      return <FileCheck className="w-5 h-5 text-red-600" />;
    }
    return <FileText className="w-5 h-5 text-gray-600" />;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const submitData = {
        ...formData,
        attachments: uploadedFiles.map(file => file.url)
      };

      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(submitData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Aduan berhasil dibuat!');
        router.push('/dashboard');
      } else {
        toast.error(data.message || 'Gagal membuat aduan');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan pada server');
    } finally {
      setLoading(false);
    }
  };

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
                <span className="text-lg font-semibold text-gray-900">Buat Aduan Baru</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Buat Aduan Baru</h1>
            <p className="text-gray-600 text-sm leading-relaxed">
              Lengkapi formulir berikut dengan informasi yang akurat untuk membantu kami menangani keluhan Anda dengan lebih efektif
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Title */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">
                  Judul Aduan <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    placeholder="Contoh: Listrik padam di area Jalan Merdeka"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-900">
                  Kategori Masalah <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {categories.map((category) => (
                    <button
                      key={category.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: category.value })}
                      className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                        formData.category === category.value
                          ? 'border-blue-500 bg-blue-50 text-blue-900'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{category.icon}</span>
                        <span className="font-medium">{category.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-900">
                  Tingkat Prioritas <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {priorities.map((priority) => (
                    <button
                      key={priority.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, priority: priority.value })}
                      className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                        formData.priority === priority.value
                          ? `border-${priority.color}-500 bg-${priority.color}-50`
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-gray-900">{priority.label}</div>
                          <div className="text-sm text-gray-600">{priority.description}</div>
                        </div>
                        {formData.priority === priority.value && (
                          <div className={`w-2 h-2 rounded-full bg-${priority.color}-500`}></div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Location & Customer Number */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    Lokasi Kejadian <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                      placeholder="Alamat lengkap dengan RT/RW"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    Nomor Pelanggan
                    <span className="text-gray-500 text-xs ml-1">(Opsional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={formData.customerNumber}
                      onChange={(e) => setFormData({ ...formData, customerNumber: e.target.value })}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                      placeholder="Nomor ID PLN Anda"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">
                  Deskripsi Masalah <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="block w-full px-3 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 resize-none"
                  placeholder="Jelaskan secara detail masalah yang Anda alami, termasuk waktu kejadian, dampak yang dirasakan, dan informasi lain yang relevan..."
                />
                <p className="text-xs text-gray-500">
                  Informasi yang lengkap dan detail akan membantu tim teknis menangani masalah Anda dengan lebih cepat dan tepat.
                </p>
              </div>

            {/* File Upload */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-900">
                  Lampiran Pendukung
                  <span className="text-gray-500 text-xs ml-1">(Opsional)</span>
                </label>
                
                {/* Upload Area */}
                <div 
                  className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
                    uploadLoading 
                      ? 'border-blue-400 bg-blue-50/50' 
                      : 'border-gray-300 bg-gray-50/50 hover:border-blue-400 hover:bg-blue-50/50'
                  }`}
                  onDrop={(e) => {
                    e.preventDefault();
                    const files = e.dataTransfer.files;
                    if (files.length > 0) {
                      handleFileUpload(files);
                    }
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDragEnter={(e) => e.preventDefault()}
                >
                  {uploadLoading ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
                      <p className="text-sm font-medium text-blue-700">Mengupload file...</p>
                      <p className="text-xs text-blue-600">Harap tunggu sebentar</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-700">
                          Seret file ke sini atau{' '}
                          <label 
                            htmlFor="file-upload"
                            className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium underline"
                          >
                            klik untuk memilih
                          </label>
                        </p>
                        <p className="text-xs text-gray-500">
                          Format: JPG, PNG, PDF • Ukuran maksimal: 5MB per file
                        </p>
                      </div>
                    </>
                  )}
                  
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files && files.length > 0) {
                        handleFileUpload(files);
                        e.target.value = ''; // Reset input setelah upload
                      }
                    }}
                    disabled={uploadLoading}
                  />
                </div>

                {/* Uploaded Files List */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-900">File yang diupload:</h4>
                    <div className="space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div 
                          key={index}
                          className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
                        >
                          <div className="flex items-center space-x-3 flex-1 min-w-0">
                            {getFileIcon(file.type)}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {file.originalName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatFileSize(file.size)} • {file.type.split('/')[1].toUpperCase()}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(file.filename)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
                            title="Hapus file"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <h4 className="font-medium text-blue-900 mb-2">Penting untuk diketahui:</h4>
                    <ul className="text-blue-800 space-y-1 text-xs leading-relaxed">
                      <li>• Tim kami akan merespons aduan dalam waktu maksimal 24 jam kerja</li>
                      <li>• Notifikasi update status akan dikirim melalui email terdaftar</li>
                      <li>• Untuk gangguan darurat yang mengancam keselamatan, hubungi hotline 123</li>
                      <li>• Pastikan nomor telepon dan email Anda aktif untuk komunikasi lanjutan</li>
                      <li>• Lampiran foto/dokumen akan membantu proses penanganan yang lebih cepat</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Link
                  href="/dashboard"
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 text-center"
                >
                  Batal
                </Link>
                <button
                  type="submit"
                  disabled={loading || uploadLoading}
                  className="flex-1 flex justify-center items-center py-3 px-6 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Mengirim aduan...</span>
                    </div>
                  ) : (
                    'Kirim Aduan'
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  );
}