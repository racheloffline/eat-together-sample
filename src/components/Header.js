import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";

import LargeText from "./LargeText";
import NotifIcon from "./NotifIcon";

const Header = props => {

    return (
        <View style={styles.header}>
            <LargeText>{props.name}</LargeText>
            <TouchableOpacity onPress={() => {
                props.navigation.navigate("Invite")
            }}>
                {/*<Feather name="mail" size={36} color="black" style={{marginRight: 10}}/>*/}
                <NotifIcon hasNotif = {props.hasNotif == null ? false : props.hasNotif}/>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        padding: 10,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: -2,
        alignItems: "center",
    },
});

export default Header;