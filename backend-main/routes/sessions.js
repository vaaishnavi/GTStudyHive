const express = require('express')
const Session = require('../models/sessionModel')
const {
  getSessions,
  getSessionsAtLocation,
  getSessionWithId,
  getSessionsWithSubject,
  createSession,
  deleteSessionWithID,
  updateSession,
    getCourses,
    getLocations,
} = require('../controllers/sessionController')

const router = express.Router()

// GET all locations
router.get('/locations', getLocations);

// GET all courses
router.get('/courses', getCourses);

// GET all sessions
router.get('/', getSessions);

// GET a single session based on ID
router.get('/:id', getSessionWithId);

//GET sessions at a location
router.get('/location/:location', getSessionsAtLocation);

//GET sessions with a course
router.get('/course/:course', getSessionsWithSubject);

// POST a new study session
router.post('/', createSession);

// DELETE a study session 
router.delete('/:id', deleteSessionWithID);

// UPDATE a study session
router.patch('/:id', updateSession);

module.exports = router