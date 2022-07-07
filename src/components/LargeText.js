import React from "react";
import { Text } from "react-native";
import { useFonts, Inter_800ExtraBold } from '@expo-google-fonts/inter';

const LargeText = props => {
    let [fontsLoaded] = useFonts({ Inter_800ExtraBold });

    if (!fontsLoaded) {
        return (
            <Text style={{
                fontSize: props.size ? props.size : 30,
                fontFamily: 'sans-serif',
                color: props.color ? props.color : "black",
                textAlign: props.center ? "center" : "auto",
                marginBottom: props.marginBottom ? props.marginBottom : 0
            }}>
                {props.children}
            </Text>
        );
    }
    return (
        <Text style={[{
            fontSize: props.size ? props.size : 30,
            fontFamily: 'Inter_800ExtraBold',
            color: props.color ? props.color : "black",
            textAlign: props.center ? "center" : "auto",
            marginBottom: props.marginBottom ? props.marginBottom : 0
        }, props.style]}>
            {props.children}
        </Text>
    );
}

export default LargeText;