import React from "react";
import { TouchableOpacity } from "react-native";
import { backgroundColor } from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";
import MediumText from "./MediumText";

const Button = props => {
    return (
        <TouchableOpacity style={{
            backgroundColor: props.backgroundColor ? props.backgroundColor : "#5DB075",
            borderRadius: 10,
            paddingHorizontal: props.paddingHorizontal ? props.paddingHorizontal : 40,
            paddingVertical: props.paddingVertical ? props.paddingVertical : 15,
            opacity: props.disabled ? 0.7 : 1,
            width: props.width ? props.width : "auto",
            marginHorizontal: props.marginHorizontal ? props.marginHorizontal : 0,
            marginVertical: props.marginVertical ? props.marginVertical : 0,
            elevation: 5
        }} onPress={props.onPress} disabled={props.disabled}>
            <MediumText color={props.color ? props.color : "white"} center
                size={props.fontSize ? props.fontSize : 20}>
                    {props.children}
            </MediumText>
        </TouchableOpacity>
    );
}

export default Button;