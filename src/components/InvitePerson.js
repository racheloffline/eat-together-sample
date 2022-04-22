import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import {Layout, Section, SectionContent, Text} from 'react-native-rapi-ui';

const HorizontalSwitch = props => {
    return (
        <View style={styles.outline}>
            <View style={styles.head}></View>
            <View style={[styles.body, {backgroundColor: props.color}]}></View>
        </View>
    );
}

const styles = StyleSheet.create({
    outline: {
        padding: 10
    },
    head: {
        width: 370,
        height: 70,
        backgroundColor: "grey",
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15
    },
    body: {
        width: 370,
        height: 100,
        backgroundColor: "red",
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15
    }
})

export default HorizontalSwitch;