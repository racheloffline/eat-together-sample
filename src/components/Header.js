import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from '@expo/vector-icons';

import LargeText from "./LargeText";
import NotifIcon from "./NotifIcon";

const Header = props => {

    return (
        <View style={styles.header}>
			<LargeText>{this.props.name}</LargeText>
            <TouchableOpacity onPress={() => {
                this.props.navigation.navigate("Invite")
            }}>
                {/*<Feather name="mail" size={36} color="black" style={{marginRight: 10}}/>*/}
                <NotifIcon hasNotif = {this.props.hasNotif == null ? false : this.props.hasNotif}/>
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
        marginVertical: 5,
        alignItems: "center",
    },
});

export default Header;