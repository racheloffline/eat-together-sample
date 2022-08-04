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
                <MediumText color="white">{props.person.bio}</MediumText>
                <View style={styles.row}>
                    <NormalText color="white">
                        - {props.person.firstName + " " + props.person.lastName.substring(0, 1) + "."}
                    </NormalText>

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
        marginVertical: 5,
        borderRadius: 10,
        shadowColor: "#000000",
        shadowOpacity: 0.25,
        shadowOffset: {
            width: 0,
            height: 4
        },
        elevation: 5,
    },

    row: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        maxWidth: Dimensions.get('screen').width/1.5
    },

    tags: {
        flexDirection: "row",
        marginLeft: 15,
        flexWrap: "wrap"
    },
})

export default ProfileBubble;