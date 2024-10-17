const Session = require("../models/sessionModel");

// get all locations
const getLocations = async (req, res) => {
  try {
    const locations = await Session.distinct("location");
    res.status(200).json(locations);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching locations", error: error.message });
  }
};
// get all courses
const getCourses = async (req, res) => {
  try {
    const courses = await Session.distinct("course");
    res.status(200).json(courses);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching courses", error: error.message });
  }
};
// get all sessions
const getSessions = async (req, res) => {
  // Extract query parameters
  const { location, course} = req.query;
  let query = {};

  if (location && location !== 'Any') {
    query.location = location;
  }
  if (course && course !== 'Any') {
    query.course = course;
  }

  try {
    // Find sessions based on the constructed query, sorted by most recent
    const sessions = await Session.find(query).sort({ createdAt: -1 });

    // Optionally, implement pagination by using skip and limit with query parameters

    res.status(200).json(sessions); // Sends JSON with sessions
  } catch (error) {
    // Handle any errors during the find operation
    res
      .status(500)
      .json({ message: "Error fetching sessions", error: error.message });
  }
};

// get a single session
const getSessionWithId = async (req, res) => {
  const { id } = req.params;

  try {
    const session = await Session.findById(id);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    res.json(session);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching session details",
        error: error.message,
      });
  }
};

// get sessions based on subject/course
const getSessionsWithSubject = async (req, res) => {
  const { course } = req.params;

  try {
    const sessions = await Session.find({ course: course });

    // Check if sessions were found
    if (sessions.length === 0) {
      // No sessions found for the location
      return res
        .status(404)
        .json({ message: "No sessions found with this course" });
    }

    res.json(sessions);
  } catch (error) {
    // Handle any errors that occur during the find operation
    res
      .status(500)
      .json({ message: "Error fetching sessions", error: error.message });
  }
};

// get sessions at a location
const getSessionsAtLocation = async (req, res) => {
  const { location } = req.params;

  try {
    // Use the find method to search for sessions with the specified location
    // Assuming 'location' is a field in your Session schema
    const sessions = await Session.find({ location: location });

    // Check if sessions were found
    if (sessions.length === 0) {
      // No sessions found for the location
      return res
        .status(404)
        .json({ message: "No sessions found at this location" });
    }

    res.json(sessions);
  } catch (error) {
    // Handle any errors that occur during the find operation
    res
      .status(500)
      .json({ message: "Error fetching sessions", error: error.message });
  }
};

// create a new session
const createSession = async (req, res) => {
  const {
    sessionLead,
    sessionID,
    expirationPeriod,
    currentParticipants,
    maxParticipants,
    location,
    floor,
    course,
    comments,
  } = req.body;
  try {
    const session = await Session.create({
      sessionLead,
      sessionID,
      expirationPeriod,
      currentParticipants,
      maxParticipants,
      location,
      floor,
      course,
      comments,
    });
    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// delete a session
const deleteSessionWithID = async (req, res) => {
  const { id } = req.params;

  try {
    const session = await Session.findById(id);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    await session.remove();
    res.json({ message: "Session deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


// update a session
const updateSession = async (req, res) => {
  const { id } = req.params;
  const { sessionLead, sessionID, expirationPeriod, currentParticipants, maxParticipants, location, floor, course, comments } = req.body;

  try {
    const session = await Session.findById(id);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    session.sessionLead = sessionLead;
    session.sessionID = sessionID;
    session.expirationPeriod = expirationPeriod;
    session.currentParticipants = currentParticipants;
    session.maxParticipants = maxParticipants;
    session.location = location;
    session.floor = floor;
    session.course = course;
    session.comments = comments;

    await session.save();
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


module.exports = {
  getSessions,
  getSessionsAtLocation,
  getSessionWithId,
  getSessionsWithSubject,
  createSession,
  deleteSessionWithID,
  updateSession,
  getLocations,
  getCourses,
};