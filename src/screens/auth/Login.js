//Users go here to log in

import React, { useState } from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import * as firebase from "firebase";

import {
  Layout,
  TextInput
} from "react-native-rapi-ui";
import { Ionicons, Entypo } from "@expo/vector-icons";

import Button from "../../components/Button";
import LargeText from "../../components/LargeText";
import NormalText from "../../components/NormalText";

export default function ({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function login() {
    setLoading(true);
    await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
        setLoading(false);
        alert(errorMessage);
      });
  }

  return (
  <Layout>
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "white",
            }}
          >
            <Image
              resizeMode="contain"
              style={{
                height: 250,
                width: 250,
              }}
              source={require("../../../assets/welcome.png")}
            />
          </View>
          <View
            style={{
              flex: 3,
              paddingHorizontal: 20,
              paddingBottom: 20,
              backgroundColor: "white",
            }}
          >
            <LargeText center>Welcome!</LargeText>

            <TextInput
              leftContent={<Ionicons name="mail" size={18}/>}
              containerStyle={{ marginTop: 30 }}
              placeholder="Enter your email"
              value={email}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
              keyboardType="email-address"
              onChangeText={(text) => setEmail(text)}
            />

            <TextInput
              leftContent={<Entypo name="lock" size={18}/>}
              containerStyle={{ marginVertical: 15 }}
              placeholder="Enter your password"
              value={password}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
              secureTextEntry={true}
              onChangeText={(text) => setPassword(text)}
            />
            <Button onPress={login} marginVertical={10} disabled={loading}>
              {loading ? "Loading" : "Login"}
            </Button>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 15,
                justifyContent: "center",
              }}
            >
              <NormalText>Don't have an account? </NormalText>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Name");
                }}
              >
                <NormalText color="#5DB075">Register here</NormalText>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 10,
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("ForgetPassword");
                }}
              >
                <NormalText color="#5DB075">Forgot password</NormalText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
    </KeyboardAvoidingView>
  </Layout>
  );
}
