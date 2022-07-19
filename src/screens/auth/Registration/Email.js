// Verifying email

import React, { useState } from "react";
import { View, StyleSheet, Dimensions, Image, TouchableOpacity } from "react-native";
import { Layout, TextInput } from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";

import MediumText from "../../../components/MediumText";
import Button from "../../../components/Button";
import NormalText from "../../../components/NormalText";

const Email = props => {
  const [email, setEmail] = useState(props.email);
  const [verified, setVerified] = useState(null);

  const checkEmail = email => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email); 
  }

  const verifyEmail = () => {
    const isAcademic = email.split("@");
    if (isAcademic[isAcademic.length-1] === "uw.edu" || isAcademic[isAcademic.length-1] === "cs.washington.edu") {
      setVerified(true);
    } else {
      setVerified(false);
    }
  }

  return (
    <Layout style={styles.page}>
        <Image source={require("../../../../assets/backpack.png")}/>
        <View style={{marginVertical: 20}}>
          <MediumText center>Verify your student email address</MediumText>
        </View>

        <TextInput placeholder="Enter email address ..." value={email}
          onChangeText={val => setEmail(val)} containerStyle={{marginBottom: 20}}
          autoComplete="email" keyboardType="email-address"
          leftContent={<Ionicons name="mail" size={18}/>}/>

        <Button disabled={!checkEmail(email)} onPress={verifyEmail} marginVertical={15}>Verify</Button>
        {verified !== null &&
        <NormalText color={verified ? "#5DB075" : "red"}>
          {verified ? "Is a student!" : "Not a student"}
        </NormalText>}

        <View style={styles.buttons}>
          <Button onPress={() => props.navigation.goBack()}
            marginHorizontal={10}>Back</Button>
          <Button disabled={!verified}
            onPress={() => {
              props.setEmail(email);
              props.navigation.navigate("Availabilities");
            }}
            marginHorizontal={10}>Next</Button>
        </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  page: {
    alignItems: "center",
    width: Dimensions.get('screen').width,
    paddingHorizontal: 20,
    paddingVertical: 50
  },

  buttons: {
    marginTop: 60,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center"
  }
});

export default Email;