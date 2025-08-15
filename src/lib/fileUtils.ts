import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export interface UploadResult {
  success: boolean;
  message: string;
  files?: UploadedFileInfo[];
  error?: string;
}

export interface UploadedFileInfo {
  originalName: string;
  filename: string;
  size: number;
  type: string;
  url: string;
}

export class FileUploadService {
  private static readonly UPLOAD_DIR = join(process.cwd(), 'public', 'uploads');
  private static readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  private static readonly ALLOWED_TYPES = [
    'image/jpeg',
    'image/png', 
    'image/jpg',
    'image/gif',
    'image/webp',
    'application/pdf'
  ];

  static async ensureUploadDir(): Promise<void> {
    if (!existsSync(this.UPLOAD_DIR)) {
      await mkdir(this.UPLOAD_DIR, { recursive: true });
    }
  }

  static validateFile(file: File): { valid: boolean; message?: string } {
    if (file.size > this.MAX_FILE_SIZE) {
      return {
        valid: false,
        message: `File ${file.name} terlalu besar. Maksimal 5MB per file.`
      };
    }

    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return {
        valid: false,
        message: `Format file ${file.name} tidak didukung. Hanya JPG, PNG, GIF, WebP, dan PDF yang diperbolehkan.`
      };
    }

    if (file.name.length > 100) {
      return {
        valid: false,
        message: `Nama file ${file.name} terlalu panjang. Maksimal 100 karakter.`
      };
    }

    return { valid: true };
  }

  static generateUniqueFilename(originalName: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = originalName.split('.').pop() || '';
    const safeName = originalName
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .substring(0, 50);
    
    return `${timestamp}-${randomString}-${safeName}`;
  }

  static async saveFile(file: File): Promise<UploadedFileInfo> {
    await this.ensureUploadDir();
    
    const validation = this.validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    const filename = this.generateUniqueFilename(file.name);
    const filePath = join(this.UPLOAD_DIR, filename);
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    await writeFile(filePath, buffer);

    return {
      originalName: file.name,
      filename: filename,
      size: file.size,
      type: file.type,
      url: `/uploads/${filename}`
    };
  }

  static async saveFiles(files: File[]): Promise<UploadResult> {
    try {
      if (!files || files.length === 0) {
        return {
          success: false,
          message: 'Tidak ada file yang dipilih'
        };
      }

      for (const file of files) {
        const validation = this.validateFile(file);
        if (!validation.valid) {
          return {
            success: false,
            message: validation.message!
          };
        }
      }

      // Save all files
      const uploadedFiles: UploadedFileInfo[] = [];
      for (const file of files) {
        const fileInfo = await this.saveFile(file);
        uploadedFiles.push(fileInfo);
      }

      return {
        success: true,
        message: `${uploadedFiles.length} file berhasil diupload`,
        files: uploadedFiles
      };

    } catch (error) {
      console.error('File upload error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Terjadi kesalahan saat mengupload file',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  static getFileIcon(mimeType: string): string {
    if (mimeType.startsWith('image/')) {
      return '🖼️';
    } else if (mimeType === 'application/pdf') {
      return '📄';
    } else {
      return '📁';
    }
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  static isImageFile(filename: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'));
    return imageExtensions.includes(ext);
  }

  static isPDFFile(filename: string): boolean {
    return filename.toLowerCase().endsWith('.pdf');
  }

  static getFileType(mimeType: string): 'image' | 'pdf' | 'other' {
    if (mimeType.startsWith('image/')) {
      return 'image';
    } else if (mimeType === 'application/pdf') {
      return 'pdf';
    } else {
      return 'other';
    }
  }
}