import React from "react";
import { View, ActivityIndicator } from "react-native";
import MediumText from "./MediumText";

const LoadingView = props => {
    return (
        <View style={{ flex: 1, justifyContent: "center" }}>
            <ActivityIndicator size={100} color="#5DB075" />
            <MediumText center>Hang tight ...</MediumText>
        </View>
    );
}

export default LoadingView;