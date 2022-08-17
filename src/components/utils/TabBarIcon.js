//Controls style of icons in bottom navigation bar

import React from "react";
import { Layout, Text, themeColor, useTheme } from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";

export default (props) => {
  const { isDarkmode } = useTheme();
  return (
    <Layout style={{justifyContent: "space-between", margin: 2, alignItems: "center"}}>
      <Ionicons
        name={props.icon}
        style={{ marginBottom: -7 }}
        size={24}
        color={
          props.focused
            ? isDarkmode
              ? themeColor.white100
              : themeColor.primary200
            : "rgb(143, 155, 179)"
        }
      />
      <Text
        fontWeight="bold"
        style={{
          marginBottom: 5,
          color: "rgb(143, 155, 179)",
          fontSize: 10,
        }}
      >
        {props.title}
      </Text>
    </Layout>
  );
};
