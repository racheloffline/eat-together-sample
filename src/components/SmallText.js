import React from "react";
import { Text } from "react-native";
import { useFonts, Inter_200ExtraLight } from '@expo-google-fonts/inter';

const SmallText = props => {
    let [fontsLoaded] = useFonts({ Inter_200ExtraLight });

    if (!fontsLoaded) {
        return (
            <Text style={{
                fontSize: props.size ? props.size : 10,
                fontFamily: 'sans-serif',
                color: props.color ? props.color : "black",
                textAlign: props.center ? "center" : "auto",
            }}>
                {props.children}
            </Text>
        );
    }
    return (
        <Text style={{
            fontSize: props.size ? props.size : 10,
            fontFamily: 'Inter_200ExtraLight',
            color: props.color ? props.color : "black",
            textAlign: props.center ? "center" : "auto"
        }}>
            {props.children}
        </Text>
    );
}

export default SmallText;