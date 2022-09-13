// FOR JOSH: page for editing availabilities, figure out how to pass data as props btw AvailabilitiesHome and this component

import React, { useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Layout } from "react-native-rapi-ui";
import { cloneDeep } from "lodash";

import Button from "../../../components/Button";
import Times from "../../../components/Times";
import LargeText from "../../../components/LargeText";

const EditDay = props => {
    const oldTimes = cloneDeep(props.route.params.times);
    const [times, setTimes] = useState(props.route.params.times);

    const clickTime = index => {
      const newTimes = cloneDeep(times);
      newTimes[index].available = !newTimes[index].available;
      setTimes(newTimes);
    }

    return (
        <Layout style={styles.page}>
            <LargeText center>What times would like to eat on {props.route.params.day}?</LargeText>

            <Times times={times} change={clickTime}/>

            <View style={styles.buttons}>
                <Button onPress={() => {
                  props.route.params.setTimes(oldTimes);
                  props.navigation.goBack();
                }}
                  marginHorizontal={10}>
                  Cancel
                </Button>
                <Button onPress={() => {
                  props.route.params.setTimes(times);
                  props.route.params.saveAvailabilities(props.route.params.day, times);
                  props.navigation.goBack();
                  alert("New times saved!");
                }} marginHorizontal={10}>
                  Save!
                </Button>
            </View>
        </Layout>
    );
}

const styles = StyleSheet.create({
    page: {
      alignItems: "center",
      width: Dimensions.get('screen').width,
      paddingHorizontal: 20,
      paddingVertical: 50
    },
  
    buttons: {
      marginTop: 50,
      display: "flex",
      flexDirection: "row",
      justifyContent: "center"
    }
  });
  

export default EditDay;

