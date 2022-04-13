//Functionality TDB, most likely to be used to implement ice-breaker games

import React from "react";
import { View, StyleSheet, Image } from "react-native";
import {
  Layout,
  TopNav,
  Text,
  themeColor,
  useTheme,
  Button
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";

const FullCard = ({ route, navigation }) => {
  return (
    <Layout>
      <TopNav
        middleContent="View Event"
        leftContent={
          <Ionicons
            name="chevron-back"
            size={20}
          />
        }
        leftAction={() => navigation.goBack()}
      />
      <View style={styles.page}>
        <Text size="h1">{route.params.event.name}</Text>
        <Text size="h3">Hosted by: {route.params.event.host.name}</Text>
        <View style={styles.details}>
            <Image style={styles.image}
              source={{uri: route.params.event.image}}/>

            <View style={{flexDirection: "column"}}>
                <Text size="h3">{route.params.event.date}</Text>
                <Text size="h3">{route.params.event.time}</Text>
                <Text size="h3">{route.params.event.location}</Text>
            </View>
        </View>

        <Text size="h4">{route.params.event.details}</Text>
        <Button text="Attend!" status="success" style={{marginTop: 40}}/>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
    page: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 10
    },

    details: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 40
    },

    image: {
      marginRight: 20,
      width: 150,
      height: 150,
      borderRadius: 30,
    },
});

export default FullCard;