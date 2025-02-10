import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from './Schema/User.js';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import admin from "firebase-admin";
import fs from 'fs';
import { getAuth } from "firebase-admin/auth";

//  Load environment variables
dotenv.config();

const server = express();
const PORT = 5000;

// ✅ Fix: Import JSON file correctly
const serviceAccountKey = JSON.parse(fs.readFileSync("./blogging-app-4c3ec-firebase-adminsdk-fbsvc-f3fc3ee1e7.json", "utf8"));

// ✅ Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
  databaseURL: "https://blogging-app-4c3ec.firebaseio.com"
});

// ✅ Email & Password Validation Regex
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

// ✅ Middleware
server.use(express.json());
{/*server.use(cors()); */}
server.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

// ✅ Connect to MongoDB
mongoose.connect(process.env.DB_LOCATION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true,
}).then(() => {
  console.log('✅ Connected to MongoDB');
}).catch((error) => {
  console.error('❌ MongoDB Connection Error:', error);
});

// ✅ Format User Data
const formatDataSend = (user) => {
  const access_token = jwt.sign({ id: user._id }, process.env.SECRET_ACCESS_KEY);
  return {
    access_token,
    profile_img: user.personal_info.profile_img,
    username: user.personal_info.username,
    fullname: user.personal_info.fullname,
  };
};

// ✅ Generate Unique Username
const generateUsername = async (email) => {
  let username = email.split('@')[0];
  const isUsernameNotUnique = await User.exists({ "personal_info.username": username });

  if (isUsernameNotUnique) {
    username += Math.floor(Math.random() * 1000);
  }

  return username;
};

// ✅ Signup Route
server.post("/signup", async (req, res) => {
  const { fullname, email, password } = req.body;

  if (fullname.length < 3) {
    return res.status(403).json({ error: "Fullname must be at least 3 letters long" });
  }
  if (!email || !emailRegex.test(email)) {
    return res.status(403).json({ error: "Enter a valid Email" });
  }
  if (!passwordRegex.test(password)) {
    return res.status(403).json({ error: "Password must be 6 to 20 characters long and contain at least one number, one uppercase, and one lowercase letter" });
  }

  try {
    const hashed_password = await bcrypt.hash(password, 10);
    const username = await generateUsername(email);

    const user = new User({
      personal_info: {
        fullname,
        email,
        username,
        password: hashed_password,
      },
    });

    const savedUser = await user.save();
    return res.status(200).json(formatDataSend(savedUser));
  } catch (error) {
    if (error.code === 11000) {
      return res.status(403).json({ error: "Email already exists" });
    }
    console.error("❌ Signup Error ->", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Signin Route
server.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(403).json({ error: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ "personal_info.email": email });

    if (!user) {
      return res.status(403).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.personal_info.password);

    if (!isPasswordValid) {
      return res.status(403).json({ error: "Incorrect password" });
    }

    return res.status(200).json(formatDataSend(user));
  }
   catch (error) {
    console.error("❌ Signin Error ->", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Google Authentication Route
server.post("/google-auth", async (req, res) => {
  try {
    const { access_token } = req.body;

    // Verify Firebase ID token
    const decodedUser = await admin.auth().verifyIdToken(access_token);
    
    let { email, name, picture } = decodedUser;
    picture = picture?.replace("s96-c", "s384-c") || ""; // Handle missing picture

    // Check for existing user
    const user = await User.findOne({ "personal_info.email": email })
      .select("personal_info.fullname personal_info.username personal_info.profile_img google_auth");

    if (user) {
      if (!user.google_auth) {
        return res.status(403).json({
          error: "This email was registered with password login. Use password instead."
        });
      }
    } else {
      // Create new user
      const username = await generateUsername(email);
      const newUser = new User({
        personal_info: {
          fullname: name,
          email,
          username
        },
        google_auth: true
      });

      await newUser.save();
      user = newUser;
    }

    // Return formatted user data
    return res.status(200).json(formatDataSend(user));

  } catch (err) {
    console.error('❌ Google Auth Error:', err.message);

    // Specific error handling
    if (err.code === 'auth/id-token-expired') {
      return res.status(401).json({ error: "Session expired. Please login again." });
    }

    return res.status(403).json({
      error: "Failed to authenticate with Google. Try another account."
    });
  }
});

// ✅ Start the Server
server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
