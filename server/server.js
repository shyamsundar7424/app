import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import bcrypt from 'bcrypt';
import User from './Schema/User.js';
import { nanoid } from 'nanoid';

const server = express();
const PORT = process.env.PORT || 5000;

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

// Middleware to parse JSON data
server.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.DB_LOCATION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

const formatDataSend = (user) => {
  return {
    profile_img: user.personal_info.profile_img,
    username: user.personal_info.username,
    fullname: user.personal_info.fullname,
  };
};

// Generate username
const generateUsername = async (email) => {
  let username = email.split('@')[0];
  const isUsernameNotUnique = await User.exists({ "personal_info.username": username });

  if (isUsernameNotUnique) {
    username += Math.floor(Math.random() * 1000); // Append a random number to make the username unique
  }

  return username;
};

// Signup route
server.post("/signup", async (req, res) => {
  const { fullname, email, password } = req.body;

  // Validate the data from frontend
  if (fullname.length < 3) {
    return res.status(403).json({ "error": "Fullname must be at least 3 letters long" });
  }
  if (!email || !emailRegex.test(email)) {
    return res.status(403).json({ "error": "Enter a valid Email" });
  }
  if (!passwordRegex.test(password)) {
    return res.status(403).json({ "error": "Password must be 6 to 20 characters long and must contain at least one numeric digit, one uppercase and one lowercase letter" });
  }

  try {
    // Hashing the password
    const hashed_password = await bcrypt.hash(password, 10);
    const username = await generateUsername(email);

    // Creating a new user
    const user = new User({
      personal_info: {
        fullname,
        email,
        username,
        password: hashed_password,
      },
    });

    // Saving the user to the database
    const savedUser = await user.save();
    return res.status(200).json(formatDataSend(savedUser));
  } catch (error) {
    if (error.code === 11000) {
      return res.status(403).json({ "error": "Email already exists" });
    }
    console.log("Error -> ", error);
    return res.status(500).json({ "error": "Internal Server Error" });
  }
});

// Signin route
server.post("/signin", (req, res) => {
  const { email, password } = req.body;

  // Validate the data from frontend
  if (!email || !password) {
    return res.status(403).json({ "error": "Email and password are required" });
  }

  return res.status(200).json({ "Status": "Success" });
});

// Listen on the specified port
server.listen(PORT, () => {
  console.log('Listening on port -> ' + PORT);
});