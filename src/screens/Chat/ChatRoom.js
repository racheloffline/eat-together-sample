import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Layout, TextInput, TopNav } from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import firebase from "firebase/compat";
import { db } from "../../provider/Firebase";
import moment from "moment";
import TextMessage from "../../components/TextMessage";
import NormalText from "../../components/NormalText";
import MediumText from "../../components/MediumText";

export default function ({ route, navigation }) {
  const [image, setImage] = useState(
    "https://images.immediate.co.uk/production/volatile/sites/30/2017/01/Bananas-218094b-scaled.jpg"
  );
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  // Common constant references
  let group = route.params.group;
  const user = firebase.auth().currentUser;
  const messageRef = db.collection("Groups").doc(group.groupID);

  // On update, push messages
  useEffect(() => {
    messageRef.onSnapshot((doc) => {
      let temp = [];
      doc.data().messages.forEach((message) => {
        // insert message at beginning of array
        temp.unshift(message);
      });
      setMessages(temp);
    });
  }, []);

  const onSend = () => {
    messageRef
      .update({
        messages: firebase.firestore.FieldValue.arrayUnion({
          message: message,
          sentAt: moment().unix(),
          sentBy: user.uid,
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
        rightContent={<Image style={styles.image} source={{ uri: image }} />}
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
