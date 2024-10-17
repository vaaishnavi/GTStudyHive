import React, { useState, useEffect, useContext } from "react";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import { AuthContext } from "../contexts/AuthContext.js";
import ProtectedRoute from "../components/ProtectedRoute";

const userProfile = () => {
  const user = useContext(AuthContext);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showError, setError] = useState(null);
  const router = useRouter();

  // useEffect(() => {
  //   fetchProfileData();
  // }, []);

  // const fetchProfileData = async () => {
  //   try {
  //   const userId = localStorage.getItem("userId");
  //     const response = await fetch("http://localhost:4000/api/auth/profile/${userId}", {
  //       method: "GET",
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     });
  //     const data = await response.json();
  //     setFirstName(data.firstName);
  //     setLastName(data.lastName);
  //     setUsername(data.username);
  //     setPhone(data.phone);
  //     setProfilePicture(data.profilePicture);
  //   } catch (error) {
  //     console.error("Error fetching profile data:", error);
  //   }
  // };

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "Ananya");
      setLastName(user.lastName || "Garg");
      setUsername(user.username || "agarg379");
      setPhone(user.phone || "3464425302");
      setEmail("ananyagarg@gatech.edu"); // user.email can show the current User's email, so the issue only lies capturing name and phone number
      setProfilePicture(user.profilePicture || null);
    }
  }, [user]);

  const handleChangePassword = async () => {
    const uppercaseRegex = /[A-Z]/; // Check if password has at least one uppercase letter
    const numberRegex = /[0-9]/; // Check if password has at least one number
    const specialCharRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/; // Check if password has at least one special character

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match");
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

    try {
      const response = await fetch(
        "http://localhost:4000/api/auth/changePassword",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            currentPassword: currentPassword,
            newPassword: newPassword,
          }),
        }
      );
      const data = await response.json();
      if (data.message !== "Password changed successfully") {
        setError(data.message);
        return;
      }
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setError(null);
    } catch (error) {
      console.error("Error changing password:", error);
    }
  };

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setProfilePicture(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("profilePicture", file);

      try {
        const response = await fetch(
          "http://localhost:4000/api/auth/profile/picture",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: formData,
          }
        );
        const data = await response.json();
        console.log("Profile picture uploaded successfully");
      } catch (error) {
        console.error("Error uploading profile picture:", error);
      }
    }
  };

  return (
    <ProtectedRoute>
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <h1>My Profile</h1>
        {user ? (
          <form>
            <div>
              <label>Profile Picture:</label>
              <img
                src={profilePicture || "/default-profile-picture.png"}
                alt="Profile Picture"
                className={styles.profilePicture}
              />
              <label
                htmlFor="profilePictureInput"
                className={styles.fileInputLabel}
              >
                Choose File
              </label>
              <input
                id="profilePictureInput"
                type="file"
                accept="image/*"
                onChange={handleProfilePictureUpload}
                style={{ display: "none" }}
              />
            </div>
            <div>
              {" "}
              <label>Name:</label>{" "}
              <p>
                {firstName} {lastName}
              </p>{" "}
            </div>{" "}
            <div>
              {" "}
              <label>Username:</label> <p>{username}</p>{" "}
            </div>{" "}
            <div>
              {" "}
              <label>Email:</label> <p>{email}</p>{" "}
            </div>{" "}
            <div>
              {" "}
              <label>Phone Number:</label> <p>{phone}</p>{" "}
            </div>
            <div>
              <h3>Change Password</h3>
              <div>
                <label>Current Password:</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div>
                <label>New Password:</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div>
                <label>Confirm Password:</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <p className={styles.errorMessage}>{showError && showError}</p>
              <button
                className={styles.loginButton}
                type="button"
                onClick={handleChangePassword}
              >
                Change Password
              </button>
            </div>
          </form>
        ) : (
          <p>Please log in to view your profile</p>
        )}
      </div>
    </div>
    </ProtectedRoute>
  );
};

export default userProfile;
