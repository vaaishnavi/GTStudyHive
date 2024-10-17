const mongoose = require('mongoose')

const Schema = mongoose.Schema

const profileSchema = new Schema(
    {
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
        userName: {
        type: String,
        required: true,
        },
        phoneNumber: {
        type: String,
        required: true,
        },
        profilePicture: {
        type: String,
        default: 'default-profile-picture.png',
        },
    },
    {
        timestamps: true,
    }
    )

module.exports = mongoose.model('Profile', profileSchema)