import React from 'react';
import { View, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-rapi-ui';

import Tag from "./Tag";

const generateColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, '0');
    return `#${randomColor}`;
  };

const ProfileBubble = props => {
    return (
        <View style={[styles.card, {backgroundColor: generateColor()}]}>
            <TouchableOpacity onPress={props.click}>
                <Text size="h3" style={styles.white}>"{props.person.quote}"</Text>
                <View style={styles.row}>
                    <Text size="xl" style={styles.white}>- {props.person.name}</Text>

                    <View style={styles.tags}>
                        {props.person.tags.map(tag => <Tag text={tag} key={tag}/>)}
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 10,
        width: Dimensions.get('screen').width - 10,
        marginVertical: 10,
        borderRadius: 10
    },

    row: {
        display: "flex",
        flexDirection: "row",
        maxWidth: Dimensions.get('screen').width/1.55
    },

    tags: {
        flexDirection: "row",
        marginLeft: 15
    },

    white: {
        color: "white"
    },
})

export default ProfileBubble;