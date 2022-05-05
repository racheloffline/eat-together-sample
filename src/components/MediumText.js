import React from "react";
import { Text } from "react-native";
import { useFonts, Inter_600SemiBold } from '@expo-google-fonts/inter';

const MediumText = props => {
    let [fontsLoaded] = useFonts({ Inter_600SemiBold });

    if (!fontsLoaded) {
        return (
            <Text style={{
                fontSize: props.size ? props.size : 20,
                fontFamily: 'sans-serif',
                color: props.color ? props.color : "black",
                textAlign: props.center ? "center" : "auto"
            }}>
                {props.children}
            </Text>
        );
    }
    return (
        <Text style={[{
            fontSize: props.size ? props.size : 20,
            fontFamily: 'Inter_600SemiBold',
            color: props.color ? props.color : "black",
            textAlign: props.center ? "center" : "auto"
        }, props.style]}>
            {props.children}
        </Text>
    );
}

export default MediumText;