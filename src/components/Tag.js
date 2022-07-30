import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SmallText from "./SmallText";

const Tag = props => {
    return (
        <View style={styles.tag}>
            <SmallText color="white">{props.text}</SmallText>
            {props.remove && 
            <TouchableOpacity onPress={props.remove} style={styles.close}>
                <Ionicons name="close" size={16} color="white" />
            </TouchableOpacity>}
        </View>
    );
}

const styles = StyleSheet.create({
    tag: {
        justifyContent: 'center',
        flex: 0,
        backgroundColor: 'black',
        flexDirection: 'row',
        alignItems: 'center',
        margin: 2,
        borderRadius: 20,
        paddingVertical: 5,
        paddingHorizontal: 10,
    },

    close: {
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10
    }
})

export default Tag;