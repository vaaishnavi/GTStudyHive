const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
  uid: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  schoolEmail: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: 'user', // could be 'user', 'admin', etc.
  },
  userName: {
    type: String,
    required: true,
  },
  friends: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: 'default-profile-picture.png',
  },
},{
  timestamps: true
}
)

module.exports = mongoose.model('User', userSchema)

