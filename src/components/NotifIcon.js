import React from "react";
import { Ionicons } from "@expo/vector-icons";

const NotifIcon = (props) => {
  let iconName;

  //Choose either regular mail or mail with notif
  if (props.hasNotif) {
    iconName = "mail-unread-outline";
  } else {
    iconName = "mail-outline";
  }

  return (
    <Ionicons
      name={iconName}
      size={40}
      color="black"
      style={{ marginRight: 5 }}
    />
  );
};

export default NotifIcon;
