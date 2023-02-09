import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import NormalText from "./NormalText";

const Toggle = props => {
    return (
        <TouchableOpacity onPress={props.onPress}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons
                    name={props.open ? "caret-down-sharp" : "caret-forward-sharp"}
                    size={20}
                    color="black"
                />
                <NormalText paddingHorizontal={7} size={17} color="black">
                    {props.title}
                </NormalText>
            </View>
        </TouchableOpacity>
    );
}

export default Toggle;