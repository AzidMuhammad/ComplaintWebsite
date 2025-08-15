import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest) {
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

    const db = await getDatabase();
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(payload.userId) },
      { projection: { password: 0 } }
    );

    if (!user) {
      return NextResponse.json(
        { message: 'Pengguna tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role,
      createdAt: user.createdAt
    });

  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
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
    const { name, email, phone, currentPassword, newPassword } = body;

    if (!name || !email) {
      return NextResponse.json(
        { message: 'Nama dan email harus diisi' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const user = await db.collection('users').findOne({ _id: new ObjectId(payload.userId) });

    if (!user) {
      return NextResponse.json(
        { message: 'Pengguna tidak ditemukan' },
        { status: 404 }
      );
    }

    const existingUser = await db.collection('users').findOne({
      email,
      _id: { $ne: new ObjectId(payload.userId) }
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Email sudah digunakan oleh pengguna lain' },
        { status: 400 }
      );
    }

    const updateData: any = {
      name,
      email,
      phone: phone || '',
      updatedAt: new Date()
    };

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { message: 'Password saat ini harus diisi' },
          { status: 400 }
        );
      }

      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        return NextResponse.json(
          { message: 'Password saat ini tidak benar' },
          { status: 400 }
        );
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 12);
      updateData.password = hashedNewPassword;
    }

    await db.collection('users').updateOne(
      { _id: new ObjectId(payload.userId) },
      { $set: updateData }
    );

    return NextResponse.json({ message: 'Profil berhasil diperbarui' });

  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}