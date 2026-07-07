import mongoose, { Schema } from 'mongoose';

// Ensure we don't recreate the models upon hot reloads
const models = mongoose.models;

// --- Helper for id mapping ---
// Mongoose natively uses _id. This transform ensures that when we convert
// the document to JSON or an Object, it has `id` instead of `_id`.
const transformOptions = {
  virtuals: true,
  versionKey: false,
  transform: (doc: any, ret: any) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  }
};

// ==========================================
// User Schema
// ==========================================
const userSchema = new Schema({
  _id: { type: String, default: () => crypto.randomUUID() },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // Hashed password
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  status: { type: String, enum: ['active', 'blocked'], default: 'active' },
  createdAt: { type: String, required: true }
}, {
  toJSON: transformOptions,
  toObject: transformOptions
});

export const UserModel = models.User || mongoose.model('User', userSchema);


// ==========================================
// Post Schema
// ==========================================
const postSchema = new Schema({
  _id: { type: String, default: () => crypto.randomUUID() },
  userId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  imageUrl: { type: String, required: false },
  status: { type: String, enum: ['available', 'unavailable'], default: 'available' },
  createdAt: { type: String, required: true }
}, {
  toJSON: transformOptions,
  toObject: transformOptions
});

export const PostModel = models.Post || mongoose.model('Post', postSchema);


// ==========================================
// DonationRequest Schema
// ==========================================
const donationRequestSchema = new Schema({
  _id: { type: String, default: () => crypto.randomUUID() },
  postId: { type: String, required: true },
  requesterId: { type: String, required: true },
  ownerId: { type: String, required: true },
  quantityRequested: { type: Number, required: true },
  reason: { type: String, required: true },
  mobileNumber: { type: String, required: false },
  address: { type: String, required: false },
  nic: { type: String, required: false },
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Packing', 'Shipping', 'Delivered', 'Rejected'], 
    default: 'Pending' 
  },
  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true }
}, {
  toJSON: transformOptions,
  toObject: transformOptions
});

export const DonationRequestModel = models.DonationRequest || mongoose.model('DonationRequest', donationRequestSchema);


// ==========================================
// Report Schema
// ==========================================
const reportSchema = new Schema({
  _id: { type: String, default: () => crypto.randomUUID() },
  reporterId: { type: String, required: true },
  reportedUserId: { type: String, required: false },
  postId: { type: String, required: false },
  reason: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['pending', 'resolved'], default: 'pending' },
  createdAt: { type: String, required: true }
}, {
  toJSON: transformOptions,
  toObject: transformOptions
});

export const ReportModel = models.Report || mongoose.model('Report', reportSchema);
