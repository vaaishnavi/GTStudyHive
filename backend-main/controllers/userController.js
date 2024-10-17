const User = require("../models/userModel");
const auth = require("../firebaseConfig");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { body, validationResult } = require("express-validator");

// Generate token
// const jwt = require('jsonwebtoken');
// const secretKey = 'e4527d2c78c5d53232864c58e1e1c79f69077f36587160f09851ab5684c5d154aad30fcc39d693e70e19fa992c27812515605fd8a4c160ccfa0972a5bc82b28d';

//get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

// create account
const createUserValidation = [
  body("phoneNumber").isMobilePhone(),
  body("schoolEmail").isEmail(),
  body("password").isLength({ min: 8 }),
];

const createUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      password,
      schoolEmail,
      firstName,
      lastName,
      userName,
      phoneNumber,
    } = req.body;
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(
        schoolEmail,
        password
      );
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const firebaseUser = userCredential.user;

      const user = new User({
        uid: firebaseUser.uid,
        schoolEmail: firebaseUser.email,
        firstName: firstName,
        lastName: lastName,
        userName: userName,
        phoneNumber: phoneNumber,
        password: hashedPassword,
      });

      await user.save();
      res.status(200).json({ message: "User created successfully", user });
    } catch (error) {
      console.error("Error creating user:", error);
      if (error.code === "auth/email-already-in-use") {
        return res.status(400).send({ message: "Email already in use" });
      } else if (error.code === "auth/invalid-email") {
        return res.status(400).send({ message: "Invalid email" });
      } else {
        res.status(500).send({ message: "Internal server error" });
      }
    }
  };

// Login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const firebaseUser = userCredential.user;
    const user = await User.findOne({ uid: firebaseUser.uid });

    if (user) {
      // const token = jwt.sign({ userId: user._id }, secretKey);
      // res.status(200).json({ message: "User signed in successfully", token, user });
      res.status(200).json({ message: "User signed in successfully", user: {
        uid: user.uid,
        schoolEmail: user.schoolEmail,
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
        phoneNumber: user.phoneNumber,
      } });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error("Error signing in user:", error);
    res.status(400).send({ message: `User sign in failed: ${error.message}` });
  }
};

// Sign out
const signOut = async (req, res) => {
  try {
    await auth.signOut();
    res.status(200).json({ message: "User signed out successfully" });
  } catch (error) {
    console.error("Error signing out user:", error);
    res.status(400).send({ message: `User sign out failed: ${error.message}` });
  }
};

// Password reset
const resetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    await auth.sendPasswordResetEmail(email);
    res.status(200).json({ message: "Password reset email sent successfully" });
  } catch (error) {
    console.error("Error sending password reset email:", error);
    res.status(400).send({ message: `Password reset failed: ${error.message}` });
  }
};

module.exports = {
  getUsers,
  createUserValidation,
  createUser,
  login,
  signOut,
  resetPassword
};
