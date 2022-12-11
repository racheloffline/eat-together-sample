import React from "react";
import { TouchableOpacity } from "react-native";
import NormalText from "./NormalText";

const SelectButton = props => {
    return (
        <TouchableOpacity style={{
            backgroundColor: props.selected ? "#5DB075" : "white",
            borderColor: props.selected ? "none" : "black",
            borderWidth: props.selected ? 0 : 1,
            borderRadius: props.width ? props.width / 2 : 20,
            opacity: props.disabled ? 0.7 : 1,
            width: props.width ? props.width : 40,
            height: props.height ? props.height : 40,
            marginHorizontal: props.marginHorizontal ? props.marginHorizontal : 0,
            marginVertical: props.marginVertical ? props.marginVertical : 0,
            alignItems: "center",
            justifyContent: "center",
        }} onPress={props.onPress} disabled={props.disabled}>
            <NormalText color={props.selected ? "white" : "black"}>{props.children}</NormalText>
        </TouchableOpacity>
    );
}

export default SelectButton;