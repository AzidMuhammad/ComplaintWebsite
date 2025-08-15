import Link from 'next/link';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">PLN</span>
              </div>
              <span className="text-xl font-bold">ULP SELATPANJANG</span>
            </div>
            <p className="text-gray-400 mb-4">
              Sistem Aduan Digital PLN ULP Selatpanjang untuk melayani keluhan dan permintaan bantuan pelanggan dengan lebih efisien dan transparan.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Kontak</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <MapPin size={16} className="text-blue-400" />
                <span className="text-sm text-gray-400">Selatpanjang, Kepulauan Meranti</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={16} className="text-blue-400" />
                <span className="text-sm text-gray-400">(0768) 123456</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail size={16} className="text-blue-400" />
                <span className="text-sm text-gray-400">info@plnselatpanjang.co.id</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Jam Operasional</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Clock size={16} className="text-blue-400" />
                <span className="text-sm text-gray-400">Senin - Jumat: 08:00 - 16:00</span>
              </div>
              <div className="text-sm text-gray-400 ml-6">
                Sabtu: 08:00 - 12:00
              </div>
              <div className="text-sm text-gray-400 ml-6">
                Minggu: Tutup
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 PLN ULP Selatpanjang. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}