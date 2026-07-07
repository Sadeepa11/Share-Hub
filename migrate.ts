import fs from 'fs/promises';
import path from 'path';
import mongoose from 'mongoose';
import { UserModel, PostModel, DonationRequestModel, ReportModel } from './lib/models';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define the MONGODB_URI environment variable inside .env.local');
  process.exit(1);
}

const DATA_DIR = path.join(process.cwd(), 'data');

async function readJson(filename: string) {
  try {
    const filePath = path.join(DATA_DIR, filename);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function migrateData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI as string);
    console.log('Connected to MongoDB.');

    console.log('Clearing existing collections to avoid duplicates...');
    await UserModel.deleteMany({});
    await PostModel.deleteMany({});
    await DonationRequestModel.deleteMany({});
    await ReportModel.deleteMany({});

    // 1. Migrate Users
    const users = await readJson('users.json');
    if (users.length > 0) {
      console.log(`Migrating ${users.length} users...`);
      // Use map to change id -> _id to preserve their existing IDs
      const mappedUsers = users.map((u: any) => ({ ...u, _id: u.id }));
      await UserModel.insertMany(mappedUsers);
    }

    // 2. Migrate Posts
    const posts = await readJson('posts.json');
    if (posts.length > 0) {
      console.log(`Migrating ${posts.length} posts...`);
      const mappedPosts = posts.map((p: any) => ({ ...p, _id: p.id }));
      await PostModel.insertMany(mappedPosts);
    }

    // 3. Migrate Requests
    const requests = await readJson('requests.json');
    if (requests.length > 0) {
      console.log(`Migrating ${requests.length} requests...`);
      const mappedRequests = requests.map((r: any) => ({ ...r, _id: r.id }));
      await DonationRequestModel.insertMany(mappedRequests);
    }

    // 4. Migrate Reports
    const reports = await readJson('reports.json');
    if (reports.length > 0) {
      console.log(`Migrating ${reports.length} reports...`);
      const mappedReports = reports.map((r: any) => ({ ...r, _id: r.id }));
      await ReportModel.insertMany(mappedReports);
    }

    console.log('Data migration completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

migrateData();
