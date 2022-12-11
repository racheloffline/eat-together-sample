// Specify availabilities for days of the week

import React, { useState, useRef } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Layout, TextInput } from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";

import DateTimePickerModal from "react-native-modal-datetime-picker";
import RBSheet from "react-native-raw-bottom-sheet";

import LargeText from "../../../components/LargeText";
import MediumText from "../../../components/MediumText";
import NormalText from "../../../components/NormalText";
import Button from "../../../components/Button";
import SelectButton from "../../../components/SelectButton";
import Availability from "../../../components/Availability";

import getTime from "../../../getTime";
import moment from "moment";

const Availabilities = props => {
  // Preferred times for days of the week
  const [monday, setMonday] = useState([]);
  const [tuesday, setTuesday] = useState([]);
  const [wednesday, setWednesday] = useState([]);
  const [thursday, setThursday] = useState([]);
  const [friday, setFriday] = useState([]);
  const [saturday, setSaturday] = useState([]);
  const [sunday, setSunday] = useState([]);

  // For the bottom drawer
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(moment(new Date()).add(1, 'hours').toDate());
  const [showStartTime, setShowStartTime] = useState(false);
  const [showEndTime, setShowEndTime] = useState(false);
  const [daySelected, setDaySelected] = useState("Monday");

  const refRBSheet = useRef(); // To toggle the bottom drawer on/off

  // For selecting a start time
  const changeStartTime = (time) => {
    const currentTime = time || startTime;
    setStartTime(currentTime); // Set the date
    setShowStartTime(false); // Exit the date/time picker modal
  }

  // For selecting an end time
  const changeEndTime = (time) => {
    const currentTime = time || endTime;
    setEndTime(currentTime); // Set the date
    setShowEndTime(false); // Exit the date/time picker modal
  }

  // Adds eating time to UI
  const addTime = () => {
    if (startTime >= endTime) {
      alert("End time must be after start time!");
    } else {
      refRBSheet.current.close();

      switch (daySelected) {
        case "Monday":
          setMonday([...monday, { startTime: startTime, endTime: endTime }]);
          break;
        case "Tuesday":
          setTuesday([...tuesday, { startTime: startTime, endTime: endTime }]);
          break;
        case "Wednesday":
          setWednesday([...wednesday, { startTime: startTime, endTime: endTime }]);
          break;
        case "Thursday":
          setThursday([...thursday, { startTime: startTime, endTime: endTime }]);
          break;
        case "Friday":
          setFriday([...friday, { startTime: startTime, endTime: endTime }]);
          break;
        case "Saturday":
          setSaturday([...saturday, { startTime: startTime, endTime: endTime }]);
          break;
        case "Sunday":
          setSunday([...sunday, { startTime: startTime, endTime: endTime }]);
          break;
      }
    }
  }

  // Delete a time slot
  const deleteTime = (index, day) => {
    switch (day) {
      case "Monday":
        setMonday(monday.filter((time, i) => i !== index));
        break;
      case "Tuesday":
        setTuesday(tuesday.filter((time, i) => i !== index));
        break;
      case "Wednesday":
        setWednesday(wednesday.filter((time, i) => i !== index));
        break;
      case "Thursday":
        setThursday(thursday.filter((time, i) => i !== index));
        break;
      case "Friday":
        setFriday(friday.filter((time, i) => i !== index));
        break;
      case "Saturday":
        setSaturday(saturday.filter((time, i) => i !== index));
        break;
      case "Sunday":
        setSunday(sunday.filter((time, i) => i !== index));
        break;
    }
  }

  return (
    <Layout style={styles.page}>
        <LargeText center size={28}>Preferred eating times!</LargeText>

        <Button
          marginVertical={10}
          onPress={() => refRBSheet.current.open()}>
            + Add preferred time
        </Button>

        <ScrollView contentContainerStyle={styles.dates}>
          <View style={styles.day}>
            <MediumText>Monday</MediumText>
            {monday.length === 0 ? <NormalText>None</NormalText>
            : <View style={styles.timeSlots}>
              {monday.map((time, index) => <Availability time={time} index={index} delete={() => deleteTime(index, "Monday")}/>)}
            </View>}
          </View>

          <View style={styles.day}>
            <MediumText>Tuesday</MediumText>
            {tuesday.length === 0 ? <NormalText>None</NormalText>
            : <View style={styles.timeSlots}>
              {tuesday.map((time, index) => <Availability time={time} index={index} delete={() => deleteTime(index, "Tuesday")}/>)}
            </View>}
          </View>
            
          <View style={styles.day}>
            <MediumText>Wednesday</MediumText>
            {wednesday.length === 0 ? <NormalText>None</NormalText>
            : <View style={styles.timeSlots}>
              {wednesday.map((time, index) => <Availability time={time} index={index} delete={() => deleteTime(index, "Wednesday")}/>)}
            </View>}
          </View>

          <View style={styles.day}>
            <MediumText>Thursday</MediumText>
            {thursday.length === 0 ? <NormalText>None</NormalText>
            : <View style={styles.timeSlots}>
              {thursday.map((time, index) => <Availability time={time} index={index} delete={() => deleteTime(index, "Thursday")}/>)}
            </View>}
          </View>

          <View style={styles.day}>
            <MediumText>Friday</MediumText>
            {friday.length === 0 ? <NormalText>None</NormalText>
            : <View style={styles.timeSlots}>
              {friday.map((time, index) => <Availability time={time} index={index} delete={() => deleteTime(index, "Friday")}/>)}
            </View>}
          </View>

          <View style={styles.day}>
            <MediumText>Saturday</MediumText>
            {saturday.length === 0 ? <NormalText>None</NormalText>
            : <View style={styles.timeSlots}>
              {saturday.map((time, index) => <Availability time={time} index={index} delete={() => deleteTime(index, "Saturday")}/>)}
            </View>}
          </View>

          <View style={styles.day}>
            <MediumText>Sunday</MediumText>
            {sunday.length === 0 ? <NormalText>None</NormalText>
            : <View style={styles.timeSlots}>
              {sunday.map((time, index) => <Availability time={time} index={index} delete={() => deleteTime(index, "Sunday")}/>)}
            </View>}
          </View>
        </ScrollView>

        <RBSheet
            height={400}
            ref={refRBSheet}
            closeOnDragDown={true}
            closeOnPressMask={false}
            customStyles={{
                wrapper: {
                    backgroundColor: "rgba(0,0,0,0.5)",
                },
                draggableIcon: {
                    backgroundColor: "#5DB075"
                },
                container: {
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    padding: 10
                }
            }}>
            <View style={styles.row}>
                <TouchableOpacity onPress={() => setShowStartTime(true)} style={styles.smallInput}>
                    <NormalText center>Start time</NormalText>
                    <View pointerEvents="none">
                        <TextInput
                            value={getTime(startTime)}
                            leftContent={
                                <Ionicons name="time-outline" size={20}/>
                            }
                            editable={false}
                        />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setShowEndTime(true)} style={styles.smallInput}>
                    <View pointerEvents="none">
                        <NormalText center>End time</NormalText>
                        <TextInput
                            value={getTime(endTime)}
                            leftContent={
                                <Ionicons name="time-outline" size={20}/>
                            }
                            editable={false}
                        />
                    </View>
                </TouchableOpacity>
            </View>

            <View style={styles.row}>
              <SelectButton selected={daySelected === "Monday"} onPress={() => setDaySelected("Monday")}>M</SelectButton>
              <SelectButton selected={daySelected === "Tuesday"} onPress={() => setDaySelected("Tuesday")}>Tu</SelectButton>
              <SelectButton selected={daySelected === "Wednesday"} onPress={() => setDaySelected("Wednesday")}>W</SelectButton>
              <SelectButton selected={daySelected === "Thursday"} onPress={() => setDaySelected("Thursday")}>Th</SelectButton>
              <SelectButton selected={daySelected === "Friday"} onPress={() => setDaySelected("Friday")}>F</SelectButton>
              <SelectButton selected={daySelected === "Saturday"} onPress={() => setDaySelected("Saturday")}>Sa</SelectButton>
              <SelectButton selected={daySelected === "Sunday"} onPress={() => setDaySelected("Sunday")}>Su</SelectButton>
            </View>

            <Button marginVertical={20} onPress={addTime}>Add time</Button>
        </RBSheet>

        <DateTimePickerModal isVisible={showStartTime} date={startTime}
            mode="time" onConfirm={changeStartTime} onCancel={() => setShowStartTime(false)}/>
        <DateTimePickerModal isVisible={showEndTime} date={endTime}
            mode="time" onConfirm={changeEndTime} onCancel={() => setShowEndTime(false)}/>

        <View style={styles.buttons}>
          <Button onPress={() => props.navigation.goBack()}
            marginHorizontal={10}>Back</Button>
          <Button onPress={() => props.navigation.navigate("Email")}
            marginHorizontal={10}>Next</Button>
        </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40
  },

  dates: {
    justifyContent: "center",
  },

  day: {
    marginBottom: 15
  },

  timeSlots: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  buttons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center"
  },

  row: {
      marginTop: 10,
      flexDirection: "row",
      justifyContent: "space-between"
  },

  smallInput: {
      width: "48%"
  },
});

export default Availabilities;