import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import NormalText from "./NormalText";

const Filter = props => {
    return (
        <TouchableOpacity style={props.checked ? styles.checked : styles.unchecked}
            onPress={props.onPress}>
            <NormalText color={props.checked ? "white" : "#5DB075"}
                center>{props.text}</NormalText>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    unchecked: {
        borderRadius: 50,
        padding: 5,
        borderColor: "#5DB075",
        borderWidth: 2,
        marginHorizontal: 5,
        alignItems: "center",
        justifyContent: "center",
    },
    
    checked: {
        borderRadius: 50,
        padding: 5,
        backgroundColor: "#5DB075",
        borderColor: "none",
        borderWidth: 2,
        marginHorizontal: 5,
        alignItems: "center",
        justifyContent: "center"
    }
});

export default Filter;