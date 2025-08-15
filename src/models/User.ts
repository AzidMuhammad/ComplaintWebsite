import { ObjectId } from 'mongodb';
import { getDatabase } from '../lib/mongodb';
import bcrypt from 'bcryptjs';

export interface IUser {
  _id?: ObjectId;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

export class UserModel {
  static async create(userData: Omit<IUser, '_id' | 'createdAt'>): Promise<IUser> {
    const db = await getDatabase();
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    
    const user = {
      ...userData,
      password: hashedPassword,
      createdAt: new Date(),
    };

    const result = await db.collection('users').insertOne(user);
    return { ...user, _id: result.insertedId };
  }

  static async findByEmail(email: string): Promise<IUser | null> {
    const db = await getDatabase();
    return await db.collection<IUser>('users').findOne({ email });
  }

  static async findById(id: string): Promise<IUser | null> {
    const db = await getDatabase();
    return await db.collection<IUser>('users').findOne({ _id: new ObjectId(id) });
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}