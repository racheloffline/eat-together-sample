//Chat with users you have already connected with

import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Button, Layout, TopNav } from "react-native-rapi-ui";
import Header from "../../components/Header";
import { db } from "../../provider/Firebase";
import firebase from "firebase";
import ChatPreview from "../../components/ChatPreview";
import SearchableDropdown from "react-native-searchable-dropdown";

export default function ({ navigation }) {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const user = firebase.auth().currentUser;
  const userInfo = db.collection("Users").doc(user.uid);

  const createNewChat = () => {
    userInfo.get().then((currUser) => {
      // Generate group id using the concatenation of all the selected usernames
      let allUsernames = [];
      let allNames = [];
      selectedUsers.map((user) => {
        allUsernames.push(user.username);
        allNames.push(user.name);
      });
      allUsernames.push(currUser.data().username);
      allNames.push(currUser.data().name);
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
      navigation.navigate("ChatRoom", {
        group: {
          groupID: chatID,
          uids: allUIDs,
          name: allNames.join(", "),
          messages: [],
        },
      });
    });
  };

  // Get your taste buds as search suggestions
  useEffect(() => {
    userInfo.onSnapshot((doc) => {
      const nameCurrent = doc.data().name;
      const friends = doc.data().friendIDs;
      const groups = doc.data().groupIDs;
      // update the groups displayed
      let temp = [];
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
            // Get rid of your own name and all the ways it can be formatted in group title
            let name = data.name.replace(nameCurrent + ", ", "");
            if (name.endsWith(", " + nameCurrent)) {
              name = name.slice(0, -1 * (nameCurrent.length + 2));
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
            // sort display by time
            temp.sort((a, b) => {
              return b.time - a.time;
            });
            setGroups(temp);
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
              name: data.name,
              hasImage: data.hasImage,
              pictureID: data.id,
            });
          })
          .then(() => {
            setUsers(list);
          });
      });
    });
  }, []);

  return (
    <Layout>
      <Header name="Chat"/>

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
              marginTop: 2,
              backgroundColor: "#ddd",
              borderColor: "#bbb",
              borderWidth: 1,
              borderRadius: 5,
            }}
            itemTextStyle={{ color: "#222" }}
            itemsContainerStyle={{ maxHeight: 140 }}
            items={users}
            defaultIndex={2}
            chip={false}
            resetValue={true}
            textInputProps={{
              placeholder: "Search for taste buds",
              style: {
                padding: 12,
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 5,
                maxWidth: 220,
              },
            }}
          />
          <Button
            text="New Chat"
            disabled={selectedUsers.length == 0}
            color="black"
            style={{ height: 50 }}
            onPress={() => {
              createNewChat();
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
