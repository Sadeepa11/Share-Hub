import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

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

async function readJson<T>(filename: string): Promise<T[]> {
  try {
    const filePath = path.join(DATA_DIR, filename);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data) as T[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function writeJson<T>(filename: string, data: T[]): Promise<void> {
  const filePath = path.join(DATA_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export const db = {
  users: {
    findMany: () => readJson<User>('users.json'),
    findById: async (id: string) => {
      const users = await readJson<User>('users.json');
      return users.find(u => u.id === id);
    },
    findByEmail: async (email: string) => {
      const users = await readJson<User>('users.json');
      return users.find(u => u.email === email);
    },
    create: async (data: Omit<User, 'id' | 'createdAt'>) => {
      const users = await readJson<User>('users.json');
      const newUser: User = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      users.push(newUser);
      await writeJson('users.json', users);
      return newUser;
    },
    update: async (id: string, data: Partial<User>) => {
      const users = await readJson<User>('users.json');
      const index = users.findIndex(u => u.id === id);
      if (index === -1) throw new Error('User not found');
      users[index] = { ...users[index], ...data };
      await writeJson('users.json', users);
      return users[index];
    },
    delete: async (id: string) => {
      const users = await readJson<User>('users.json');
      const filtered = users.filter(u => u.id !== id);
      await writeJson('users.json', filtered);
    }
  },
  posts: {
    findMany: () => readJson<Post>('posts.json'),
    findById: async (id: string) => {
      const posts = await readJson<Post>('posts.json');
      return posts.find(p => p.id === id);
    },
    create: async (data: Omit<Post, 'id' | 'createdAt' | 'status'>) => {
      const posts = await readJson<Post>('posts.json');
      const newPost: Post = {
        ...data,
        id: crypto.randomUUID(),
        status: 'available',
        createdAt: new Date().toISOString(),
      };
      posts.push(newPost);
      await writeJson('posts.json', posts);
      return newPost;
    },
    update: async (id: string, data: Partial<Post>) => {
      const posts = await readJson<Post>('posts.json');
      const index = posts.findIndex(p => p.id === id);
      if (index === -1) throw new Error('Post not found');
      posts[index] = { ...posts[index], ...data };
      await writeJson('posts.json', posts);
      return posts[index];
    },
    delete: async (id: string) => {
      const posts = await readJson<Post>('posts.json');
      const filtered = posts.filter(p => p.id !== id);
      await writeJson('posts.json', filtered);
    }
  },
  requests: {
    findMany: () => readJson<DonationRequest>('requests.json'),
    findById: async (id: string) => {
      const requests = await readJson<DonationRequest>('requests.json');
      return requests.find(r => r.id === id);
    },
    create: async (data: Omit<DonationRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
      const requests = await readJson<DonationRequest>('requests.json');
      const newRequest: DonationRequest = {
        ...data,
        id: crypto.randomUUID(),
        status: 'Pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      requests.push(newRequest);
      await writeJson('requests.json', requests);
      return newRequest;
    },
    update: async (id: string, data: Partial<DonationRequest>) => {
      const requests = await readJson<DonationRequest>('requests.json');
      const index = requests.findIndex(r => r.id === id);
      if (index === -1) throw new Error('Request not found');
      requests[index] = { ...requests[index], ...data, updatedAt: new Date().toISOString() };
      await writeJson('requests.json', requests);
      return requests[index];
    },
    delete: async (id: string) => {
      const requests = await readJson<DonationRequest>('requests.json');
      const filtered = requests.filter(r => r.id !== id);
      await writeJson('requests.json', filtered);
    }
  },
  reports: {
    findMany: () => readJson<Report>('reports.json'),
    findById: async (id: string) => {
      const reports = await readJson<Report>('reports.json');
      return reports.find(r => r.id === id);
    },
    create: async (data: Omit<Report, 'id' | 'createdAt' | 'status'>) => {
      const reports = await readJson<Report>('reports.json');
      const newReport: Report = {
        ...data,
        id: crypto.randomUUID(),
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      reports.push(newReport);
      await writeJson('reports.json', reports);
      return newReport;
    },
    update: async (id: string, data: Partial<Report>) => {
      const reports = await readJson<Report>('reports.json');
      const index = reports.findIndex(r => r.id === id);
      if (index === -1) throw new Error('Report not found');
      reports[index] = { ...reports[index], ...data };
      await writeJson('reports.json', reports);
      return reports[index];
    }
  }
};
