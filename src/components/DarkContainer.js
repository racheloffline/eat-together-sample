import React from "react";
import { Dimensions } from "react-native";
import { Section } from "react-native-rapi-ui";

const DarkContainer = props => {
    return (
        <Section backgroundColor="rgba(0, 0, 0, 0.7)" style={{
            marginVertical: props.marginVertical ? props.marginVertical : 20,
            width: Dimensions.get('screen').width - 40,
            paddingVertical: 20,
            paddingHorizontal: 10,
            alignItems: "center"
        }}>
            {props.children}
        </Section>
    );
}

export default DarkContainer;