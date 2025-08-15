import { NextRequest, NextResponse } from 'next/server';
import { ComplaintModel } from '@/models/Complaint';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

interface Params {
  id: string;
}

export async function GET(request: NextRequest, { params }: { params: Params }) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json(
        { message: 'Token tidak ditemukan' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { message: 'Token tidak valid' },
        { status: 401 }
      );
    }

    const complaint = await ComplaintModel.findById(params.id);
    if (!complaint) {
      return NextResponse.json(
        { message: 'Aduan tidak ditemukan' },
        { status: 404 }
      );
    }

    if (payload.role !== 'admin' && complaint.userId.toString() !== payload.userId) {
      return NextResponse.json(
        { message: 'Akses ditolak' },
        { status: 403 }
      );
    }

    return NextResponse.json(complaint);

  } catch (error) {
    console.error('Get complaint error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: Params }) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json(
        { message: 'Token tidak ditemukan' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json(
        { message: 'Akses ditolak' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { status, adminNotes } = body;

    const success = await ComplaintModel.updateStatus(params.id, status, adminNotes);
    
    if (!success) {
      return NextResponse.json(
        { message: 'Gagal memperbarui status' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Status berhasil diperbarui' });

  } catch (error) {
    console.error('Update complaint error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}