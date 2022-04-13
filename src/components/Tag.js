import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-rapi-ui';

const Tag = props => {
    return (
        <View style={styles.tag} borderRadius={10}>
            <Text style={styles.text}>{props.text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    tag: {
        marginLeft: 2,
        marginTop: 2,
        padding: 5,
        borderRadius: 10,
        backgroundColor: "black"
    },

    text: {
        color: "white",
        fontSize: 10
    },
})

export default Tag;