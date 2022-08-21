//Controls style of icons in bottom navigation bar

import React from "react";
import { Layout, Text, themeColor, useTheme } from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";

export default (props) => {
  return (
    <Layout
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
      backgroundColor="white"
    >
      <Ionicons
        name={props.icon}
        size={24}
        color={props.focused ? themeColor.primary200 : "rgb(143, 155, 179)"}
      />
      <Text
        fontWeight="bold"
        style={{
          color: "rgb(143, 155, 179)",
          fontSize: 10,
        }}
      >
        {props.title}
      </Text>
    </Layout>
  );
};
