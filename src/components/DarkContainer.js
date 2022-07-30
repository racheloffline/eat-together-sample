import React from "react";
import { Dimensions } from "react-native";
import { Section } from "react-native-rapi-ui";

const DarkContainer = props => {
    return (
        <Section backgroundColor="rgba(0, 0, 0, 0.7)" style={{
            marginVertical: props.marginVertical ? props.marginVertical : 0,
            width: props.width ? props.width : "auto",
            paddingVertical: 20,
            paddingHorizontal: 10,
            alignItems: props.align ? props.align : "center"
        }}>
            {props.children}
        </Section>
    );
}

export default DarkContainer;