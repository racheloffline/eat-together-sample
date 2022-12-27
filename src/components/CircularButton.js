import React from "react";
import { TouchableOpacity } from "react-native";

const CircularButton = props => {
    return (
        <TouchableOpacity style={{
            backgroundColor: props.backgroundColor ? props.backgroundColor : "#5DB075",
            borderRadius: props.width ? props.width / 2 : 30,
            opacity: props.disabled ? 0.7 : 1,
            width: props.width ? props.width : 60,
            height: props.height ? props.height : 60,
            marginHorizontal: props.marginHorizontal ? props.marginHorizontal : 0,
            marginVertical: props.marginVertical ? props.marginVertical : 0,
            elevation: 5,
            zIndex: 10,
            alignItems: "center",
            justifyContent: "center",
        }} onPress={props.onPress} disabled={props.disabled}>
            {props.children}
        </TouchableOpacity>
    );
}

export default CircularButton;