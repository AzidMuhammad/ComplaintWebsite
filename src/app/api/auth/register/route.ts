import { NextRequest, NextResponse } from 'next/server';
import { UserModel } from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, password } = body;

    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { message: 'Semua field harus diisi' },
        { status: 400 }
      );
    }

    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { message: 'Email sudah terdaftar' },
        { status: 400 }
      );
    }

    const user = await UserModel.create({
      name,
      email,
      phone,
      password,
      role: 'admin',
    });

    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { 
        message: 'Registrasi berhasil',
        user: userWithoutPassword
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}