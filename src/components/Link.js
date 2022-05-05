import React from "react";
import { TouchableOpacity } from "react-native";
import SmallText from "./SmallText";

const Link = props => {
    return (
        <TouchableOpacity onPress={props.onPress} disabled={props.disabled}>
            <SmallText color="#0398fc" size={props.size ? props.size : null}>{props.children}</SmallText>
        </TouchableOpacity>
    );
}

export default Link;