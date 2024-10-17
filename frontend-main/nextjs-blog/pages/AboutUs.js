import Head from 'next/head';
import Link from 'next/link'; // Import Link component
import AboutUs from '../styles/AboutUs.module.css';
import styles from '../styles/Home.module.css';

import { useContext, React } from 'react';
import firebase from '../auth/firebase.js';
import { AuthContext } from '../contexts/AuthContext';

const About = () => {

  const currentUser = useContext(AuthContext);

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

  return (
    <div>
      <img src="images/background1.png" className={styles.img1} />
      <img src="images/background2.png" className={styles.img2} />
      <img src="images/background3.png" className={styles.img3} />
      <img src="images/background4.png" className={styles.img4} />
      <img src="images/background5.png" className={styles.img5} />
      <div className={styles.landingPage}>
        <div className={styles.allSessions}>
          <div className={styles.buttons}>
            <Link href="/AboutUs">
              <button className={styles.login}>About</button>
            </Link>
            <Link href="/LandingPage">
              <button className={styles.friends}>Sessions</button>
            </Link>
            <Link href="/Friends">
              <button className={styles.friends}>Friends</button>
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
          <div className={AboutUs.container2}>
            <div className={AboutUs.description}>
              <div className={AboutUs.text2}>
                <strong>Find a session to fit <span className={AboutUs.text}>YOUR</span> study needs here!</strong>
              </div>
              <div className={AboutUs.text3}>
              Want to study with other students, but can't 
              find the information needed to meet with your peers? 
              We've got you covered. You can checkout all active 
              sessions on the map and join or create a new session anywhere
              on Georgia Tech's campus. Navigate to the Sessions page to get started.
              </div>
            </div>
          </div>
        </div>
        <div className={AboutUs.logo}>
          <img src="images/beeicon.png" className={AboutUs.bee}/>
        </div>
      </div>
    </div>
    // <img src="images/background1.png" className={styles.img1} />
    //     <img src="images/background2.png" className={styles.img2} />
    //     <img src="images/background3.png" className={styles.img3} />
    //     <img src="images/background4.png" className={styles.img4} />
    //     <img src="images/background5.png" className={styles.img5} />
    //     <div className={styles.landingPage}>
    //         <div className={styles.allSessions}>
    //             <div className={styles.buttons}>
    //                 <Link href="/AboutUs">
    //                     <button className={styles.nav}>About</button>
    //                 </Link>
    //                 <Link href="/LandingPage">
    //                     <button className={styles.login}>Sessions</button>
    //                 </Link>
    //                 <Link href="/Login">
    //                   <button className={styles.nav}>Log In</button>
    //                 </Link>
    //   </div>
    //   <div className={AboutUs.container1}>
    //     <h className={AboutUs.StudyHive}>GT Study Hive</h>          
    //   </div>
    //   <div className={AboutUs.container2}>
    //     <div className={AboutUs.description}>
    //       <div className={AboutUs.text2}>
    //         <strong>Find a session to fit <span className={AboutUs.text}>YOUR</span> study needs here!</strong>
    //       </div>
    //       <div className={AboutUs.text3}>
    //         Want to study with other students, but can't 
    //         find the information needed to meet with your peers? 
    //         We've got you covered. You can checkout all active 
    //         sessions on the map and join or create a new session anywhere
    //         on Georgia Tech's campus. Navigate to the Sessions page to get started.
    //       </div>
    //     </div>
    //     <div className={AboutUs.logo}>
    //       <img src="images/beeicon.png" className={AboutUs.bee}/>
    //     </div>
    //   </div>
    // </div>
  );
};

export default About;