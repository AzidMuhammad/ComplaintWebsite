import { NextRequest, NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename) {
      return NextResponse.json(
        { message: 'Nama file tidak ditemukan' },
        { status: 400 }
      );
    }

    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return NextResponse.json(
        { message: 'Nama file tidak valid' },
        { status: 400 }
      );
    }

    const filePath = join(process.cwd(), 'public', 'uploads', filename);
    
    try {
      await unlink(filePath);
      return NextResponse.json({ 
        message: 'File berhasil dihapus',
        filename: filename 
      });
    } catch (error) {
      return NextResponse.json({ 
        message: 'File tidak ditemukan atau sudah dihapus',
        filename: filename 
      });
    }

  } catch (error) {
    console.error('File cleanup error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan saat menghapus file' },
      { status: 500 }
    );
  }
}