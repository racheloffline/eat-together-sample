import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import SmallText from "./SmallText";

const Tag = props => {
    return (
        <View style={styles.tag} borderRadius={20}>
            <SmallText color="white">{props.text}</SmallText>
        </View>
    );
}

const styles = StyleSheet.create({
    tag: {
        marginLeft: 2,
        marginTop: 2,
        paddingVertical: 5,
        paddingHorizontal: 8,
        backgroundColor: "black"
    },
})

export default Tag;