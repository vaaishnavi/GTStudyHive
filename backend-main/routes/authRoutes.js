const express = require("express");
const router = express.Router();
const FriendRequest = require('../models/FriendRequest');

const { getUsers, createUserValidation, createUser, login, signOut, resetPassword } = require("../controllers/userController.js");


// @route GET /api/auth/getUsers
// @desc Get all users
// @access Public
router.get("/getUsers", getUsers);

// @route POST /api/auth/createUser
// @desc Create account
// @access Public
router.post("/createUser", createUserValidation, createUser);

// @route POST /api/auth/login
// @desc Login
// @access Public
router.post("/login", login);

// @route POST /api/auth/signOut
// @desc Sign out
// @access Public
router.post("/signOut", signOut);

// @route POST /api/auth/resetPassword
// @desc Password reset
// @access Public
router.post("/resetPassword", resetPassword);

// Send friend request
router.post('/sendfriendrequest', async (req, res) => {
  const { userId } = req.tokenUser;
  const { recipientId } = req.body;

  const foundFriendRequest = await FriendRequest.findOne({
    sender: userId,
    recipient: recipientId,
  });
  if (foundFriendRequest) {
    return res.status(400).send();
  }

  const newFriendRequest = new FriendRequest({
    sender: userId,
    recipient: recipientId,
    status: 'pending',
  });

  newFriendRequest
    .save()
    .then((result) => {
      res.status(201).send(result);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

// get friend requests of current user
router.get('/getfriendrequests/:id', async (req, res) => {
  const requests = await FriendRequest.find({
    recipient: req.params.id,
  });
  res.status(200).send(requests);
});

// get friends of current user
router.get('/getfriends/:id', async (req, res) => {
  const uid = req.params.id;
  console.log(uid);
  try {
    const user = await User.findOne({ uid: uid });
    if (!user) {
      throw new Error('User not found');
    }

    res.status(200).json({ friend: user.friends });
  } catch (error) {
    console.error('Error getting friends:', error);
    res.status(400).send({ message: `Friend getting failed: ${error.message}` });
  }
});

router.post('/acceptfriendrequest', async (req, res) => {
  const recipientId = req.tokenUser.userId;
  const senderId = req.body.sender;
  const updatedSender = await User.findOneAndUpdate(
    { _id: senderId, friendList: { $nin: [recipientId] } },
    { $push: { friendList: recipientId } },
    { new: true }
  );
  const updatedRecipient = await User.findOneAndUpdate(
    { _id: recipientId, friendList: { $nin: [senderId] } },
    {
      $push: { friendList: senderId },
    },
    { new: true }
  );
  if (updatedRecipient) {
    const updatedFriendRequest = await FriendRequest.findOneAndUpdate(
      {
        sender: senderId,
        recipient: recipientId,
      },
      {
        $set: { status: 'accepted' },
        $push: { friendshipParticipants: [senderId, recipientId] },
      },
      { new: true }
    );

    const updatedRequests = await FriendRequest.find({
      recipient: req.tokenUser.userId,
      status: 'pending',
    });
    res.status(200).send({
      updatedRequests: updatedRequests,
      updatedUserFriendList: updatedRecipient.friendList,
    });
  }
});

router.post('/rejectfriendrequest', async (req, res) => {
  const recipientId = req.tokenUser.userId;
  const senderId = req.body.sender;
  const deletedFriendRequest = await FriendRequest.findOneAndDelete({
    sender: senderId,
    recipient: recipientId,
  });

  const updatedRequests = await FriendRequest.find({
    recipient: req.tokenUser.userId,
    status: 'pending',
  });

  res.status(200).send({
    updatedRequests: updatedRequests,
  });
});

router.post('/unfriend', async (req, res) => {
  const { userId } = req.tokenUser;
  const { friendId } = req.body;

  const updatedUser = await User.findOneAndUpdate(
    { _id: userId },
    { $pullAll: { friendList: [friendId] } },
    { new: true }
  ).select('-password');
  const updatedFriend = await User.findOneAndUpdate(
    { _id: friendId },
    { $pullAll: { friendList: [userId] } },
    { new: true }
  ).select('-password');

  const deletedFriendRequest = await FriendRequest.findOneAndDelete({
    $and: [
      { friendshipParticipants: { $in: [friendId] } },
      { friendshipParticipants: { $in: [userId] } },
    ],
  });

  res.status(200).send({ updatedUser, updatedFriend });
});

module.exports = router;