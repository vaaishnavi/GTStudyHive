// import React, { useState } from 'react';
// import styles from '../styles/form.module.css';

// function App() {
//     const [formData, setFormData] = useState({
//         sessionName: '',
//         groupIdentifier: '',
//         expirationPeriod: '',
//         numParticipants: '',
//         maxParticipants: '',
//         classSpecific: '',
//         comments: ''
//     });

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         // try {
//         //     const response = await fetch(`http://localhost:4000/api/sessions`, {
//         //         method: 'POST',
//         //         headers: {
//         //             'Content-Type': 'application/json'
//         //         },
//         //         body: JSON.stringify(formData)
//         //     });
//         //     if (response.ok) {
//         //         // Handle success, e.g., show a success message
//         //         console.log('Session created successfully');
//         //     } else {
//         //         // Handle error, e.g., show an error message
//         //         console.error('Failed to create session');
//         //     }
//         // } catch (error) {
//         //     console.error('Error:', error);
//         // }

//         try {
//             const response = await fetch(
//               "http://localhost:4000/api/sessions",
//               {
//                 method: "POST",
//                 headers: {
//                   "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     sessionLead: groupIdentifier,
//                     expirationPeriod: expirationPeriod,
//                     currentParticipants: numParticipants,
//                     maxParticipants: maxParticipants,
//                     location: "CULC",
//                     floor: "NA",
//                     course: classSpecific,
//                     comments: comments,
//                 }),
//               }
//             );
//             const data = await response.json();
//             console.log(data);
//             // if (data.message !== "Session created successfully") {
//             //   setError(data.message); // If signup failed
//             //   return;
//             // }
      
//             // router.push("/LandingPage"); // Redirect to LandingPage if signup successfully
//           } catch (error) {
//             console.error("Error creating session:", error);
//           }
//         // Reset the form after submission
//         // setFormData({
//         //     sessionName: '',
//         //     groupIdentifier: '',
//         //     expirationPeriod: '',
//         //     numParticipants: '',
//         //     maxParticipants: '',
//         //     classSpecific: '',
//         //     comments: ''
//         // });
//     };

//     return (
//         <div className={styles.body}>
//             <div className={styles.container}>
//                 <form onSubmit={handleSubmit} id={styles.sessionForm}>
//                     <h2>Create Session</h2>
//                     <label htmlFor="sessionName">Session Name<span className="required">*</span>:</label>
//                     <input type="text" id="sessionName" name="sessionName" placeholder="Enter Session Name" value={formData.sessionName} onChange={handleChange} required />

//                     <label htmlFor="groupIdentifier">Group Identifier<span className="required">*</span>:</label>
//                     <input type="text" id="groupIdentifier" name="groupIdentifier" placeholder="Enter Group Identifier" value={formData.groupIdentifier} onChange={handleChange} required />

//                     <label htmlFor="expirationPeriod">Expiration Period<span className="required">*</span>:</label>
//                     <input type="text" id="expirationPeriod" name="expirationPeriod" placeholder="Enter Expiration Period" value={formData.expirationPeriod} onChange={handleChange} required />

//                     <label htmlFor="numParticipants">Number of Participants<span className="required">*</span>:</label>
//                     <input type="number" id="numParticipants" name="numParticipants" placeholder="Enter Number of Participants" value={formData.numParticipants} onChange={handleChange} required />

//                     <label htmlFor="maxParticipants">Max Participants<span className="required">*</span>:</label>
//                     <input type="number" id="maxParticipants" name="maxParticipants" placeholder="Enter Max Participants" value={formData.maxParticipants} onChange={handleChange} required />

//                     <label htmlFor="classSpecific">Class (if class-specific):</label>
//                     <input type="text" id="classSpecific" name="classSpecific" placeholder="Enter Class Name" value={formData.classSpecific} onChange={handleChange} />

//                     <label htmlFor="comments">Comments:</label>
//                     <textarea id="comments" name="comments" placeholder="Enter Comments" value={formData.comments} onChange={handleChange}></textarea>

//                     <button type="submit">Create</button>
//                 </form>
//             </div>
//         </div>
//     );
// }

// export default App;


import React, { useState } from "react";
import styles from "../styles/form.module.css";
import { useRouter } from "next/router";
import ProtectedRoute from "../components/ProtectedRoute.js"

