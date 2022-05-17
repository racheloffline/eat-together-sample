
// Specify availabilities for days of the week

import React from "react";
import { View, ScrollView, StyleSheet, Dimensions } from "react-native";
import { Layout } from "react-native-rapi-ui";

import LargeText from "../../components/LargeText";
import Button from "../../components/Button";

export default function ({ navigation }) {
  return (
    <Layout style={styles.page}>
        <LargeText center>Specify your availabilities for:</LargeText>

        <View style={styles.dates}>
            <Button onPress={() => navigation.navigate("Monday")} marginVertical={5}>Monday</Button>
            <Button onPress={() => navigation.navigate("Tuesday")} marginVertical={5}>Tuesday</Button>
            <Button onPress={() => navigation.navigate("Wednesday")} marginVertical={5}>Wednesday</Button>
            <Button onPress={() => navigation.navigate("Thursday")} marginVertical={5}>Thursday</Button>
            <Button onPress={() => navigation.navigate("Friday")} marginVertical={5}>Friday</Button>
            <Button onPress={() => navigation.navigate("Saturday")} marginVertical={5}>Saturday</Button>
            <Button onPress={() => navigation.navigate("Sunday")} marginVertical={5}>Sunday</Button>
        </View>

        <View style={styles.buttons}>
          <Button onPress={() => navigation.goBack()}
            marginHorizontal={10}>Save</Button>
        </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  page: {
    alignItems: "center",
    width: Dimensions.get('screen').width,
    paddingHorizontal: 20,
    paddingVertical: 30
  },

  dates: {
    marginTop: 20,
    maxHeight: Dimensions.get('screen').height/1.5
  },

  buttons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20
  }
});
