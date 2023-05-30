import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { auth} from "../provider/Firebase";

import LargeText from "./LargeText";

const Header = (props) => {
  const user = auth.currentUser;
  const tryoutId = 'knVtYe1mtpaZ9D8XLDrS7FCImtm2';
  return (
    <View style={styles.header}>
      <LargeText>{props.name}</LargeText>
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

  icons: {
    flexDirection: "row",
    alignItems: "center",
  }
});

export default Header;
