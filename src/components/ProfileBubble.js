import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import MediumText from "./MediumText";
import NormalText from './NormalText';
import {generateColor} from "../methods";

import Tag from "./Tag";

const ProfileBubble = props => {
    return (
        <View style={[styles.card, {backgroundColor: generateColor()}]}>
            <TouchableOpacity onPress={props.click}>
                <MediumText color="white">"{props.person.quote}"</MediumText>
                <View style={styles.row}>
                    <NormalText color="white">- {props.person.name}</NormalText>

                    <View style={styles.tags}>
                        {props.person.tags.slice(0, 4).map(tag => <Tag text={tag} key={tag}/>)}
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
        alignItems: "center",
        maxWidth: Dimensions.get('screen').width/1.7
    },

    tags: {
        flexDirection: "row",
        marginLeft: 15,
        flexWrap: "wrap"
    },
})

export default ProfileBubble;