import React from "react";
import { TouchableOpacity } from "react-native";
import { backgroundColor } from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";
import MediumText from "./MediumText";

const Button = props => {
    return (
        <TouchableOpacity style={{
            backgroundColor: props.backgroundColor ? props.backgroundColor : "#5DB075",
            borderRadius: 100,
            paddingHorizontal: props.paddingHorizontal ? props.paddingHorizontal : 40,
            paddingVertical: props.paddingVertical ? props.paddingVertical : 15,
            opacity: props.disabled ? 0.7 : 1,
            marginHorizontal: props.marginHorizontal ? props.marginHorizontal : 0,
            marginVertical: props.marginVertical ? props.marginVertical : 0,
            shadowColor: "#000000",
            shadowOpacity: 0.25,
            shadowOffset: {
                width: 0, 
                height: 4
            },
            elevation: 5,
        }} onPress={props.onPress} disabled={props.disabled}>
            <MediumText color="white" center>{props.children}</MediumText>
        </TouchableOpacity>
    );
}

export default Button;