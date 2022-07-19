//Chat with users you have already connected with

import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Button, Layout, TopNav } from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import HorizontalSwitch from "../../components/HorizontalSwitch";
import MediumText from "../../components/MediumText";
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
      // Step 1: Create a new doc in the groups collection on firestore
      db.collection("Groups")
        .doc(chatID)
        .set({
          uids: allUIDs,
          name: allNames.join(", "),
          messages: [],
        });
      // Step 2: Create a messages storage for this group
      // Step 3: Update each user's data to include this chat
      allUIDs.map((uid) => {
        db.collection("Users")
          .doc(uid)
          .update({
            groupIDs: firebase.firestore.FieldValue.arrayUnion(chatID),
          });
      });
      alert("New chat created.");
    });
  };

  // Get your taste buds as search suggestions
  useEffect(() => {
    userInfo.onSnapshot((doc) => {
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
            // store the most recent message
            // store most recent message in variable
            let message =
              data.messages.length != 0
                ? data.messages[data.messages.length - 1].message
                : "";
            let time =
              data.messages.length != 0
                ? data.messages[data.messages.length - 1].sentAt
                : "";
            temp.push({
              groupID: groupID,
              name: data.name,
              uids: data.uids,
              hasImage: data.hasImage,
              message: message,
              time: time,
              pictureID: data.id,
            });
          })
          .then(() => {
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
      <TopNav
        middleContent={<MediumText center>Notifications</MediumText>}
        leftContent={<Ionicons name="chevron-back" size={20} />}
        rightContent={<Ionicons name="person-add" size={20} />}
        leftAction={() => navigation.goBack()}
        rightAction={() => navigation.navigate("Connections")}
      />
      <View style={styles.switchView}>
        <HorizontalSwitch
          left="Invites"
          right="Chats"
          current="right"
          press={() => navigation.navigate("Invite")}
        />
      </View>
      <View style={styles.content}>
        <View style={styles.searchArea}>
          <SearchableDropdown
            multi={true}
            selectedItems={selectedUsers}
            onItemSelect={(item) => {
              setSelectedUsers([...selectedUsers, item]);
            }}
            containerStyle={{ padding: 0 , width: 200}}
            onRemoveItem={(item, index) => {
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
            resetValue={false}
            textInputProps={{
              placeholder: "Search for taste buds",
              underlineColorAndroid: "transparent",
              style: {
                padding: 12,
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 5,
                maxWidth: 250,
              },
            }}
            listProps={{
              nestedScrollEnabled: true,
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
  header: {
    padding: 40,
    display: "flex",
    marginBottom: -20,
  },
  headingText: {
    fontSize: 50,
  },
  switchView: {
    marginVertical: 10,
  },
  content: {
    marginVertical: -20,
  },
  searchArea: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});
