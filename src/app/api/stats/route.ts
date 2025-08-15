import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import { ComplaintModel } from '@/models/Complaint';
import { UserModel } from '@/models/User';
import { getDatabase } from '@/lib/mongodb';

interface Activity {
  type: 'new' | 'update' | 'resolved' | 'user';
  message: string;
  time: string;
}

interface ComplaintData {
  status: string;
  subject?: string;
  title?: string;  
  createdAt: Date;
  updatedAt: Date;
  user: { name: string }[];
}

interface UserData {
  name: string;
  createdAt: Date;
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
    
    const complaintStats = await db.collection('complaints').aggregate([
      {
        $group: {
          _id: null,
          totalComplaints: { $sum: 1 },
          pendingComplaints: { 
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } 
          },
          inProgressComplaints: { 
            $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] } 
          },
          resolvedComplaints: { 
            $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } 
          },
          rejectedComplaints: { 
            $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } 
          }
        }
      }
    ]).toArray();

    const currentDate = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(currentDate.getMonth() - 6);
    
    const monthlyStats = await db.collection('complaints').aggregate([
      {
        $match: {
          createdAt: { 
            $gte: sixMonthsAgo,
            $lte: currentDate
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          totalComplaints: { $sum: 1 },
          resolvedComplaints: { 
            $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } 
          }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]).toArray();

    const userCount = await db.collection('users').countDocuments();

    const stats = complaintStats[0] || {
      totalComplaints: 0,
      pendingComplaints: 0,
      inProgressComplaints: 0,
      resolvedComplaints: 0,
      rejectedComplaints: 0
    };

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Des'];
    const chartData = [];
    
    for (let i = 5; i >= 0; i--) {
      const targetDate = new Date();
      targetDate.setMonth(currentDate.getMonth() - i);
      
      const year = targetDate.getFullYear();
      const month = targetDate.getMonth() + 1;
      
      const monthData = monthlyStats.find(item => 
        item._id.year === year && item._id.month === month
      );
      
      chartData.push({
        name: monthNames[month - 1],
        complaints: monthData ? monthData.totalComplaints : 0,
        resolved: monthData ? monthData.resolvedComplaints : 0
      });
    }

    const recentComplaints = await db.collection('complaints').aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $sort: { updatedAt: -1 }
      },
      {
        $limit: 10
      },
      {
        $project: {
          status: 1,
          subject: 1,
          title: 1,
          createdAt: 1,
          updatedAt: 1,
          'user.name': 1
        }
      }
    ]).toArray();

    console.log('Sample complaint data:', JSON.stringify(recentComplaints[0], null, 2));

    const recentUsers = await db.collection('users').find(
      { role: 'user' },
      { 
        sort: { createdAt: -1 },
        limit: 5,
        projection: { name: 1, createdAt: 1 }
      }
    ).toArray();

    const recentActivities: Activity[] = [];
    
    recentComplaints.forEach(complaint => {
      const complaintData = complaint as any;
      const currentTime = new Date().getTime();
      const updatedTime = new Date(complaintData.updatedAt || complaintData.createdAt).getTime();
      const timeDiff = currentTime - updatedTime;
      const timeAgo = formatTimeAgo(timeDiff);
      
      const complaintTitle = complaintData.subject || complaintData.title || 'Aduan Tanpa Judul';
      
      if (complaintData.status === 'resolved') {
        recentActivities.push({
          type: 'resolved',
          message: `Aduan "${complaintTitle}" telah diselesaikan`,
          time: timeAgo
        });
      } else if (complaintData.status === 'in_progress') {
        recentActivities.push({
          type: 'update',
          message: `Status aduan "${complaintTitle}" diperbarui ke "Sedang Diproses"`,
          time: timeAgo
        });
      } else if (complaintData.status === 'pending') {
        recentActivities.push({
          type: 'new',
          message: `Aduan baru diterima - ${complaintTitle}`,
          time: timeAgo
        });
      }
    });

    recentUsers.forEach(user => {
      const userName = (user as any).name || 'Unknown User';
      const userCreatedAt = (user as any).createdAt || new Date();
      
      const currentTime = new Date().getTime();
      const createdTime = new Date(userCreatedAt).getTime();
      const timeDiff = currentTime - createdTime;
      const timeAgo = formatTimeAgo(timeDiff);
      
      recentActivities.push({
        type: 'user',
        message: `Pengguna baru terdaftar: ${userName}`,
        time: timeAgo
      });
    });

    recentActivities.sort((a, b) => {
      const getMinutes = (timeStr: string): number => {
        if (timeStr.includes('menit')) return parseInt(timeStr);
        if (timeStr.includes('jam')) return parseInt(timeStr) * 60;
        if (timeStr.includes('hari')) return parseInt(timeStr) * 1440;
        return 0;
      };
      return getMinutes(a.time) - getMinutes(b.time);
    });

    return NextResponse.json({
      ...stats,
      totalUsers: userCount,
      chartData: chartData,
      recentActivities: recentActivities.slice(0, 8)
    });

  } catch (error) {
    console.error('Get stats error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}

function formatTimeAgo(timeDiff: number): string {
  const minutes = Math.floor(timeDiff / (1000 * 60));
  const hours = Math.floor(timeDiff / (1000 * 60 * 60));
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  if (days > 0) {
    return `${days} hari lalu`;
  } else if (hours > 0) {
    return `${hours} jam lalu`;
  } else if (minutes > 0) {
    return `${minutes} menit lalu`;
  } else {
    return 'Baru saja';
  }
}