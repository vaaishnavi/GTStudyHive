import React, { useState, useEffect, useContext } from 'react';
import styles from '../styles/Home.module.css';
import firebase from '../auth/firebase.js';
import Link from 'next/link'; // Import Link component
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/router';
import { AuthContext } from '../contexts/AuthContext.js';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showError, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebase.auth, (user) => {
      if (user) {
        // User is signed in.
        console.log("User is signed in");

        // Check if the current page is not the landing page

        router.push("/LandingPage"); // Redirect to LandingPage if login successfully
      } else {
        // User is signed out.
        console.log("User is signed out");
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    setError(null);

    try {
        await signInWithEmailAndPassword(firebase.auth, email, password);
    //   const response = await fetch("http://localhost:4000/api/auth/login", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ email, password }),
    //   });

    //   if (response.ok) {
    //     const data = await response.json();
    //     const user = data.user;

        // const token = data.token;

        // Save token in local storage
        // localStorage.setItem("token", token);

        // Save user information in local storage
        // localStorage.setItem("user", JSON.stringify(user));

        // Redirect to LandingPage if login successfully
        router.push("/LandingPage");
    //   } else {
    //     const error = await response.json();
    //     setError(error.message);
    //   }
    } catch (error) {
      console.error("Error logging in:", error);
      setError(error.message);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

    return (
        <>
        <div className={styles.buttons}>
                    <Link href="/AboutUs">
                        <button className={styles.nav}>About</button>
                    </Link>
                    <Link href="/LandingPage">
                        <button className={styles.nav}>Sessions</button>
                    </Link>
                    {currentUser ? (
                        <button className={styles.login} onClick={handleLogout}>Log Out</button>
                    ) : (
                        <Link href="/Login">
                            <button className={styles.login}>Log In</button>
                        </Link>
                    )}
        </div>
        <div className={styles.loginPage}>
            
            <div className={styles.loginContainer}>
                {/* <img src="images/background4.png" className={styles.img4} /> */}
                <h1>GT Study Hive</h1>
                <h2>Welcome back to the hive!</h2>
                <form className={styles.formContainer}>
                
                        <label>User Email:</label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyUp={handleKeyPress}
                        />
                        <label>Password:</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyUp={handleKeyPress}
                        />
                    <button className={styles.loginShow} type="button" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? 'Hide Password' : 'Show Password'}
                    </button>
                    {showError && <p className={styles.errorMessage}>{showError && showError}</p>}
                    <button className={styles.loginButton} type="button" onClick={handleLogin}>Login</button>
                </form>
                <p>Don't have an account? <a href="/Signup">Create Account</a></p>
            </div>
        </div>
        </>
    );
};

export default Login;
