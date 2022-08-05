// TODO: Josh | You will need to edit this file
// hello

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
import NormalText from "../../components/NormalText";
import HorizontalRow from "../../components/HorizontalRow"

import { db, storage, auth } from "../../provider/Firebase";
import * as firebase from "firebase";
import {Menu, MenuOption, MenuOptions, MenuTrigger} from "react-native-popup-menu";

const FullCard = ({ route, navigation }) => {
  // Data for the attendees
  const [attendees, setAttendees] = useState(new Array(route.params.event.attendees.length).fill(false));
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(false);

  // For tracking opening and closing
  const [openAttendance, setOpenAttendance] = useState(false);
  const [openIcebreakers, setOpenIcebreakers] = useState(false);
  const [image, setImage] = useState(""); // Background image

  // List of icebreaker questions
  const [icebreakers, setIcebreakers] = useState([]);

  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState(0);

  // Get the current user
  const user = auth.currentUser;

  useEffect(() => {
    if(icebreakers.length === 0) {
        fetchIcebreakers();
    }

    if (route.params.event.hostID === user.uid) {
      getAttendees();
    }

    if(location === "") {
        assignEventDetails();
    }
  }, []);

  const assignEventDetails =() => {
      console.log("assigning event details");
      const eventID = route.params.event.id;

      db.collection("Private Events").doc(eventID).get().then(doc => {
        setLocation(doc.data().location);

// converts Date object to String object
        const dateInfo = doc.data().date.toDate();
        const eventDay = dateInfo.toDateString().substring(4);
        const eventStartHour = parseInt(dateInfo.toTimeString().substring(0,2));

        setDate(eventDay);
        setTime(eventStartHour);
      });
  }

  // Mark an attendee absent or present
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

  // TODO: JOSH | Randomize this
  // Fetch icebreaker questions from FIREBASE
  const fetchIcebreakers = () => {

      const eventID = route.params.event.id;

      db.collection("Private Events").doc(eventID).get().then(doc => {
        setIcebreakers(doc.data().ice);
        console.log('icebreakers:');
        console.log(doc.data().ice);
      })
  }

  // Fetch all attendees of this event
  const getAttendees = () => {
    route.params.event.attendees.forEach((attendee, index) => {
      if (attendee !== user.uid) {
        db.collection("Users").doc(attendee).get().then(doc => {
          const data = doc.data();
  
          const ids = data.attendedEventIDs.map(e => e.id);
          if (ids.includes(route.params.event.id)) {
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
      }
    });
  }

  //Delete the event; this is the old action
  function withdraw() {
    if (!loading) {
      setLoading(true);
      route.params.deleteEvent(route.params.event.id);

      const storeID = {
        type: route.params.event.type,
        id: route.params.event.id
      };

      db.collection("Users").doc(user.uid).update({
        attendingEventIDs: firebase.firestore.FieldValue.arrayRemove(storeID)
      }).then(() => {
        if(route.params.event.type === "private") {
          db.collection("Private Events").doc(route.params.event.id).update({
            attendees: firebase.firestore.FieldValue.arrayRemove(user.uid)
          }).then(() => {
            alert("You withdrew from the event");
            navigation.goBack();
          });
        } else {
          db.collection("Public Events").doc(route.params.event.id).update({
            attendees: firebase.firestore.FieldValue.arrayRemove(user.uid)
          }).then(() => {
            alert("You withdrew from the event");
            navigation.goBack();
          });
        }
      });
    }
  }

  //Archive the event
  function archiveEvent() {
    if (!loading) {
      setLoading(true);
      route.params.deleteEvent(route.params.event.id);

      const storeID = {
        type: route.params.event.type,
        id: route.params.event.id
      };

      db.collection("Users").doc(user.uid).update({
        attendingEventIDs: firebase.firestore.FieldValue.arrayRemove(storeID),
        archivedEventIDs: firebase.firestore.FieldValue.arrayUnion(storeID)
      });
    }
  }

  //Reporting event function
  function reportEvent() {
    navigation.navigate("ReportEvent", {
      eventID: route.params.event.id
    })
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
            color = {loading ? "grey" : "black"}
            size={20}
          />
        }
        leftAction={() => navigation.goBack()}
        rightContent={
          <View>
            <Menu>
              <MenuTrigger>
                <Ionicons
                    name = "ellipsis-horizontal"
                    color = {loading ? "grey" : "black"}
                    size = {20}
                />
              </MenuTrigger>
              <MenuOptions>
                <MenuOption onSelect={() => reportEvent()}>
                  <NormalText size = {18}>Report Event</NormalText>
                </MenuOption>
                <MenuOption onSelect={() => archiveEvent()}>
                  <NormalText size = {18}>Archive Event</NormalText>
                </MenuOption>
                <MenuOption onSelect={() => withdraw()}>
                  <NormalText size = {18} color = "red">Withdraw</NormalText>
                </MenuOption>
              </MenuOptions>
            </Menu>
          </View>
        }
      />

      <ScrollView contentContainerStyle={styles.page}>
      {/* not sure how to remove the giant vertical margin underneath the background image right now */}
        <ImageBackground source={route.params.event.hasImage ? {uri: route.params.event.image}
          : require("../../../assets/foodBackground.png")}
          style={styles.imageBackground} resizeMode="cover">
        </ImageBackground>

        <LargeText marginBottom={10} color="Black">{route.params.event.name} (that is event title)</LargeText>

        <NormalText color="black"> Hosted by you </NormalText>

        {/* 3 event details (location, date, time} are below */}

        <HorizontalRow horizontal={false}>
            <Ionicons
                name="location-sharp"
                size={20}
            />
            <NormalText color="black">{location}</NormalText>
        </HorizontalRow>

        <HorizontalRow horizontal={false}>
            <Ionicons
                name="calendar-outline"
                size={20}
            />
            <NormalText color="black">{date}</NormalText>
        </HorizontalRow>

        <HorizontalRow horizontal={false}>
            <Ionicons
                name="time-outline"
                size={20}
            />
            <NormalText color="black">{time%12} {(time < 12 ? "am" : "pm")}</NormalText>
        </HorizontalRow>


        {/* Icebreakers dropdown */}

        <HorizontalRow horizontal={false}>
            <TouchableOpacity onPress={() =>
              setOpenIcebreakers(!openIcebreakers)}>
              <Ionicons name={!openIcebreakers ? "caret-forward-sharp" : "caret-down-sharp"} size={20} color="black"/>
            </TouchableOpacity>

            <MediumText color="black">Icebreakers</MediumText>

        {/* icebreakers currently not showing on tap*/}
          {openIcebreakers && <View style={{marginTop: 20}}>
               {icebreakers.map((ice, index) =>
                               <Icebreaker number={index+1} icebreaker={ice}
                                 key={index}/>)}
           </View>}

           {/* <View style={styles.icebreakers}>
              {openIcebreakers && icebreakers.map((ice, index) =>
                <Icebreaker number={index+1} icebreaker={ice} key={index}/>)}
            </View> */}
        </HorizontalRow>

        {/* Attendance dropdown */}
        <HorizontalRow horizontal={false}>
            <TouchableOpacity onPress={() =>
              setOpenAttendance(!openAttendance)}>
              <Ionicons name={!openAttendance ? "caret-forward-sharp" : "caret-down-sharp"} size={20} color="black"/>
            </TouchableOpacity>

           <MediumText color="black">Attendance</MediumText>
           {openAttendance && <View style={{marginTop: 20}}>
               {people.length === 0 ? <NormalText color="black">{"Just yourself ;)"}</NormalText>
                             : people.map((person, index) =>
                               <Attendance person={person} key={person.id}
                                 attending={attendees[index]} onPress={() => markAttendee(index)}/>)}
           </View>}
        </HorizontalRow>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
    page: {
      flex: 1,
      alignItems: "center",
      justifyContent: "left",
      paddingHorizontal: 10
    },


    imageBackground: {
      width: Dimensions.get('screen').width,
      height: "50%",
      alignItems: "center",
    },

    icebreakers: {
      textAlign: "left"
    }

});

export default FullCard;