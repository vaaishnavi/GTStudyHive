const mongoose = require('mongoose')

const Schema = mongoose.Schema

const sessionSchema = new Schema(   
  {
    sessionLead: {
      type: String, 
      required: true
    },
    sessionID: {
      type: Number,
      required: true
    },
    expirationPeriod: {
      type: Number,
      required: true
    },
    currentParticipants: { 
      type: Number,
      required: true
    },
    maxParticipants: {
      type: Number,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    floor: {
      type: String,
      required: false
    },
    course: {
      type: String,
      required: true
    },
    comments: {
      type: String,
      required: false
    }
  },{
    timestamps: true
  }
)

module.exports = mongoose.model('Session', sessionSchema)

