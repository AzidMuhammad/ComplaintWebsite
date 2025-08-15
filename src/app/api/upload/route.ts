import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import { FileUploadService } from '@/lib/fileUtils';

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Token tidak ditemukan' 
        },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Token tidak valid' 
        },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Tidak ada file yang dipilih' 
        },
        { status: 400 }
      );
    }

    if (files.length > 5) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Maksimal 5 file dapat diupload sekaligus' 
        },
        { status: 400 }
      );
    }

    const result = await FileUploadService.saveFiles(files);

    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 400 });
    }

  } catch (error) {
    console.error('Upload API error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        message: 'Terjadi kesalahan pada server saat mengupload file',
        error: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Unknown error' : undefined
      },
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

    return NextResponse.json({
      maxFileSize: '5MB',
      allowedTypes: ['JPG', 'PNG', 'GIF', 'WebP', 'PDF'],
      maxFiles: 5,
      uploadPath: '/uploads'
    });

  } catch (error) {
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}