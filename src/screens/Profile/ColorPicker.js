// This is the colorpicker for banner color, it will allow user
// to click and pick a color and set the chosen color to be their
// new banner color and also update the database
import { ColorPicker } from 'react-native-color-picker'
import React, { useState, useEffect } from "react";
import { Ionicons, Feather } from "@expo/vector-icons";
import {
    View,
    StyleSheet,
    Text,
} from 'react-native';

import { db, auth } from "../../provider/Firebase";
import "firebase/firestore"

export default function Colorpicker({ navigation }) {
    const user = auth.currentUser;
    const [banner, setBanner] = useState({});
    // Fetch current user info
    useEffect(() => {
        if (user) {
            db.collection("Users").doc(user.uid).get().then(doc => {
                setBanner(doc.data().settings.banner);
            });
        }
    });



  return (
    <View style={{flex: 1, padding: 45, backgroundColor: 'black'}}>
      <Ionicons
        name="chevron-back"
        size={40}
        color="white"
        onPress={() => {
          navigation.navigate("Me");
        }}
      />
      <Text style={styles.name}>Rotate the palette and click the right side to customize your banner color!</Text>
      <ColorPicker
        oldColor='#5DB075'
        onColorSelected={color => {
          db.collection("Users").doc(user.uid).update({
              "settings.banner": color
          });
        }}
        style={{flex: 1}}
      />
    </View>

  );
}

const styles = StyleSheet.create({
  name: {
    width: "100%",
    marginVertical: 20,
    alignItems: "center",
    color: 'white',
    fontSize:20
  },
});


