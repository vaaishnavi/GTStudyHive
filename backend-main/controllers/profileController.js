const Profile = require("../models/profileModel");

// create profile
const createProfile = async (req, res) => {
  const { schoolEmail, firstName, lastName, userName, phoneNumber } = req.body;

  try {
    if (!schoolEmail || !firstName || !lastName || !userName || !phoneNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const profile = await Profile.create({
      schoolEmail,
      firstName,
      lastName,
      userName,
      phoneNumber,
    });
    res.status(201).json(profile);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating profile", error: error.message });
  }
};

// get profile
const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["firstName", "lastName", "email", "profilePicture"]
    );

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ message: "Error fetching user profile", error: error.message });
  }
};

const updateProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await user.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.profilePicture = req.file.path;
    await user.save();

    res.json({ message: "Profile picture updated successfully" });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({
      message: "Error updating profile picture",
      error: error.message,
    });
  }
};

module.exports = {
  createProfile,
  getProfile,
  updateProfilePicture,
};
