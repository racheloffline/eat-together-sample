//Authenticates usernames and passwords using firebase implementation

import React, { createContext, useState, useEffect } from "react";
import * as firebase from "firebase";
import { db } from "../provider/Firebase";
const AuthContext = createContext();

const AuthProvider = (props) => {
  // user null = loading
  const [user, setUser] = useState(null);
  const [currUser, setCurrUser] = useState(null);
  const [profileImageUri, setProfileImageUri] = useState(
    "https://static.wixstatic.com/media/d58e38_29c96d2ee659418489aec2315803f5f8~mv2.png"
  );

  useEffect(() => {
    checkLogin();
  }, []);

  function getProfileUri(u) {
    db.collection("Users")
      .doc(u.uid)
      .get()
      .then((doc) => {
        if (doc.data().hasImage) {
          setProfileImageUri(doc.data().image);
        }
      });
  }
  function checkLogin() {
    firebase.auth().onAuthStateChanged(function (u) {
      if (u) {
        setUser(true);
        setCurrUser(u);
        getProfileUri(u);
      } else {
        setUser(false);
        setCurrUser(u);
        // setUserData(null);
      }
    });
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        currUser,
		    profileImageUri,
        updateProfileImg: image => setProfileImageUri(image)
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
