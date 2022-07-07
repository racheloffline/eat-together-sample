import React from "react";
import { View } from "react-native";
import Checkbox from "./Checkbox";
import NormalText from "./NormalText";

const Filter = props => {
    return (
        <View style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginTop: 10
        }}>
            <Checkbox checked={props.checked} onPress={props.onPress}/>
            <NormalText>{props.text}</NormalText>
        </View>
    );
}

export default Filter;