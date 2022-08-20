import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";

import LargeText from "./LargeText";
import NotifIcon from "./NotifIcon";

const Header = (props) => {
  return (
    <View style={styles.header}>
      <LargeText>{props.name}</LargeText>
      {props.navigation && <TouchableOpacity
        onPress={() => {
          props.navigation.navigate("Notifications");
        }}
      >
        <NotifIcon hasNotif={props.hasNotif == null ? false : props.hasNotif} />
      </TouchableOpacity>}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: -2,
    alignItems: "center",
  },
});

export default Header;