const CreateForm = () => {
  const [sessionLead, setSessionLead] = useState("");
  const [expirationPeriod, setExpirationPeriod] = useState("");
  const [currentParticipants, setCurrentParticipants] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");
  const [course, setCourse] = useState("");
  const [floor, setFloor] = useState("");
  const [location, setLocation] = useState("");
  const [comments, setComments] = useState("");
  const [locList, setLocList] = useState([
    "CULC",
    "Price Gilbert Library",
    "Crosland Tower",
    "Student Center",
    "CCB",
    "Klaus",
    "Brittain",
    "North Ave",
    "West Village",
    "Architecture West/East",
    "Coda",
    "Boggs",
    "Whitaker",
    "MRDC",
    "Swann",
    "Weber",
    "Tech Green",
    "Groseclose",
    "Instructional Center"
  ]);
  const [courseList, setCourseList] = useState([
    "CS 1301",
    "CS 1331",
    "CS 1332",
    "CS 2050",
    "CS 2110",
    "CS 2200",
    "CS 2340",
    "CS 3510",
    "CS 3600",
    "CS 3651",
    "CS 4235",
    "CS 4400",
    "CS 4475",
    "CS 4510",
    "CS 4641",
    "CS 4731",
    "CS 4803",
    "CS 4911",
    "CS 6310",
    "CS 6475",
    "CS 6515",
    "CS 6601",
    "CS 7641",
    "CS 8803-O03",
    "CS 8803-O08",
    "CS 8803-O09",
    "CS 8803-GA",
    "CS 8803-001",
    "CS 8803-002"
  ]);
  const router = useRouter();

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleCreate();
    }
  };

  const handleCreate = async () => {

    const sessionID = Math.floor(Math.random() * 1000000);

    try {
      const response = await fetch(
        "http://localhost:4000/api/sessions/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionID: sessionID,
            sessionLead: sessionLead,
            expirationPeriod: expirationPeriod,
            currentParticipants: currentParticipants,
            maxParticipants: maxParticipants,
            location: location,
            course: course,
            floor: floor,
            comments: comments,
          }),
        }
      );
      const data = await response.json();
      console.log(data);
      if (response.status === 200) {
        alert("Session Created Successfully")
        router.push('/LandingPage')
      } else {
        alert("Failed to Create Session: ")
        return;
      }
       // Redirect to LandingPage if signup successfully
    } catch (error) {
      console.error("Error creating session:", error);
    }
  };

  return (
    <ProtectedRoute>
      <div className={styles.body}>
        
        <div className={styles.container}>
          <form id={styles.sessionForm}>
              <h2>Create Session</h2>
              
              <label>Session Lead <span className="required">*</span>:</label>
              <input
              type="text"
              value={sessionLead}
              onChange={(e) => setSessionLead(e.target.value)}
              onKeyUp={handleKeyPress}
              placeholder="Enter Session Lead" required
              />
              <label>Expiration Period <span className="required">*</span> (in minutes):</label>
              <input
              type="number"
              value={expirationPeriod}
              onChange={(e) => setExpirationPeriod(e.target.value)}
              onKeyUp={handleKeyPress}
              placeholder="Enter Expiration Period" required
              />
              <label>Current Participants <span className="required">*</span>:</label>
              <input
              type="number"
              value={currentParticipants}
              onChange={(e) => setCurrentParticipants(e.target.value)}
              onKeyUp={handleKeyPress}
              placeholder="Enter Current Participants" required
              />
              <label>Max Participants <span className="required">*</span>:</label>
              <input
              type="text"
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(e.target.value)}
              onKeyUp={handleKeyPress}
              placeholder="Enter Max Participants" required
              />
              
              <label>Location <span className="required">*</span>:</label>
                  <select value={location} required onChange={(e) => setLocation(e.target.value)}>
                  <option value="">Select Location</option>
                  {locList.map((loc, index) => (
                      <option key={index} value={loc}>{loc}</option>
                  ))}
                  </select>

              <label>Floor:</label>
              <input
              type="Number"
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
              onKeyUp={handleKeyPress}
              placeholder="Enter Floor Number"
              />
              <label>Course:</label>
                  <select value={course} required onChange={(e) => setCourse(e.target.value)}>
                  <option value="">Select Course</option>
                  {courseList.map((course, index) => (
                      <option key={index} value={course}>{course}</option>
                  ))}
                  </select>

              <label>Comments:</label>
              <textarea value={comments} onChange={(e) => setComments(e.target.value)} 
              placeholder="Enter Comments" />
              
              
              
            <button type="button" onClick={handleCreate}>Create</button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default CreateForm;
