//Chat with users you have already connected with

import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity
} from "react-native";
import { Button, Layout } from "react-native-rapi-ui";

import Header from "../../components/Header";

import { db } from "../../provider/Firebase";
import firebase from "firebase/compat";

import ChatPreview from "../../components/ChatPreview";
import SearchableDropdown from "../../components/SearchableDropdown";
import {useIsFocused} from "@react-navigation/native";

export const createNewChat = (
  userIDs,
  chatID,
  chatName,
  toIncludeOnChatPage
) => {
  // Create a new doc in the groups collection on firestore with input
  db.collection("Groups").doc(chatID).set({
    uids: userIDs,
    name: chatName,
    messages: [],
  });
  // If we want to display this chat on the chat page, update each user's data to include this chat
  if (toIncludeOnChatPage) {
    userIDs.map((uid) => {
      db.collection("Users")
        .doc(uid)
        .update({
          groupIDs: firebase.firestore.FieldValue.arrayUnion(chatID),
        });
    });
  }
};

export default function ({ navigation }) {
  // Chats with other users
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);

  // Current user
  const user = firebase.auth().currentUser;
  const [userInfo, setUserInfo] = useState(null);

  const isFocused = useIsFocused(); //OMG THIS IS A LIFESAVING HACK

  const createNewChatDefault = () => {
    // Generate group id using the concatenation of all the selected usernames
    let allUsernames = [];
    let allNames = [];

    selectedUsers.map((user) => {
      allUsernames.push(user.username);
      allNames.push(user.name);
    });

    allUsernames.push(userInfo.username);
    allNames.push(userInfo.firstName + " " + userInfo.lastName);
    const chatID = allUsernames.sort().join();

    // Get all the uid in this chat
    let allUIDs = [];
    selectedUsers.map((user) => {
      allUIDs.push(user.id);
    });
    allUIDs.push(user.uid);

    // Create a new doc in the groups collection on firestore
    db.collection("Groups")
      .doc(chatID)
      .set({
        uids: allUIDs,
        name: allNames.join(", "),
        messages: [],
      });

    // Update each user's data to include this chat
    allUIDs.map((uid) => {
      db.collection("Users")
        .doc(uid)
        .update({
          groupIDs: firebase.firestore.FieldValue.arrayUnion(chatID),
        });
    });

    let name = allNames.join(", ");
    let currUserName = userInfo.firstName + " " + userInfo.lastName
    if(allUIDs.length >= 2) {
      name = name.replace(currUserName + ", ", "");
      
      if (name.endsWith(", " + currUserName)) {
        name = name.slice(0, -1 * (currUserName.length + 2));
      }
    }

    navigation.navigate("ChatRoom", {
      group: {
        groupID: chatID,
        uids: allUIDs,
        name,
        messages: [],
      },
    });
  };

  // Get your taste buds as search suggestions
  useEffect(() => {
    db.collection("Users").doc(user.uid).onSnapshot((doc) => {
      setUserInfo(doc.data());

      const nameCurrent = doc.data().firstName + " " + doc.data().lastName;
      const friends = doc.data().friendIDs;
      const groups = doc.data().groupIDs;
      // update the groups displayed
      let temp = [];
      let lenGroups = groups.length;

      groups.forEach((groupID) => {
        db.collection("Groups")
          .doc(groupID)
          .get()
          .then((doc) => {
            // now store all the chat rooms
            let data = doc.data();
            // store most recent message in variable
            let message =
              data.messages.length != 0
                ? data.messages[data.messages.length - 1].message
                : "";
            let time =
              data.messages.length != 0
                ? data.messages[data.messages.length - 1].sentAt
                : "";

            // Get rid of your own name and all the ways it can be formatted in group title (if it is a DM)
            let name = data.name;
            if(data.uids.length >= 2) {
              name = name.replace(nameCurrent + ", ", "");
              if (name.endsWith(", " + nameCurrent)) {
                name = name.slice(0, -1 * (nameCurrent.length + 2));
              }
            }

            temp.push({
              groupID: groupID,
              name: name,
              uids: data.uids,
              hasImage: data.hasImage,
              message: message,
              time: time,
              pictureID: data.id,
            });
          })
          .then(() => {
            lenGroups--;
            if (lenGroups == 0) {
              // sort display by time
              temp.sort((a, b) => {
                return b.time - a.time;
              });
              setGroups(temp);
            }
          });
      });
      // prepare the list of all connections for searchbar
      let list = [];
      friends.forEach((uid) => {
        db.collection("Users")
          .doc(uid)
          .get()
          .then((doc) => {
            let data = doc.data();
            list.push({
              id: data.id,
              username: data.username,
              name: data.firstName + " " + data.lastName,
              hasImage: data.hasImage,
              pictureID: data.id,
            });
          })
          .then(() => {
            setUsers(list);
          });
      });
    });
  }, [isFocused]);

  return (
    <Layout>
      <Header name="Chat" navigation={navigation} connections/>

      <View style={styles.content}>
        <View style={styles.searchArea}>
          <SearchableDropdown
            multi={true}
            selectedItems={selectedUsers}
            onItemSelect={(item) => {
              setSelectedUsers([...selectedUsers, item]);
            }}
            containerStyle={{ padding: 0, width: "70%" }}
            onRemoveItem={(item) => {
              const items = selectedUsers.filter(
                (sitem) => sitem.id !== item.id
              );
              setSelectedUsers(items);
            }}
            itemStyle={{
              padding: 10,
              borderWidth: 2,
              borderColor: '#5DB075',
              borderRadius: 5,
              marginTop: 2,
            }}
            itemTextStyle={{ color: "#222" }}
            itemsContainerStyle={{ maxHeight: 140 }}
            items={users}
            defaultIndex={2}
            chip={false}
            resetValue={true}
            textInputProps={{
              placeholder: "Search for taste buds",
            }}
          />
          <Button
            text="New Chat"
            disabled={selectedUsers.length == 0}
            color="black"
            style={{ height: 50 }}
            onPress={() => {
              createNewChatDefault();
              setSelectedUsers([]);
            }}
          ></Button>
        </View>
        <FlatList
          keyExtractor={(item) => item.id}
          data={groups}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("ChatRoom", {
                  group: item,
                });
              }}
            >
              <ChatPreview
                group={item}
                click={() => {
                  db.collection("Users")
                    .doc(item.id)
                    .get()
                    .then((doc) => {
                      navigation.navigate("FullProfile", {
                        person: doc.data(),
                      });
                    });
                }}
              />
            </TouchableOpacity>
          )}
        />
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  switchView: {
    marginTop: 10,
  },
  content: {
    paddingHorizontal: 10,
  },
  searchArea: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  list: {
    paddingBottom: 225,
  },
});
