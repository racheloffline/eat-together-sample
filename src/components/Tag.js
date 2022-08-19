import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MediumText from './MediumText';

const Tag = props => {
    return (
        <View style={props.type ? [styles.tag, {
            backgroundColor: props.type === "school" ? "#856B2A"
                : props.type === "hobby" ? "#4C6FB1"
                : "#6C2087"
        }] : styles.tag}>
            <MediumText size={12} color="white">{props.text}</MediumText>
            {props.remove && 
                <TouchableOpacity onPress={props.remove} style={styles.close}>
                    <Ionicons name="close" size={16} color="white" />
                </TouchableOpacity>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    tag: {
        justifyContent: 'center',
        flex: 0,
        backgroundColor: '#666666',
        flexDirection: 'row',
        alignItems: 'center',
        margin: 2,
        borderRadius: 20,
        paddingVertical: 5,
        paddingHorizontal: 15,
    },

    close: {
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10
    }
})

export default Tag;