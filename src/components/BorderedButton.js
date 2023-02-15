import React from "react";
import { TouchableOpacity } from "react-native";
import MediumText from "./MediumText";

const BorderedButton = props => {
    return (
        <TouchableOpacity style={{
            backgroundColor: "white",
            borderColor: props.color ? props.color : "#5DB075",
            borderWidth: props.borderWidth ? props.borderWidth : 2,
            borderRadius: 10,
            paddingHorizontal: props.paddingHorizontal ? props.paddingHorizontal : 40,
            paddingVertical: props.paddingVertical ? props.paddingVertical : 15,
            opacity: props.disabled ? 0.7 : 1,
            width: props.width ? props.width : "auto",
            marginHorizontal: props.marginHorizontal ? props.marginHorizontal : 0,
            marginVertical: props.marginVertical ? props.marginVertical : 0,
            elevation: 5
        }} onPress={props.onPress} disabled={props.disabled}>
            <MediumText color={props.color ? props.color : "#5DB075"} center
                size={props.fontSize ? props.fontSize : 20}>
                    {props.children}
            </MediumText>
        </TouchableOpacity>
    );
}

export default BorderedButton;