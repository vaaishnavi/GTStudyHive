import React, { useState } from "react";
import styles from "../styles/Home.module.css";
import { app } from "../auth/firebase.js";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { useRouter } from "next/router";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(""); //
  const [showPassword, setShowPassword] = useState(null);
  const [showError, setError] = useState(null);
  const router = useRouter();

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSignup();
    }
  };

  const handleSignup = async () => {
    const uppercaseRegex = /[A-Z]/; // Check if password has at least one uppercase letter
    const numberRegex = /[0-9]/; // Check if password has at least one number
    const specialCharRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/; // Check if password has at least one special character
    const emailRegex = /^[^\s@]+@gatech\.edu$/; // Check if email is a valid Georgia Tech email (end with @gatech.edu)
    const phoneRegex = /^\d{10}$/; // Check if phone number is valid

    // Check if all fields are filled
    if (
      username === "" ||
      password === "" ||
      phone === "" ||
      firstName === "" ||
      lastName === ""
    ) {
      setError("Please fill in all information");
      console.log("User did not fill in all information");
      return;
    }

    // Check if email is valid
    if (!emailRegex.test(email)) {
      setError("Please enter a valid school email");
      console.log("Invalid email");
      return;
    }

    // Check if password meets all requirements
    if (
      password.length < 8 ||
      !uppercaseRegex.test(password) ||
      !numberRegex.test(password) ||
      !specialCharRegex.test(password)
    ) {
      setError(
        "Password should be at least 8 characters, include at least one uppercase letter, one number, and one special character."
      );
      console.log("Password does not meet requirements");
      return;
    }

    if (phone.length !== 10 || !phoneRegex.test(phone)) {
      setError("Please enter a valid phone number");
      console.log("Invalid phone number");
      return;
    }

    setError(null);

    try {
      const response = await fetch(
        "http://localhost:4000/api/auth/createUser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: password,
            schoolEmail: email,
            firstName: firstName,
            lastName: lastName,
            userName: username,
            phoneNumber: phone,
          }),
        }
      );
      const data = await response.json();
      console.log(data);
      if (data.message !== "User created successfully") {
        setError(data.message); // If signup failed
        return;
      }

      router.push("/LandingPage"); // Redirect to LandingPage if signup successfully
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <div className={styles.loginPage}>
      
      <div className={styles.loginContainer}>
        {/* <img src="images/background4.png" className={styles.img4} /> */}
        <h1>GT Study Hive</h1>
        <h2>Welcome! Let's get started</h2>
        <form className={styles.formContainer}>
          <label>First Name:</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            onKeyUp={handleKeyPress}
          />
          <label>Last Name:</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            onKeyUp={handleKeyPress}
          />
          <label>School Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyUp={handleKeyPress}
          />
          <label>Phone Number:</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onKeyUp={handleKeyPress}
          />
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
          <button className={styles.loginButton} type="button" onClick={handleSignup}>Sign Up</button>
          <p>Already have an account? <a href="/Login">Login</a></p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
