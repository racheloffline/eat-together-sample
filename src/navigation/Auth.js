import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";

//Login and forgot password pages
import Login from "../screens/auth/Login";
import ForgetPassword from "../screens/auth/ForgetPassword";

// Sign-up pages
import Name from "../screens/auth/Registration/Name";
import Email from "../screens/auth/Registration/Email";
import Availabilities from "../screens/auth/Registration/Availabilities";
import Password from "../screens/auth/Registration/Password";

import Monday from '../screens/auth/Registration/Days/Monday';
import Tuesday from '../screens/auth/Registration/Days/Tuesday';
import Wednesday from '../screens/auth/Registration/Days/Wednesday';
import Thursday from '../screens/auth/Registration/Days/Thursday';
import Friday from '../screens/auth/Registration/Days/Friday';
import Saturday from '../screens/auth/Registration/Days/Saturday';
import Sunday from '../screens/auth/Registration/Days/Sunday';
import timeSlots from '../screens/auth/Registration/Days/timeSlots';

import { cloneDeep } from "lodash";
import {db, auth, storage} from "../provider/Firebase";

const Stack = createStackNavigator();
const Auth = () => {
    // Name.js
    const [name, setName] = useState("");
    const [quote, setQuote] = useState("");
    const [image, setImage] = useState("");
    const [tags, setTags] = useState([]);

    // Email.js
    const [email, setEmail] = useState("");

    // Days
    const [monday, setMonday] = useState(cloneDeep(timeSlots));
    const [tuesday, setTuesday] = useState(cloneDeep(timeSlots));
    const [wednesday, setWednesday] = useState(cloneDeep(timeSlots));
    const [thursday, setThursday] = useState(cloneDeep(timeSlots));
    const [friday, setFriday] = useState(cloneDeep(timeSlots));
    const [saturday, setSaturday] = useState(cloneDeep(timeSlots));
    const [sunday, setSunday] = useState(cloneDeep(timeSlots));

    // Password
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // List of all emails and usernames
    const [emails, setEmails] = useState([]);
    const [usernames, setUsernames] = useState([]);

    useEffect(() => {
        db.collection("Users").get().then(querySnapshot => {
            let emailList = [];
            let usernameList = [];

            querySnapshot.forEach(doc => {
                emailList.push(doc.data().email);
                usernameList.push(doc.data().username);
            });

            setEmails(emailList);
            setUsernames(usernameList);
        });
    }, []);

    const createUser = async () => {
        setLoading(true);

        if (usernames.includes(username)) {
            setLoading(false);
            alert("Your username has already been picked. Choose another one :(");
        } else {
            try {
                const response = await auth.createUserWithEmailAndPassword(email, password);
    
                if (response.user.uid) {
                    const { uid } = response.user;
    
                    const userData = {
                        id: uid,
                        name,
                        username,
                        email,
                        hasImage: image !== "",
                        tags,
                        quote,
                        hostedEventIDs: [],
                        attendingEventIDs: [],
                        friendIDs: [],
                        availabilites: {
                            monday,
                            tuesday,
                            wednesday,
                            thursday,
                            friday,
                            saturday,
                            sunday
                        },
                        settings: {
                            notifications: true
                        },
                        eventsSignedUp: 0,
                        eventsAttended: 0
                    }
                    
                    db.collection("Users").doc(`${uid}`).set(userData);
    
                    if (image !== "") {
                        storeImage(image, uid);
                    }

                    response.user.sendEmailVerification();
                }
            } catch (error) {
                alert(error.message);
                setLoading(false);
            }
        }
    }

    const storeImage = async (uri, id) => {
        const response = await fetch(uri);
        const blob = await response.blob();

        var ref = storage.ref().child("profilePictures/" + id);
        return ref.put(blob);
    }

    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="ForgetPassword" component={ForgetPassword} />

        <Stack.Screen name="Name" options={{headerShown: false}}>
            {props => <Name {...props} name={name} setName={setName} quote={quote}
                setQuote={setQuote} image={image} setImage={setImage}
                tags={tags} setTags={setTags}/>}
        </Stack.Screen>
        <Stack.Screen name="Email" options={{headerShown: false}}>
            {props => <Email {...props} email={email} setEmail={setEmail} emails={emails}/>}
        </Stack.Screen>
        <Stack.Screen name="Availabilities" options={{headerShown: false}} component={Availabilities}/>
        <Stack.Screen name="Monday" options={{headerShown: false}}>
            {props => <Monday {...props} times={monday} setTimes={setMonday}/>}
        </Stack.Screen>
        <Stack.Screen name="Tuesday" options={{headerShown: false}}>
            {props => <Tuesday {...props} times={tuesday} setTimes={setTuesday}/>}
        </Stack.Screen>
        <Stack.Screen name="Wednesday" options={{headerShown: false}}>
            {props => <Wednesday {...props} times={wednesday} setTimes={setWednesday}/>}
        </Stack.Screen>
        <Stack.Screen name="Thursday" options={{headerShown: false}}>
            {props => <Thursday {...props} times={thursday} setTimes={setThursday}/>}
        </Stack.Screen>
        <Stack.Screen name="Friday" options={{headerShown: false}}>
            {props => <Friday {...props} times={friday} setTimes={setFriday}/>}
        </Stack.Screen>
        <Stack.Screen name="Saturday" options={{headerShown: false}}>
            {props => <Saturday {...props} times={saturday} setTimes={setSaturday}/>}
        </Stack.Screen>
        <Stack.Screen name="Sunday" options={{headerShown: false}}>
            {props => <Sunday {...props} times={sunday} setTimes={setSunday}/>}
        </Stack.Screen>

        <Stack.Screen name="Password" options={{headerShown: false}}>
            {props => <Password {...props} username={username} setUsername={setUsername}
                password={password} setPassword={setPassword} createUser={createUser}
                loading={loading}/>}
        </Stack.Screen>
      </Stack.Navigator>
    );
};

export default Auth;