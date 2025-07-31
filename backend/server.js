import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import postRoutes from './routes/post.routes.js';
import userRoutes from './routes/user.routes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(postRoutes);
app.use(userRoutes);

// // Serve static files from /uploads
// const __dirname = path.resolve();
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.static('uploads'));

const start = async () => {
  const connectDB = await mongoose.connect("mongodb+srv://anurag9120959628:hGUiZQHsVTA9o0gj@linkdinclone.igp4tq3.mongodb.net/?retryWrites=true&w=majority&appName=linkdinclone");
  console.log("✅ Connected to MongoDB");

  app.listen(9090, () => {
    console.log("🚀 Server is running on port 9090");
  });
};

start();

