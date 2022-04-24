import React from "react";
import { Text } from "react-native";
import { useFonts, Inter_400Regular } from '@expo-google-fonts/inter';

const NormalText = props => {
    let [fontsLoaded] = useFonts({ Inter_400Regular });

    if (!fontsLoaded) {
        return (
            <Text style={{
                fontSize: props.size ? props.size : 14,
                fontFamily: 'sans-serif',
                color: props.color ? props.color : "black"
            }}>
                {props.children}
            </Text>
        );
    }
    return (
        <Text style={{
            fontSize: props.size ? props.size : 14,
            fontFamily: 'Inter_400Regular',
            color: props.color ? props.color : "black"
        }}>
            {props.children}
        </Text>
    );
}

export default NormalText;