import React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import CustomButton from "./CustomButton";
import NormalText from "./NormalText";
import SmallText from "./SmallText";

const Notification = (props) => {
    return (
        <View style={styles.outline}>
            <View style={styles.head}>
                <Ionicons name="mail-outline" size={50} style={styles.icon} color="black" />
                
                <View style={styles.textContainer}>
                    <NormalText size={12}>{props.notif.hostFirstName} invites you to: {props.notif.name}</NormalText>
                    <View style={styles.buttons}>
                        <CustomButton marginHorizontal={10} width={80} onPress={props.onPress}>
                            <SmallText center color="white">View Details</SmallText>
                        </CustomButton>
                    </View>
                </View>
            </View>
        </View>
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
        paddingHorizontal: 20
    },
    textContainer: {
        flexDirection: "column",
        width: 250,
    },
    icon: {
        width: 50,
        height: 50,
        marginRight: 20
    },
    buttons: {
        flexDirection: "row",
        justifyContent: "flex-end",
    }
});

export default Notification;
