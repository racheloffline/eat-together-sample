import React from "react";
import { View } from "react-native";

const Divider = props => {
    return (
        <View style={{
            width: props.width ? props.width : "100%",
            borderColor: "#5DB075",
            borderWidth: 2,
            marginVertical: 20,
            justifyContent: props.center ? "center" : "flex-start"
        }}/>
    );
}

export default Divider;