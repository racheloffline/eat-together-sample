import React from "react";
import { Platform, Text } from "react-native";
import { useFonts, Inter_600SemiBold } from '@expo-google-fonts/inter';

const MediumText = props => {
    let [fontsLoaded] = useFonts({ Inter_600SemiBold });

    if (!fontsLoaded) {
        return (
            <Text style={{
                fontSize: props.size ? props.size : 20,
                fontFamily: Platform.os === 'ios' ? 'AppleSDGothicNeo-Medium' : 'sans-serif-medium',
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
        <Text style={[{
            fontSize: props.size ? props.size : 20,
            fontFamily: 'Inter_600SemiBold',
            color: props.color ? props.color : "black",
            textAlign: props.center ? "center" : "auto",
            paddingHorizontal: props.paddingHorizontal ? props.paddingHorizontal : 0,
            marginBottom: props.marginBottom ? props.marginBottom : 0
        }, props.style]}>
            {props.children}
        </Text>
    );
}

export default MediumText;