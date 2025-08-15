'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Shield, 
  Clock, 
  Users, 
  ArrowRight, 
  Phone, 
  Mail, 
  MapPin,
  Star,
  CheckCircle,
  FileText,
  TrendingUp,
  Award,
  Smartphone,
  Monitor,
  Headphones
} from 'lucide-react';

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const features = [
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Respon Cepat',
      description: 'Laporan Anda akan diproses dalam waktu 24 jam dengan sistem notifikasi real-time',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Data Aman',
      description: 'Informasi pribadi Anda terjamin keamanannya dengan enkripsi tingkat enterprise',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Tim Profesional',
      description: 'Ditangani oleh teknisi berpengalaman dengan sertifikasi internasional',
    },
  ];

  const stats = [
    { number: '1,234', label: 'Aduan Selesai' },
    { number: '98%', label: 'Tingkat Kepuasan' },
    { number: '24/7', label: 'Layanan' },
    { number: '15', label: 'Teknisi Ahli' },
  ];

  const services = [
    {
      icon: <FileText className="w-12 h-12" />,
      title: 'Aduan Online',
      description: 'Laporkan gangguan listrik kapan saja, dimana saja melalui platform digital yang mudah digunakan'
    },
    {
      icon: <TrendingUp className="w-12 h-12" />,
      title: 'Monitoring Real-time',
      description: 'Pantau status penanganan aduan Anda secara langsung dengan update progres terkini'
    },
    {
      icon: <Award className="w-12 h-12" />,
      title: 'Layanan Premium',
      description: 'Dapatkan prioritas penanganan dan konsultasi teknis dari tim ahli kami'
    },
    {
      icon: <Headphones className="w-12 h-12" />,
      title: 'Support 24/7',
      description: 'Tim customer service siap membantu Anda sepanjang waktu untuk setiap kebutuhan'
    }
  ];

  const testimonials = [
    {
      name: 'Budi Santoso',
      role: 'Pemilik Toko',
      rating: 5,
      comment: 'Pelayanan sangat memuaskan. Gangguan listrik di toko saya ditangani dengan cepat dan profesional.',
      location: 'Selatpanjang'
    },
    {
      name: 'Sari Dewi',
      role: 'Ibu Rumah Tangga',
      rating: 5,
      comment: 'Sistem aduan online sangat memudahkan. Tidak perlu datang ke kantor, semua bisa dilakukan dari rumah.',
      location: 'Tebing Tinggi'
    },
    {
      name: 'Ahmad Rizki',
      role: 'Pengusaha',
      rating: 5,
      comment: 'Tracking real-time sangat membantu untuk memantau progress penanganan. Highly recommended!',
      location: 'Bagansiapiapi'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-effect backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Zap className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-800">PLN ULP Selatpanjang</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/login"
                className="px-4 py-2 text-blue-600 font-medium transition-colors duration-300"
              >
                Masuk
              </Link>
              <Link 
                href="/register"
                className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-300"
              >
                Daftar
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-20 relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium">
                  <Zap className="w-4 h-4 mr-2" />
                  Platform Aduan Terdepan
                </div>
                <h1 className="text-5xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  Sistem Aduan
                  <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    PLN ULP Selatpanjang
                  </span>
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                  Laporkan gangguan listrik dengan mudah dan pantau status penanganan 
                  secara real-time melalui platform digital yang modern dan responsif.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/register"
                  className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <span>Buat Aduan</span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link 
                  href="/login"
                  className="px-8 py-4 bg-white text-blue-600 rounded-2xl font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-colors duration-300"
                >
                  Cek Status Aduan
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl"
                  >
                    <div className="text-2xl font-bold text-blue-600">{stat.number}</div>
                    <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative z-10 bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20">
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Fitur Unggulan</h3>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-gray-700">Laporan Real-time</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-gray-700">Tracking Status</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-gray-700">Notifikasi Otomatis</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-gray-700">Dashboard Interaktif</span>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-200/50 rounded-full blur-xl"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-purple-200/50 rounded-full blur-xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800">Mengapa Pilih Kami?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Platform aduan PLN yang dirancang khusus untuk memberikan pengalaman terbaik
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800">Layanan Kami</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Beragam layanan digital untuk memenuhi kebutuhan listrik Anda
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="text-blue-600 mb-4">
                  {service.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">{service.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800">Testimoni Pelanggan</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Kepercayaan pelanggan adalah prioritas utama kami
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.comment}"</p>
                <div className="border-t pt-4">
                  <div className="font-semibold text-gray-800">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                  <div className="text-sm text-blue-600">{testimonial.location}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-4xl font-bold text-gray-800 mb-4">Hubungi Kami</h2>
                <p className="text-xl text-gray-600">
                  Butuh bantuan? Tim kami siap membantu Anda 24/7
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Telepon</div>
                    <div className="text-gray-600">0761-123456</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Email</div>
                    <div className="text-gray-600">info@plnselatpanjang.co.id</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Alamat</div>
                    <div className="text-gray-600">Jl. Diponegoro No. 123, Selatpanjang, Riau</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-8 shadow-xl"
            >
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nama</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Nama Anda"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pesan</label>
                  <textarea 
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                    placeholder="Tulis pesan Anda..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-colors duration-300"
                >
                  Kirim Pesan
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Zap className="w-6 h-6 text-blue-400" />
                <span className="text-lg font-bold">PLN ULP Selatpanjang</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Melayani kebutuhan listrik Anda dengan profesional dan terpercaya sejak 1995.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <Monitor className="w-5 h-5" />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Layanan</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white transition-colors">Aduan Gangguan</li>
                <li className="hover:text-white transition-colors">Tracking Status</li>
                <li className="hover:text-white transition-colors">Konsultasi Teknis</li>
                <li className="hover:text-white transition-colors">Layanan Darurat</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Bantuan</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white transition-colors">FAQ</li>
                <li className="hover:text-white transition-colors">Panduan</li>
                <li className="hover:text-white transition-colors">Kontak Support</li>
                <li className="hover:text-white transition-colors">Status Sistem</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Kontak</h3>
              <ul className="space-y-2 text-gray-400">
                <li>0761-123456</li>
                <li>info@plnselatpanjang.co.id</li>
                <li>Jl. Diponegoro No. 123</li>
                <li>Selatpanjang, Riau</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">&copy; 2024 PLN ULP Selatpanjang. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}