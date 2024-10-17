"use client";

import { useState, useEffect } from "react";
import { useContext, React } from 'react';

import styles from '../styles/Home.module.css';
import Link from 'next/link'; // Import Link component
import auth from '../auth/firebase.js';
import firebase from '../auth/firebase.js';
import { AuthContext } from '../contexts/AuthContext';

//import components
import ProtectedRoute from "../components/ProtectedRoute.js";

export default function friends() {

    const [data, setData] = useState([]);
    const [friends, setFriends] = useState([]);
    const currentUser = useContext(AuthContext);
    const [uid, setUid] = useState("");
    const [buttonTexts, setButtonTexts] = useState(['Add Froend', 'Add Froend', 'Add Froend', 'Add Froend', 'Add Froend', 'Add Froend']);

    const handleClick = (index) => {
        setButtonTexts(buttonTexts.map((text, idx) => idx === index ? (text === "Add Friend" ? "Request Sent" : "Add Friend") : text));
      };

    const handleLogout = () => {
        firebase.auth.signOut()
            .then(() => {
                // Sign-out successful.
                console.log('User Logged Out!');
            }).catch((error) => {
            // An error happened.
            console.log('Error: ', error);
        });
    };

    useEffect(() => {
        fetch("http://localhost:4000/api/auth/getUsers") //gets users
          .then((response) => response.json())
          .then((json) => {
            console.log("Fetched data:", json);
            setData(json);
          });
        }, []);

    useEffect(() => {
        data.forEach((user) => {
            console.log(user);
            if (user.schoolEmail == currentUser.email) {
                setUid(user.uid);
            }
        });
        console.log(uid);
        }, []);

    useEffect(() => {
        if (data.length > 0) {
            setButtonTexts(data.map(() => "Add Friend"));
        }
        }, [data]);
    
    useEffect(() => {
        console.log(uid);
        var url = "http://localhost:4000/api/auth/getfriends/" + uid;
        console.log(url);
        fetch(url) //gets friends
            .then((response) => response.json())
            .then((json) => {
            console.log("Fetched data:", json.friend);
            setFriends(json.friend);
            console.log(json.friend);
            });
        },[uid]
        );

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
                            <button className={styles.friends}>Sessions</button>
                        </Link>
                        <Link href="/Friends">
                            <button className={styles.login}>Friends</button>
                        </Link>
                        {currentUser ? (
                            <button className={styles.friends} onClick={handleLogout}>Log Out</button>
                        ) : (
                            <Link href="/Login">
                                <button className={styles.nav}>Log In</button>
                            </Link>
                        )}
                    </div>
                    <h1>GT Study Hive</h1>
                    <div>{currentUser && `Logged in as ${currentUser.email}`}</div>
                    <h2>Friends</h2>
                    {friends.map((user) => <li>{user.firstName + " " + user.lastName}</li>)}
                </div>
                <div className={styles.users}>
                    <h1>Requests</h1>
                    {/*currentUser && currentUser.requests.map((friend) => <li>{friend.firstName + " " + friend.lastName}</li>) /* fix null error*/}
                    <h1>Users</h1>
                    {data.map((user, index) => 
                        <div className={styles.eachUser}>
                            <h2>{user.firstName + " " + user.lastName}</h2>
                            <button className={styles.addFriend} onClick={() => handleClick(index)}>
                                {buttonTexts[index]}
                            </button>
                        </div>)}
                </div>
            </div>
        </ProtectedRoute>
    );

}