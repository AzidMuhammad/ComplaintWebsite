export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

export interface Complaint {
  _id: string;
  user: User;
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

export interface DashboardStats {
  totalComplaints: number;
  pendingComplaints: number;
  resolvedComplaints: number;
  inProgressComplaints: number;
}