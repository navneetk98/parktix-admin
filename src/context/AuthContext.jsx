import React, { createContext, useState, useEffect } from "react";
import { firebaseApp, firestore } from "../firebase";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    loggedInUser: null,
    loggedInUserProfileDoc: null,
    firstLoad: true
  });

  useEffect(() => {
    var authUnsubscribe = firebaseApp.auth().onAuthStateChanged(async user => {
      if (user) {
        const userProfileRef = firestore.collection('admin-profiles').doc(user.uid);
        let userProfile = await userProfileRef.get();

        if (!userProfile.exists) {
          await userProfileRef.set({ is_super_admin: false, phoneNumber: user.phoneNumber });
          userProfile = await userProfileRef.get();
        }
        const userProfileDoc = userProfile.data();

        setAuthState({ ...authState, loggedInUser: user, loggedInUserProfileDoc: userProfileDoc, firstLoad: false });
      } else {
        setAuthState({ ...authState, loggedInUser: null, loggedInUserProfileDoc: null, firstLoad: false });
      }
    });
    return () => {
      authUnsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
