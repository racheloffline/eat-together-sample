import React from "react";
import { Platform, Text } from "react-native";
import { useFonts, Inter_200ExtraLight } from '@expo-google-fonts/inter';

const SmallText = props => {
    let [fontsLoaded] = useFonts({ Inter_200ExtraLight });

    if (!fontsLoaded) {
        return (
            <Text style={{
                fontSize: props.size ? props.size : 10,
                fontFamily: Platform.os === 'ios' ? 'AppleSDGothicNeo-Light' : 'sans-serif-light',
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
            fontSize: props.size ? props.size : 10,
            fontFamily: 'Inter_200ExtraLight',
            color: props.color ? props.color : "black",
            textAlign: props.center ? "center" : "auto",
            paddingHorizontal: props.paddingHorizontal ? props.paddingHorizontal : 0,
            marginBottom: props.marginBottom ? props.marginBottom : 0
        }}>
            {props.children}
        </Text>
    );
}

export default SmallText;