//Authenticates usernames and passwords using firebase implementation

import React, { createContext, useState, useEffect } from 'react';
import * as firebase from 'firebase';
const AuthContext = createContext();

const AuthProvider = (props) => {
	// user null = loading
	const [user, setUser] = useState(null);
	const [currUser, setCurrUser] = useState(null);

	useEffect(() => {
		checkLogin();
	}, []);

	function checkLogin() {
		firebase.auth().onAuthStateChanged(function (u) {
			if (u) {
				setUser(true);
				setCurrUser(u);
				// getUserData();
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
				currUser
			}}
		>
			{props.children}
		</AuthContext.Provider>
	);
};

export { AuthContext, AuthProvider };
