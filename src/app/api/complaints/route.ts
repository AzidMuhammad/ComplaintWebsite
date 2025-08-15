import { NextRequest, NextResponse } from 'next/server';
import { ComplaintModel } from '@/models/Complaint';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { title, description, category, priority, location, customerNumber, attachments } = body;

    if (!title || !description || !category || !priority || !location) {
      return NextResponse.json(
        { message: 'Semua field wajib harus diisi' },
        { status: 400 }
      );
    }

    const complaint = await ComplaintModel.create({
      userId: new ObjectId(payload.userId),
      title,
      description,
      category,
      priority,
      location,
      customerNumber: customerNumber || undefined,
      attachments: attachments || [],
      status: 'pending',
    });

    return NextResponse.json(complaint, { status: 201 });

  } catch (error) {
    console.error('Create complaint error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
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
    if (!payload) {
      return NextResponse.json(
        { message: 'Token tidak valid' },
        { status: 401 }
      );
    }

    let complaints;
    
    if (payload.role === 'admin') {
      complaints = await ComplaintModel.findAll();
    } else {
      complaints = await ComplaintModel.findByUserId(payload.userId);
    }

    return NextResponse.json(complaints);

  } catch (error) {
    console.error('Get complaints error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}