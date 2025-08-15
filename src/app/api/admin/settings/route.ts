import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

interface SystemSettings {
  type: string;
  siteName: string;
  siteDescription: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  maxFileSize: number;
  autoAssignComplaints: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface NotificationSettings {
  type: string;
  userId: ObjectId;
  emailNotifications: boolean;
  pushNotifications: boolean;
  complaintReminders: boolean;
  dailyReports: boolean;
  weeklyReports: boolean;
  createdAt: Date;
  updatedAt: Date;
}

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
    
    let systemSettings = await db.collection('settings').findOne({ type: 'system' });
    if (!systemSettings) {
      const defaultSystemSettings: Omit<SystemSettings, '_id'> = {
        type: 'system',
        siteName: 'PLN ULP Selatpanjang',
        siteDescription: 'Sistem Pengelolaan Aduan PLN ULP Selatpanjang',
        maintenanceMode: false,
        allowRegistration: true,
        maxFileSize: 5,
        autoAssignComplaints: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const result = await db.collection('settings').insertOne(defaultSystemSettings);
      systemSettings = { ...defaultSystemSettings, _id: result.insertedId };
    }

    let notificationSettings = await db.collection('settings').findOne({ 
      type: 'notifications', 
      userId: new ObjectId(payload.userId) 
    });
    if (!notificationSettings) {
      const defaultNotificationSettings: Omit<NotificationSettings, '_id'> = {
        type: 'notifications',
        userId: new ObjectId(payload.userId),
        emailNotifications: true,
        pushNotifications: true,
        complaintReminders: true,
        dailyReports: false,
        weeklyReports: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const result = await db.collection('settings').insertOne(defaultNotificationSettings);
      notificationSettings = { ...defaultNotificationSettings, _id: result.insertedId };
    }

    return NextResponse.json({
      system: systemSettings,
      notifications: notificationSettings
    });

  } catch (error) {
    console.error('Get settings error:', error);
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
    const { type, ...settings } = body;

    const db = await getDatabase();

    if (type === 'system') {
      const updateData = {
        ...settings,
        type: 'system',
        updatedAt: new Date()
      };

      await db.collection('settings').updateOne(
        { type: 'system' },
        { $set: updateData },
        { upsert: true }
      );
    } else if (type === 'notifications') {
      const updateData = {
        ...settings,
        type: 'notifications',
        userId: new ObjectId(payload.userId),
        updatedAt: new Date()
      };

      await db.collection('settings').updateOne(
        { type: 'notifications', userId: new ObjectId(payload.userId) },
        { $set: updateData },
        { upsert: true }
      );
    } else {
      return NextResponse.json(
        { message: 'Tipe pengaturan tidak valid' },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: 'Pengaturan berhasil disimpan' });

  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}