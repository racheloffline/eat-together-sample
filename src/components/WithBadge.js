import React from "react";
import { StyleSheet, View } from "react-native";
import {Ionicons} from "@expo/vector-icons";

const styles = StyleSheet.create({
    icon: {
        position: "absolute",
        right: 295,
        top: 60,
    },

    image: {
        width: 175,
        height: 175,
        borderColor: "white",
        borderWidth: 3,
        borderRadius: 100,
        backgroundColor: "white",
      },
});

const WithBadge = props => {

    //Choose which icon to display
    const whichIcon = () => {
        if(props.mealsSignedUp >= 50) {
            return ["arrow-round-up", "gold"];
        } else if(props.mealsSignedUp >= 10) {
            if(props.mealsAttended >= 0.75) {
                return ["checkmark-circle", "green"];
            } else {
                return ["close-circle", "red"];
            }
        } else {
            return ["pause", "blue"];
        }
    }

    //Return the actual icon
    return (
        <View style={styles.icon}>
          <Ionicons
            name={whichIcon()[0]}
            color={whichIcon()[1]}
            size={80}
          ></Ionicons>
        </View>
    );
  }

export default WithBadge;