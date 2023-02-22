import React from "react";
import LargeText from "./LargeText";
import NormalText from "./NormalText";
import { View, Image } from "react-native";

const EmptyState = props => {
    return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Image source={require("../../assets/empty-state.png")} style={{ width: 200, height: 200, alignSelf: "center" }} />
          <LargeText center>{props.title}</LargeText>
          <NormalText center>{props.text}</NormalText>
        </View>
    );
}

export default EmptyState;