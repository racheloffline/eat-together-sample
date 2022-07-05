// First page of registration

import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, Image, TouchableOpacity } from "react-native";
import { Layout, TextInput } from "react-native-rapi-ui";
import { FontAwesome, Entypo, Ionicons } from '@expo/vector-icons';

import LargeText from "../../../components/LargeText";
import SmallText from "../../../components/SmallText";
import Button from "../../../components/Button";

const Password = props => {
  const [username, setUsername] = useState(props.username);
  const [password, setPassword] = useState(props.password);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  useEffect(() => {
    props.setUsername(username);
    
    if (password === confirmPassword && password !== "") {
      setConfirmed(true);
      props.setPassword(password);
    } else {
      setConfirmed(false);
    }
  }, [password, confirmPassword, username]);

  return (
    <Layout style={styles.page}>
      <LargeText center>Finally, set a username and password!</LargeText>

      <TextInput placeholder="Username (at least 4 characters)" value={username}
          onChangeText={val => setUsername(val)} containerStyle={{marginTop: 30}}
          leftContent={<FontAwesome name="user" size={18}/>}/>
          
      <TextInput placeholder="Password (at least 8 characters)" value={password}
          secureTextEntry={!showPass ? true : false} onChangeText={val => {
            setPassword(val);
          }}
          containerStyle={{marginTop: 10}} leftContent={<Entypo name="lock" size={18}/>}
          rightContent={<TouchableOpacity onPress={() => setShowPass(!showPass)}>
            <Ionicons name={!showPass ? "eye" : "eye-off"} size={22}/>
          </TouchableOpacity>}/>

      <TextInput placeholder="Confirm password" value={confirmPassword}
          secureTextEntry={!showConfirmPass ? true : false} onChangeText={val => setConfirmPassword(val)}
          containerStyle={{marginVertical: 10}} leftContent={<Entypo name="lock" size={18}/>}
          rightContent={<TouchableOpacity onPress={() => setShowConfirmPass(!showConfirmPass)}>
            <Ionicons name={!showConfirmPass ? "eye" : "eye-off"} size={22}/>
          </TouchableOpacity>}/>
      
      {password.length >= 8 && <SmallText color={!confirmed ? "red" : "#5DB075"}>
        {!confirmed ? "Passwords don't match" : "Passwords match!"}
      </SmallText>}

      <View style={styles.buttons}>
          <Button onPress={() => props.navigation.goBack()}
            marginHorizontal={10}>Back</Button>
          <Button disabled={props.loading || username.length < 4 || password.length < 8 || !confirmed}
            onPress={() => {
              props.createUser();
            }}
            marginHorizontal={10}>Finish!</Button>
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

export default Password;