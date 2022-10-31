import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Layout, TextInput, TopNav } from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";

import TextMessage from "../../components/TextMessage";
import MediumText from "../../components/MediumText";
import KeyboardAvoidingWrapper from "../../components/KeyboardAvoidingWrapper";

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
        middleContent={group.name}
        leftContent={<Ionicons name="chevron-back" size={20} />}
        leftAction={() => {
          // Temporary fix with invalid chat preview, to be fixed in the future for better speed.
          navigation.navigate("Invite");
          navigation.navigate("Chats");
        }}
      />
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <TextMessage sentBy={item.sentBy} message={item.message} />
        )}
      />
      <KeyboardAvoidingWrapper>
        <TextInput
          placeholder="Send Message"
          value={message}
          onChangeText={(val) => setMessage(val)}
          rightContent={
            <TouchableOpacity
              onPress={() => {
                onSend();
              }}
            >
              <Ionicons name="send" size={20} color={"#D3D3D3"} />
            </TouchableOpacity>
          }
        />
      </KeyboardAvoidingWrapper>
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
  },

  messages: {},
});
