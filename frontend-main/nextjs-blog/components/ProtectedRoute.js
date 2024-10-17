import { useRouter } from 'next/router';
import { useEffect, useContext } from 'react';
import { onAuthStateChanged } from "firebase/auth"
import { app } from '../auth/firebase';
import { getAuth } from 'firebase/auth';
import { AuthContext } from '../contexts/AuthContext';




const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const currentUser = useContext(AuthContext);
  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(app), (user) => {
        if (!user) {
            
            router.push('/Login'); // Redirect to LandingPage if login successfully
        }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return <>{children}</>;
};

export default ProtectedRoute;