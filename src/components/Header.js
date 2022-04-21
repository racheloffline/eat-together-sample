import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from '@expo/vector-icons';

import LargeText from "./LargeText";

const Header = props => {
    return (
        <View style={styles.header}>
			<LargeText>{props.name}</LargeText>
            <TouchableOpacity>
                <Feather name="mail" size={36} color="black" style={{marginRight: 10}}/>
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