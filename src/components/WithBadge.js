import React from "react";
import { StyleSheet, View } from "react-native";
import {Ionicons} from "@expo/vector-icons";

const styles = StyleSheet.create({
    icon: {
        width: 50,
        height: 50,
        marginRight: 20
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
        <Ionicons name = {whichIcon()[0]} color = {whichIcon()[1]} size = {100}/>
    );
  }

export default WithBadge;