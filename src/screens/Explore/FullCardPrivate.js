//Functionality TDB, most likely to be used to implement ice-breaker games

import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TouchableOpacity
} from "react-native";
import {
  Layout,
  TopNav
} from "react-native-rapi-ui";
import { Ionicons, Feather } from "@expo/vector-icons";

import DarkContainer from "../../components/DarkContainer";
import Attendance from "../../components/Attendance";
import Icebreaker from "../../components/Icebreaker";

import LargeText from "../../components/LargeText";
import MediumText from "../../components/MediumText";

import { db, storage, auth } from "../../provider/Firebase";
import * as firebase from "firebase";

const FullCard = ({ route, navigation }) => {
  // Data for the attendees
  const [attendees, setAttendees] = useState(new Array(route.params.event.attendees.length).fill(false));
  const [people, setPeople] = useState([]);

  // For tracking opening and closing
  const [openAttendance, setOpenAttendance] = useState(false);
  const [openIcebreakers, setOpenIcebreakers] = useState(false);
  const [image, setImage] = useState(""); // Background image

  // List of icebreaker questions
  const [icebreakers, setIcebreakers] = useState([]);

  const user = auth.currentUser;

  useEffect(() => {
    fetchIcebreakers();

    if (route.params.event.hasImage) {
      storage.ref("eventPictures/" + route.params.event.id).getDownloadURL().then(uri => {
        setImage(uri);
      }).then(() => {
        if (route.params.event.hostID === user.uid) {
          getAttendees();
        }
      });
    } else if (route.params.event.hostID === user.uid) {
      getAttendees();
    }
  }, []);

  const markAttendee = index => {
    let newAttendees = [...attendees];
    newAttendees[index] = !newAttendees[index];
    setAttendees(newAttendees);

    const storeID = {
      type: route.params.event.type,
      id: route.params.event.id
    };

    db.collection("Users").doc(people[index].id).update({
      attendedEventIDs: newAttendees[index] ? firebase.firestore.FieldValue.arrayUnion(storeID)
        : firebase.firestore.FieldValue.arrayRemove(storeID)
    });
  }

  const fetchIcebreakers = () => {
    db.collection("Icebreakers").doc("icebreakers").get().then(doc => {
      setIcebreakers(doc.data().icebreakers);
    });
  }

  const getAttendees = () => {
    let newPeople = [];

    route.params.event.attendees.forEach((attendee, index) => {
      db.collection("Users").doc(attendee).get().then(doc => {
        const data = doc.data();

        if (data.attendedEventIDs.includes(route.params.event.id)) {
          let newAttendees = attendees;
          newAttendees[index] = true;
          setAttendees(newAttendees);
        }

        if (data.hasImage) {
          storage.ref("profilePictures/" + data.id).getDownloadURL().then(uri => {
            data.image = uri;
          }).then(() => setPeople(people => ([...people, data])));
        } else {
          setPeople(people => ([...people, data]));
        }
      });
    });
  }

  return (
    <Layout>
      <TopNav
        middleContent={
          <MediumText center>{route.params.event.name}</MediumText>
        }
        leftContent={
          <Ionicons
            name="chevron-back"
            size={20}
          />
        }
        leftAction={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.page}>
        <ImageBackground source={image ? {uri: image} : require("../../../assets/foodBackground.png")}
          style={styles.imageBackground} resizeMode="cover">

        {route.params.event.hostID === user.uid && <DarkContainer>
            <LargeText color="white">Attendance</LargeText>
            {openAttendance && <View>
              {people.map((person, index) => 
                <Attendance person={person} key={person.id}
                  attending={attendees[index]} onPress={() => markAttendee(index)}/>)}
            </View>}

            <TouchableOpacity onPress={() => 
              setOpenAttendance(!openAttendance)}>
              <Feather name={!openAttendance ? "chevrons-down" : "chevrons-up"} size={50} color="white"/>
            </TouchableOpacity>
          </DarkContainer>}

          <DarkContainer>
            <LargeText color="white">Icebreakers</LargeText>

            <View style={styles.icebreakers}>
              {openIcebreakers && icebreakers.map((ice, index) => 
                <Icebreaker number={index+1} icebreaker={ice} key={index}/>)}
            </View>
            
            <TouchableOpacity onPress={() => 
              setOpenIcebreakers(!openIcebreakers)}>
              <Feather name={!openIcebreakers ? "chevrons-down" : "chevrons-up"} size={50} color="white"/>
            </TouchableOpacity>
          </DarkContainer>
        </ImageBackground>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
    page: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 10
    },

    imageBackground: {
      width: Dimensions.get('screen').width,
      height: "100%",
      alignItems: "center",
    },

    icebreakers: {
      textAlign: "left"
    }
});

export default FullCard;