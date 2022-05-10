//Functionality TDB, most likely to be used to implement ice-breaker games

import React, { useState } from "react";
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

import LargeText from "../../components/LargeText";
import MediumText from "../../components/MediumText";
import NormalText from "../../components/NormalText";

const FullCard = ({ route, navigation }) => {
  const [attendees, setAttendees] = useState(new Array(route.params.event.attendees.length).fill(false));
  const [attendance, setAttendance] = useState(false);
  const [questions, setQuestions] = useState(false);

  const markAttendee = index => {
    let newAttendees = [...attendees];
    newAttendees[index] = !newAttendees[index];
    setAttendees(newAttendees);
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
        <ImageBackground source={{uri: route.params.event.image}} style={styles.imageBackground} resizeMode="cover">
        <DarkContainer>
            <LargeText color="white">Attendance</LargeText>
            {attendance && <View>
              {route.params.event.attendees.map((attendee, index) => 
                <Attendance person={attendee} key={attendee}
                  attending={attendees[index]} onPress={() => markAttendee(index)}/>)}
            </View>}

            <TouchableOpacity onPress={() => 
              setAttendance(!attendance)}>
              <Feather name={!attendance ? "chevrons-down" : "chevrons-up"} size={50} color="white"/>
            </TouchableOpacity>
          </DarkContainer>

          <DarkContainer>
            <LargeText color="white">Icebreakers</LargeText>
            {questions && <MediumText>Hi</MediumText>}

            <TouchableOpacity onPress={() => 
              setQuestions(!questions)}>
              <Feather name={!questions ? "chevrons-down" : "chevrons-up"} size={50} color="white"/>
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
});

export default FullCard;