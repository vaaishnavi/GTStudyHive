import { useEffect, useState } from 'react'
import React from 'react';
import styles from '../styles/Home.module.css';
import ProtectedRoute from '../components/ProtectedRoute';


// import components
import SessionDetails from '../components/SessionDetails'

const AllSessions = () => {
    const [sessions, setSessions] = useState(null) // initiate list of sessions as null
    const [location, setLocation] = useState("Any") // location const for filtering
    const [course, setCourse] = useState("Any") // course const for filtering
    const [locList, setLocList] = useState(["Any","library","culc","Crosland", "Klaus"]) // list of locations for selecting
    const [courseList, setCourseList] = useState(["Any","CS1301", "2110", "1332", "2050"]) // list of courses for selecting
    const [text, setText] = useState(null)
    

    useEffect(() => {
        const fetchSessions = async () => {

            // fetch data from backend, catch error if failed
            fetch(`http://localhost:4000/api/sessions`)
                .then(response => response.json())
                .then(data => {
                    setSessions(data);
                    if ("message" in data) {// if error message is returned in json
                        setSessions(null);
                        setText("No sessions available");
                    }
                })
                .catch( () => { // if there's error fetching data
                    setSessions(null);
                    setText("No sessions available");
                })
        }

        fetchSessions()
    }, [])

    const handleFilterSessions = async () => {
        setText(null)
        
        // Initialize the query parameters string
        let queryString = '';

        // Check if we need to add query parameters for filtering
        if (location !== 'Any' || course !== 'Any') {
            const params = new URLSearchParams();

            // Add 'course' query parameter if not 'Any
            if (course !== 'Any') {
                params.append('course', course);
            }

            // Add 'location' query parameter if not 'Any
            if (location !== 'Any') {
                params.append('location', location);
            }

            queryString = `?${params.toString()}`;

        } 

        fetch(`http://localhost:4000/api/sessions${queryString}`)
            .then(response => response.json())
            .then(data => {
                if (!data.message) {
                    setSessions(data);
                } else {
                    setSessions(null);
                    setText("No sessions available");
                }
            })
            .catch(error => { // if there's error fetching data
                console.error('Error fetching filtered sessions:', error);
                setSessions(null);
                setText("Failed to fetch sessions, please try again.");
            })

    };

    return (
        <ProtectedRoute>
            <div className={styles.allSessions}>
              <h1>All Sessions</h1>
              <div className={styles.filterContainer}>
                  <div>
                      <h4>Location</h4>
                      <select value={location} onChange={(e) => setLocation(e.target.value)}>
                          {locList.length > 0 ? (
                              locList.map((item) => (
                                  <option key={item} value={item}>{item}</option>
                              ))
                          ) : (
                              <option value="Location">Location</option>
                          )}
                      </select>
                  </div>
                  <div>
                      <h4>Course</h4>
                      <select value={course} onChange={(e) => setCourse(e.target.value)}>
                          {courseList.length > 0 ? (
                              courseList.map((item) => (
                                  <option key={item} value={item}>{item}</option>
                              ))
                          ) : (
                              <option value="Course">Course</option>
                          )}
                      </select>
                  </div>
                  <p></p>
                  <button className={styles.filterButton} onClick={handleFilterSessions}>Filter</button>
              </div>
              <div className={styles.allContainer}>
                  <div className={styles.sessionsContainer}>
                      {sessions && sessions.map((session) => (
                          <SessionDetails key={session._id} session={session}/>
                      ))}
                      <p className={styles.displayText}>{text && text}</p>
                  </div>
              </div>
          </div>
        </ProtectedRoute>
    )
}

export default AllSessions