import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Layout, TextInput, TopNav } from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";

import TextMessage from "../../components/TextMessage";
import MediumText from "../../components/MediumText";

import firebase from "firebase/compat";
import { db, auth } from "../../provider/Firebase";
import moment from "moment";

export default function ({ route, navigation }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  // Common constant references
  let group = route.params.group;
  const user = auth.currentUser;
  const [userInfo, setUserInfo] = useState(null);
  const messageRef = db.collection("Groups").doc(group.groupID);

  // On update, push messages
  useEffect(() => {
    messageRef.onSnapshot((doc) => {
      if (doc.data()) { // Checks if doc exists (used to prevent crash after blocking a user)
        let temp = [];
        doc.data().messages.forEach((message) => {
          // insert message at beginning of array
          temp.unshift(message);
        });
        setMessages(temp);
      }
    });

    db.collection("Users").doc(user.uid).onSnapshot((doc) => {
      setUserInfo(doc.data());
    });
  }, []);

  const onSend = () => {
    messageRef
      .update({
        messages: firebase.firestore.FieldValue.arrayUnion({
          message: message,
          sentAt: moment().unix(),
          sentBy: user.uid,
          sentName: userInfo.firstName + " " + userInfo.lastName.substring(0, 1) + ".",
        }),
      })
      .then(() => {
        setMessage("");
      });
  };

  return (
    <Layout>
      <TopNav
        middleContent={
          <TouchableOpacity onPress={() => navigation.navigate("ChatRoomDetails", {
              group: group
          })}>
              <MediumText>{group.name}</MediumText>
          </TouchableOpacity>
        }
        leftContent={<Ionicons name="chevron-back" size={20} />}
        leftAction={() => {
          // Temporary fix with invalid chat preview, to be fixed in the future for better speed.
          navigation.goBack();
        }}
      />
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <TextMessage {...item}/>
        )}
        inverted={true}
      />

      <TextInput
        placeholder="Send Message"
        value={message}
        onChangeText={(val) => setMessage(val)}
        rightContent={
          <TouchableOpacity
            onPress={() => {
              onSend();
            }}
            disabled={message.length === 0}
          >
            <Ionicons name="send" size={20} color={"#D3D3D3"} />
          </TouchableOpacity>
        }
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 30,
    alignItems: "center",
    paddingHorizontal: 10,
  },

  background: {
    position: "absolute",
    width: Dimensions.get("screen").width,
    height: 100,
    backgroundColor: "#5DB075",
  }
});