import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import MediumText from "./MediumText";
import NormalText from './NormalText';
import {generateColor} from "../methods";

import Tag from "./Tag";

const ProfileBubble = props => {
    return (
        <View style={[styles.card, {borderTopColor: generateColor()}]}>
            <TouchableOpacity onPress={props.click}>
                <MediumText>{props.person.firstName + " " + props.person.lastName.substring(0, 1) + "."}</MediumText>
                <View style={styles.row}>
                    <NormalText>
                        - {props.person.firstName + " " + props.person.lastName.substring(0, 1) + "."}
                    </NormalText>

                    <ScrollView horizontal={true} style={{ marginLeft: 10 }}>
                        <View onStartShouldSetResponder={() => true} style={{ flexDirection: "row" }}>
                            {props.person.tags.slice(0, 4).map(tag => <Tag text={tag} key={tag}/>)}
                        </View>
                    </ScrollView>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 10,
        width: Dimensions.get('screen').width,
        borderTopWidth: 1
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%"
    }
})

export default ProfileBubble;