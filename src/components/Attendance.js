import React from 'react';
import { TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import NormalText from './NormalText';
import { Foundation } from "@expo/vector-icons";

const Attendance = props => {
    return (
        <TouchableOpacity style={[styles.outline, {
            borderColor: props.attending ? "#5DB075" : "grey"
        }]} onPress={props.onPress}>
            <Image source={props.person.image ? {uri: props.person.image}
                : require("../../assets/logo.png")} style={styles.image}/>
            <NormalText color="white">{props.person.name}</NormalText>
            <Foundation name="check" size={24} color={props.attending ? "#5DB075" : "grey"}
                style={styles.checkMark}/>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    outline: {
        padding: 15,
        paddingRight: 40,
        width: Dimensions.get('screen').width/1.4,
        marginVertical: 5,
        borderWidth: 5,
        borderRadius: 10,
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
    },

    image: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10
    },

    checkMark: {
        position: "absolute",
        right: 15,
        top: "50%"
    }
})

export default Attendance;