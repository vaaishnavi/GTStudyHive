import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import firebase from '../auth/firebase.js';

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const auth = getAuth(firebase.app);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [auth]);

    return (
        <AuthContext.Provider value={currentUser}>
            {children}
        </AuthContext.Provider>
    );
};