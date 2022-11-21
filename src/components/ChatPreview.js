import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, Dimensions, TouchableOpacity } from "react-native";
import MediumText from "./MediumText";
import { storage } from "../provider/Firebase";
import SmallText from "./SmallText";
import moment from "moment";

const ChatPreview = (props) => {
  const [image, setImage] = useState(
    "https://static.wixstatic.com/media/d58e38_29c96d2ee659418489aec2315803f5f8~mv2.png"
  );
  useEffect(() => {
    // TODO: Fix these pictures not showing up
    if (props.group.hasImage) {
      storage
        .ref("profilePictures/" + props.group.pictureID)
        .getDownloadURL()
        .then((uri) => {
          setImage(uri);
        });
    }
  }, []);

  let time = moment.unix(props.group.time).fromNow(true);

  return (
    <TouchableOpacity style={styles.outline} onPress={props.onPress}>
      <View style={styles.head}>
        {props.group.unread && <View style={styles.unread}/>}

        <View style={styles.headleft}>
          <Image style={styles.image} source={{ uri: image }} />
          <View style={styles.textContainer}>
            <MediumText>{props.group.name}</MediumText>
            {props.group.message !== "" &&
              <SmallText weight={props.group.unread ? "bold" : "normal"}>{props.group.message}</SmallText>}
          </View>
        </View>

        {props.group.time !== "" && <SmallText>{time}</SmallText>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  outline: {
    padding: 10,
    alignItems: "center"
  },
  
  head: {
    width: Dimensions.get('window').width * 0.95,
    height: 80,
    backgroundColor: "white",
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 20,
    paddingRight: 30
  },

  headleft: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  textContainer: {
    flexDirection: "column",
    maxWidth: 200,
  },

  image: {
    width: 60,
    height: 60,
    borderRadius: 90,
    borderColor: "white",
    borderWidth: 2,
    marginRight: 20,
  },

  name: {
    marginRight: 20,
  },

  unread: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: "#5DB075",
    position: "absolute",
    top: 35,
    right: 10
  }
});

export default ChatPreview;
