import React from "react";
import { Text } from "react-native";
import { useFonts, Inter_400Regular } from '@expo-google-fonts/inter';

const NormalText = props => {
    let [fontsLoaded] = useFonts({ Inter_400Regular });

    if (!fontsLoaded) {
        return (
            <Text style={{
                fontSize: props.size ? props.size : 14,
                fontWeight: props.weight ? props.weight : "normal",
                fontFamily: 'sans-serif',
                color: props.color ? props.color : "black",
                textAlign: props.center ? "center" : "auto",
                paddingHorizontal: props.paddingHorizontal ? props.paddingHorizontal : 0,
                marginBottom: props.marginBottom ? props.marginBottom : 0
            }}>
                {props.children}
            </Text>
        );
    }
    return (
        <Text style={{
            fontSize: props.size ? props.size : 14,
            fontWeight: props.weight ? props.weight : "normal",
            fontFamily: 'Inter_400Regular',
            color: props.color ? props.color : "black",
            textAlign: props.center ? "center" : "auto",
            paddingHorizontal: props.paddingHorizontal ? props.paddingHorizontal : 0,
            marginBottom: props.marginBottom ? props.marginBottom : 0
        }}>
            {props.children}
        </Text>
    );
}

export default NormalText;