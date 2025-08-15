import { ObjectId } from 'mongodb';
import { getDatabase } from '../lib/mongodb';

export interface IComplaint {
  _id?: ObjectId;
  userId: ObjectId;
  title: string;
  description: string;
  category: 'listrik_padam' | 'tagihan' | 'instalasi' | 'lainnya';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
  attachments?: string[];
  location: string;
  customerNumber?: string;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IComplaintWithUser extends IComplaint {
  user?: {
    _id: ObjectId;
    name: string;
    email: string;
  };
}

export class ComplaintModel {
  static async create(complaintData: Omit<IComplaint, '_id' | 'createdAt' | 'updatedAt'>): Promise<IComplaint> {
    const db = await getDatabase();
    
    const complaint = {
      ...complaintData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('complaints').insertOne(complaint);
    return { ...complaint, _id: result.insertedId };
  }

  static async findById(id: string): Promise<IComplaint | null> {
    const db = await getDatabase();
    return await db.collection<IComplaint>('complaints').findOne({ _id: new ObjectId(id) });
  }

  static async findByUserId(userId: string): Promise<IComplaint[]> {
    const db = await getDatabase();
    return await db.collection<IComplaint>('complaints')
      .find({ userId: new ObjectId(userId) })
      .sort({ createdAt: -1 })
      .toArray();
  }

  static async findAll(): Promise<IComplaintWithUser[]> {
    const db = await getDatabase();
    return await db.collection<IComplaint>('complaints')
      .aggregate<IComplaintWithUser>([
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        { $sort: { createdAt: -1 } }
      ])
      .toArray();
  }

  static async findAllBasic(): Promise<IComplaint[]> {
    const db = await getDatabase();
    return await db.collection<IComplaint>('complaints')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
  }

  static async updateStatus(id: string, status: IComplaint['status'], adminNotes?: string): Promise<boolean> {
    const db = await getDatabase();
    const updateData: any = {
      status,
      updatedAt: new Date(),
    };
    
    if (adminNotes) {
      updateData.adminNotes = adminNotes;
    }

    const result = await db.collection('complaints').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    return result.modifiedCount > 0;
  }

  static async getStats(): Promise<any> {
    const db = await getDatabase();
    return await db.collection('complaints').aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] } },
          resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
          rejected: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } }
        }
      }
    ]).toArray();
  }
}