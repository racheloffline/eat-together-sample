import React from "react";
import { View } from "react-native";

const Divider = props => {
    return (
        <View style={{
            width: props.width ? props.width : "100%",
            borderColor: props.color ? props.color : "#5DB075",
            borderWidth: 2,
            marginVertical: 10,
            justifyContent: props.center ? "center" : "flex-start"
        }}/>
    );
}

export default Divider;