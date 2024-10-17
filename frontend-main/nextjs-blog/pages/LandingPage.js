"use client";

import React, { useState, useEffect, useContext, useRef } from "react";
import styles from "../styles/Home.module.css";
import Link from "next/link"; // Import Link component
import auth from "../auth/firebase.js";
import firebase from "../auth/firebase.js";
import { AuthContext } from "../contexts/AuthContext";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { MarkerClusterer } from "@googlemaps/markerclusterer";

// import components
import SessionDetails from "../components/SessionDetails";
import ProtectedRoute from "../components/ProtectedRoute.js";

export default function Intro() {
  const position = { lat: 33.775, lng: -84.39737 }; // location for use (map center, marker location, info window location)
  const locationCoordinates = {
    // 33.774345, -84.396469
    "CULC": { lat: 33.7745, lng: -84.396469 },
    "Price Gilbert Library": { lat: 33.77434851179891, lng: -84.39561937430898 },
    "Crosland Tower": { lat: 33.77415416507829, lng: -84.39501716476232 },
    "Student Center": { lat: 33.77370802195297, lng: -84.39818853768328 },
    "CCB": { lat: 33.77772483545848, lng: -84.39731758448147 },
    "Klaus": { lat: 33.7772610380439, lng: -84.39576145919321 },
    "Brittain": { lat: 33.77265005869699, lng: -84.39132584755295 },
    "North Ave": { lat: 33.771, lng: -84.39145977268558 },
    "West Village": { lat: 33.77973356083491, lng: -84.404683545701 },
    "Architecture West/East": { lat: 33.776090430266144, lng: -84.39597786513797 },
    "Coda": { lat: 33.7754701886726, lng: -84.38765333220898 },
    "Boggs": { lat: 33.776, lng: -84.39962261757717 },
    "Whitaker": { lat: 33.778488238863254, lng: -84.3967251017529 },
    "MRDC": { lat: 33.77748803596268, lng: -84.4005609726854 },
    "Swann": { lat: 33.7718, lng: -84.395142 },
    "Weber": { lat: 33.77265343070376, lng: -84.39632731261527 },
    "Tech Green": { lat: 33.774, lng: -84.39729248802927 },
    "Groseclose": { lat: 33.7755, lng: -84.40184478802924 },
    "Instructional Center": { lat: 33.775561140553535, lng: -84.40122251554408 },
  };
  const [data, setData] = useState([]); //creates data variable using state hook, initializes to empty list
  const [selectedMarker, setSelectedMarker] = useState(null);
  const mapRef = useRef(null);
  const clusterRef = useRef(null);

  const currentUser = useContext(AuthContext);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyD_eQW119lIMFKuac3i0oD3OzXC1Gculc4",
  });

  useEffect(() => {
    fetch("http://localhost:4000/api/sessions/")
      .then((response) => response.json())
      .then((json) => {
        console.log("Fetched data:", json);
        const locationCounts = {};

        const info = json.map((session) => {
          let coordinates = locationCoordinates[session.location] || { lat: 33.776, lng: -84.398 };

          // Scatter the markers randomly in a circular pattern around the original coordinates, creating a more visually appealing distribution.
          locationCounts[session.location] =
            (locationCounts[session.location] || 0) + 1;

          const radius = 0.00025; // Adjust the radius as needed
          const angle = Math.random() * 2 * Math.PI;
          const offsetLat = radius * Math.cos(angle);
          const offsetLng = radius * Math.sin(angle);

          coordinates = {
            lat: coordinates.lat + offsetLat,
            lng: coordinates.lng + offsetLng,
          };

          const infoWindowContent = `
          <div>
            <h3>${session.course}</h3>
            <p>Session Lead: ${session.sessionLead}</p>
            <p>Location: ${session.location}</p>
            <p>Comments: ${session.comments}</p>
          </div>
        `;

          return {
            ...session,
            coordinates,
            infoWindowContent,
          };
        });
        setData(info); //sets data to the json array
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    if (isLoaded && data.length > 0 && mapRef.current) {
      const map = mapRef.current;

      const markers = data.map((session) => {
        const marker = new window.google.maps.Marker({
          position: session.coordinates,
          icon: {
            url: "/buzz-icon.png",
            scaledSize: new window.google.maps.Size(40, 40),
          },
          map: map,
        });

        console.log("Marker created:", marker);

        marker.set("session", session);

        marker.addListener("click", () => {
          setSelectedMarker(session);
        });

        return marker;
      });

      if (clusterRef.current) {
        clusterRef.current.clearMarkers();
      }

      clusterRef.current = new MarkerClusterer({
        map,
        markers,
        renderer: {
          render: ({ count, position }) => {
            return new window.google.maps.Marker({
              position,
              icon: {
                url: "/buzz-icon.png",
                scaledSize: new window.google.maps.Size(40, 40),
              },
              label: {
                text: String(count),
                color: "white",
                fontSize: "12px",
              },
            });
          },
        },
        // maxZoom: 17, // Add this option to prevent clustering at high zoom levels
        // minZoom: 14,
        // zoomOnClick: false, // Disable the default zoom behavior on cluster click
      });

      // Add a click event listener to the MarkerClusterer
      clusterRef.current.addListener("click", (cluster) => {
        const map = mapRef.current;
        const markers = cluster.markers;

        // Calculate the center of the cluster
        const clusterCenter = markers.reduce(
          (acc, marker) => {
            const position = marker.getPosition();
            acc.lat += position.lat();
            acc.lng += position.lng();
            return acc;
          },
          { lat: 0, lng: 0 }
        );
        clusterCenter.lat /= markers.length;
        clusterCenter.lng /= markers.length;

        // Set the map center to the cluster center and zoom in
        // map.setCenter(clusterCenter);
        // map.setZoom(8); // Adjust the zoom level as needed
      });

      console.log("MarkerClusterer instance:", clusterRef.current);
    }
  }, [isLoaded, data]);

  const [sessions, setSessions] = useState(null); // initiate list of sessions as null
  const [location, setLocation] = useState("Any"); // location const for filtering
  const [course, setCourse] = useState("Any"); // course const for filtering
  const [locList, setLocList] = useState([
    "Any",
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
  ]); // list of locations for selecting
  const [courseList, setCourseList] = useState([
    "Any",
    "CS 1331",
    "CS 1332",
    "CS 2110",
    "CS 2050",
    "CS 2340",
    "CS 4641"
  ]); // list of courses for selecting, need to change it to dynamiclly showing the current active courses
  const [text, setText] = useState(null);

  const handleLogout = () => {
    firebase.auth
      .signOut()
      .then(() => {
        // Sign-out successful.
        console.log("User Logged Out!");
      })
      .catch((error) => {
        // An error happened.
        console.log("Error: ", error);
      });
  };

  useEffect(() => {
    const fetchSessions = async () => {
      // fetch data from backend, catch error if failed
      fetch(`http://localhost:4000/api/sessions`)
        .then((response) => response.json())
        .then((data) => {
          setSessions(data);
          if ("message" in data) {
            // if error message is returned in json
            setSessions(null);
            setText("No sessions available");
          }
        })
        .catch(() => {
          // if there's error fetching data
          setSessions(null);
          setText("No sessions available");
        });
    };

    fetchSessions();
  }, []);

  const handleFilterSessions = async () => {
    setText(null);

    // Initialize the query parameters string
    let queryString = "";

    // Check if we need to add query parameters for filtering
    if (location !== "Any" || course !== "Any") {
      const params = new URLSearchParams();

      // Add 'course' query parameter if not 'Any
      if (course !== "Any") {
        params.append("course", course);
      }

      // Add 'location' query parameter if not 'Any
      if (location !== "Any") {
        params.append("location", location);
      }

      queryString = `?${params.toString()}`;
    }

    fetch(`http://localhost:4000/api/sessions${queryString}`)
      .then((response) => response.json())
      .then((data) => {
        if (!data.message) {
          setSessions(data);
        } else {
          setSessions(null);
          setText("No sessions available");
        }
      })
      .catch((error) => {
        // if there's error fetching data
        console.error("Error fetching filtered sessions:", error);
        setSessions(null);
        setText("Failed to fetch sessions, please try again.");
      });
  };

  return (
    <ProtectedRoute>
      <img src="images/background1.png" className={styles.img1} />
      <img src="images/background2.png" className={styles.img2} />
      <img src="images/background3.png" className={styles.img3} />
      <img src="images/background4.png" className={styles.img4} />
      <img src="images/background5.png" className={styles.img5} />
      <div className={styles.landingPage}>
        <div className={styles.allSessions}>
          <div className={styles.buttons}>
            <Link href="/AboutUs">
              <button className={styles.nav}>About</button>
            </Link>
            <Link href="/LandingPage">
              <button className={styles.login}>Sessions</button>
            </Link>
            <Link href="/Friends">
              <button className={styles.friends}>Friends</button>
            </Link>
            {currentUser ? (
              <button className={styles.friends} onClick={handleLogout}>
                Log Out
              </button>
            ) : (
              <Link href="/Login">
                <button className={styles.friends}>Log In</button>
              </Link>
            )}
          </div>
          <h1>GT Study Hive</h1>
          <div>{currentUser && `Logged in as ${currentUser.email}`}</div>

          <div className={styles.filterContainer}>
            <div>
              <h4>Location</h4>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                {locList.length > 0 ? (
                  locList.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))
                ) : (
                  <option value="Location">Location</option>
                )}
              </select>
            </div>
            <div>
              <h4>Course</h4>
              <select
                value={course}
                onChange={(e) => setCourse(e.target.value)}
              >
                {courseList.length > 0 ? (
                  courseList.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))
                ) : (
                  <option value="Course">Course</option>
                )}
              </select>
            </div>
            <p></p>
            <button
              className={styles.filterButton}
              onClick={handleFilterSessions}
            >
              Filter
            </button>
          </div>
          <div className={styles.allContainer}>
            <div className={styles.sessionsContainer}>
              {sessions &&
                sessions.map((session) => (
                  <SessionDetails key={session._id} session={session} />
                ))}
              <p className={styles.displayText}>{text && text}</p>
            </div>
          </div>
        </div>

        <div className={styles.mapContainer}>
          {isLoaded ? (
            <div
              className={styles.map}
              style={{ height: "600px", width: "600px" }}
            >
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "100%" }}
                center={position}
                zoom={16}
                options={{
                  mapId: "4cfcacb82ed82169",
                }}
                onLoad={(map) => {
                  mapRef.current = map;
                }}
              >
                {selectedMarker && (
                  <InfoWindow
                    position={selectedMarker.coordinates}
                    onCloseClick={() => {
                      setSelectedMarker(null);
                    }}
                    options={{
                      disableAutoPan: true,
                      pixelOffset: new window.google.maps.Size(0, -30),
                    }}
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: selectedMarker.infoWindowContent,
                      }}
                    />
                  </InfoWindow>
                )}
              </GoogleMap>
            </div>
          ) : (
            <div>Loading...</div>
          )}
          <Link href="/form">
            <button className={styles.create}>
              Create Session
            </button>
          </Link>
        </div>
      </div>
    </ProtectedRoute>
  );
}
