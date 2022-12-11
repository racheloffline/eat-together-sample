import React from "react";
import { View, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import NormalText from "./NormalText";
import getTime from "../getTime";

const Availability = props => {
    return (
        <View style={{
            flexDirection: "row",
            justifyContent: "space-between",
            borderRadius: 5,
            backgroundColor: "white",
            padding: 5,
            marginRight: 5,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 5,
            elevation: 5
        }}>
            <NormalText size={12}>{getTime(props.time.startTime)} - {getTime(props.time.endTime)}</NormalText>
            <TouchableOpacity onPress={props.delete}>
                <Ionicons name="trash" size={20} color="black" />
            </TouchableOpacity>
        </View>
    );
}

export default Availability;