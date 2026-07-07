import connectToDatabase from './mongodb';
import { UserModel, PostModel, DonationRequestModel, ReportModel } from './models';

export type UserRole = 'user' | 'admin';
export type UserStatus = 'active' | 'blocked';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Hashed password
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

export type PostStatus = 'available' | 'unavailable';

export interface Post {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  quantity: number;
  imageUrl?: string;
  status: PostStatus;
  createdAt: string;
}

export type RequestStatus = 'Pending' | 'Confirmed' | 'Packing' | 'Shipping' | 'Delivered' | 'Rejected';

export interface DonationRequest {
  id: string;
  postId: string;
  requesterId: string;
  ownerId: string;
  quantityRequested: number;
  reason: string;
  mobileNumber: string;
  address: string;
  nic: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
}

export type ReportStatus = 'pending' | 'resolved';

export interface Report {
  id: string;
  reporterId: string;
  reportedUserId?: string;
  postId?: string;
  reason: string;
  description: string;
  status: ReportStatus;
  createdAt: string;
}

export const db = {
  users: {
    findMany: async () => {
      await connectToDatabase();
      const users = await UserModel.find();
      return users.map(u => u.toJSON()) as User[];
    },
    findById: async (id: string) => {
      await connectToDatabase();
      const user = await UserModel.findById(id);
      return user ? (user.toJSON() as User) : undefined;
    },
    findByEmail: async (email: string) => {
      await connectToDatabase();
      const user = await UserModel.findOne({ email });
      return user ? (user.toJSON() as User) : undefined;
    },
    create: async (data: Omit<User, 'id' | 'createdAt'>) => {
      await connectToDatabase();
      const newUser = await UserModel.create({
        ...data,
        createdAt: new Date().toISOString()
      });
      return newUser.toJSON() as User;
    },
    update: async (id: string, data: Partial<User>) => {
      await connectToDatabase();
      const updated = await UserModel.findByIdAndUpdate(id, data, { new: true });
      if (!updated) throw new Error('User not found');
      return updated.toJSON() as User;
    },
    delete: async (id: string) => {
      await connectToDatabase();
      await UserModel.findByIdAndDelete(id);
    }
  },
  posts: {
    findMany: async () => {
      await connectToDatabase();
      const posts = await PostModel.find();
      return posts.map(p => p.toJSON()) as Post[];
    },
    findById: async (id: string) => {
      await connectToDatabase();
      const post = await PostModel.findById(id);
      return post ? (post.toJSON() as Post) : undefined;
    },
    create: async (data: Omit<Post, 'id' | 'createdAt' | 'status'>) => {
      await connectToDatabase();
      const newPost = await PostModel.create({
        ...data,
        status: 'available',
        createdAt: new Date().toISOString()
      });
      return newPost.toJSON() as Post;
    },
    update: async (id: string, data: Partial<Post>) => {
      await connectToDatabase();
      const updated = await PostModel.findByIdAndUpdate(id, data, { new: true });
      if (!updated) throw new Error('Post not found');
      return updated.toJSON() as Post;
    },
    delete: async (id: string) => {
      await connectToDatabase();
      await PostModel.findByIdAndDelete(id);
    }
  },
  requests: {
    findMany: async () => {
      await connectToDatabase();
      const requests = await DonationRequestModel.find();
      return requests.map(r => r.toJSON()) as DonationRequest[];
    },
    findById: async (id: string) => {
      await connectToDatabase();
      const request = await DonationRequestModel.findById(id);
      return request ? (request.toJSON() as DonationRequest) : undefined;
    },
    create: async (data: Omit<DonationRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
      await connectToDatabase();
      const newRequest = await DonationRequestModel.create({
        ...data,
        status: 'Pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return newRequest.toJSON() as DonationRequest;
    },
    update: async (id: string, data: Partial<DonationRequest>) => {
      await connectToDatabase();
      const updated = await DonationRequestModel.findByIdAndUpdate(
        id, 
        { ...data, updatedAt: new Date().toISOString() }, 
        { new: true }
      );
      if (!updated) throw new Error('Request not found');
      return updated.toJSON() as DonationRequest;
    },
    delete: async (id: string) => {
      await connectToDatabase();
      await DonationRequestModel.findByIdAndDelete(id);
    }
  },
  reports: {
    findMany: async () => {
      await connectToDatabase();
      const reports = await ReportModel.find();
      return reports.map(r => r.toJSON()) as Report[];
    },
    findById: async (id: string) => {
      await connectToDatabase();
      const report = await ReportModel.findById(id);
      return report ? (report.toJSON() as Report) : undefined;
    },
    create: async (data: Omit<Report, 'id' | 'createdAt' | 'status'>) => {
      await connectToDatabase();
      const newReport = await ReportModel.create({
        ...data,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      return newReport.toJSON() as Report;
    },
    update: async (id: string, data: Partial<Report>) => {
      await connectToDatabase();
      const updated = await ReportModel.findByIdAndUpdate(id, data, { new: true });
      if (!updated) throw new Error('Report not found');
      return updated.toJSON() as Report;
    }
  }
};
