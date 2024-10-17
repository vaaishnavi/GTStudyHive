const express = require("express");
const Profile = require("../models/profileModel");
const router = express.Router();
const { createProfile, getProfile, updateProfilePicture } = require("../controllers/profileController.js");

// @route   POST /profile
// @desc    Create profile
// @access  Private

router.post("/", createProfile);

// @route   GET /profile/me
// @desc    Get profile
// @access  Private

router.get("/me", getProfile);

// @route   PATCH /profile/updateProfilePicture
// @desc    Update profile picture
// @access  Private

router.patch("/updateProfilePicture", updateProfilePicture);

module.exports = router;