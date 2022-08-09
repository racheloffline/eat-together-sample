import React from "react";
import { TouchableOpacity } from "react-native";
import NormalText from "./NormalText";

const Link = props => {
    return (
        <TouchableOpacity onPress={props.onPress} disabled={props.disabled}>
            <NormalText color="#0398fc"
                size={props.size ? props.size : null} center>{props.children}</NormalText>
        </TouchableOpacity>
    );
}

export default Link;