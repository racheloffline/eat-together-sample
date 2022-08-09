import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SmallText from "./SmallText";

const Tag = props => {
    return (
        <View style={styles.tag}>
        {/*tag text isn't as bold as in figma, not sure how to update w/o fontWeight */}
            <SmallText size={14} color="black">{props.text}</SmallText>
            {props.remove && 
            <TouchableOpacity onPress={props.remove} style={styles.close}>
                <Ionicons name="close" size={16} color="black" />
            </TouchableOpacity>}
        </View>
    );
}

const styles = StyleSheet.create({
    tag: {
        justifyContent: 'center',
        flex: 0,
        backgroundColor: '#D9D9D9',
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