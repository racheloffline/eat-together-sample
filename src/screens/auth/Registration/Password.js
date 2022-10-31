// First page of registration

import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, Image, TouchableOpacity, SafeAreaView } from "react-native";
import { TextInput } from "react-native-rapi-ui";
import { FontAwesome, Entypo, Ionicons } from '@expo/vector-icons';

import LargeText from "../../../components/LargeText";
import SmallText from "../../../components/SmallText";
import Button from "../../../components/Button";
import KeyboardAvoidingWrapper from "../../../components/KeyboardAvoidingWrapper";

const Password = props => {
  const [username, setUsername] = useState(props.username);
  const [usernameValid, setUsernameValid] = useState(false);
  const [email, setEmail] = useState(props.email);
  const [password, setPassword] = useState(props.password);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  // Show passwords or not
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  useEffect(() => {
    if (!props.usernames.includes(username)) {
      setUsernameValid(true);
      props.setUsername(username);
    } else {
      setUsernameValid(false);
    }
    
    props.setEmail(email);

    if (password === confirmPassword && password.length >= 8) {
      setConfirmed(true);
      props.setPassword(password);
    } else {
      setConfirmed(false);
    }
  }, [username, email, password, confirmPassword]);

  // Check validity of email
  const checkEmail = email => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email); 
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingWrapper>
        <View style={styles.page}>
          <LargeText center>
            Finally, set your username, email, and password!
          </LargeText>

          <TextInput
            placeholder="Username (at least 4 characters)"
            value={username}
            onChangeText={(val) => setUsername(val.replace(/\s+/g, ""))}
            containerStyle={{ marginTop: 30, marginBottom: 10 }}
            leftContent={<FontAwesome name="user" size={18} />}
          />

          {username.length >= 4 && (
            <SmallText
              color={!usernameValid ? "red" : "#5DB075"}
              marginBottom={10}
            >
              {!usernameValid ? "Username taken :(" : "Username valid!"}
            </SmallText>
          )}

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={(val) => {
              setEmail(val);
            }}
            autoComplete="email"
            keyboardType="email-address"
            leftContent={<Ionicons name="mail" size={18} />}
          />

          <TextInput
            placeholder="Password (at least 8 characters)"
            value={password}
            secureTextEntry={!showPass ? true : false}
            onChangeText={(val) => {
              setPassword(val);
            }}
            containerStyle={{ marginTop: 10 }}
            leftContent={<Entypo name="lock" size={18} />}
            rightContent={
              <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                <Ionicons name={!showPass ? "eye" : "eye-off"} size={22} />
              </TouchableOpacity>
            }
          />

          <TextInput
            placeholder="Confirm password"
            value={confirmPassword}
            secureTextEntry={!showConfirmPass ? true : false}
            onChangeText={(val) => setConfirmPassword(val)}
            containerStyle={{ marginVertical: 10 }}
            leftContent={<Entypo name="lock" size={18} />}
            rightContent={
              <TouchableOpacity
                onPress={() => setShowConfirmPass(!showConfirmPass)}
              >
                <Ionicons
                  name={!showConfirmPass ? "eye" : "eye-off"}
                  size={22}
                />
              </TouchableOpacity>
            }
          />

          {password.length >= 8 && (
            <SmallText color={!confirmed ? "red" : "#5DB075"}>
              {!confirmed ? "Passwords don't match" : "Passwords match!"}
            </SmallText>
          )}

          <View style={styles.buttons}>
            <Button
              onPress={() => props.navigation.goBack()}
              marginHorizontal={10}
            >
              Back
            </Button>
            <Button
              disabled={
                props.loading ||
                !checkEmail(email) ||
                !usernameValid ||
                username.length < 4 ||
                password.length < 8 ||
                !confirmed
              }
              onPress={() => props.createUser()}
              marginHorizontal={10}
            >
              Finish!
            </Button>
          </View>
        </View>
      </KeyboardAvoidingWrapper>
    </SafeAreaView>
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

export default Password;