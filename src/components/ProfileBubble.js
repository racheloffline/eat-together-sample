import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import MediumText from "./MediumText";
import NormalText from './NormalText';
import {generateColor} from "../methods";

import Tag from "./Tag";

const ProfileBubble = props => {
    const shuffledArr = arr => {
        const shuffled = [...arr]
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);
     
        return shuffled;
    }

    // Generates text for school tags in common with the user
    const generateSchoolText = tags => {
        const schoolTags = tags.filter(tag => tag.type === "school");

        if (schoolTags.length > 0) {
            let text = schoolTags[0].tag;

            for (let i = 1; i < schoolTags.length; i++) {
                text += ", " + schoolTags[i].tag;
            }

            return text;
        }
        
        return "";
    }

    // Generates text for hobby and food tags in common with the user
    const generateHobbyFoodText = tags => {
        const hobbyFoodTags = tags.filter(tag => tag.type === "hobby" || tag.type === "food");

        if (hobbyFoodTags.length > 0) {
            let text = hobbyFoodTags[0].tag;

            for (let i = 1; i < hobbyFoodTags.length; i++) {
                text += ", " + hobbyFoodTags[i].tag;
            }

            return text;
        }
        
        return "";
    }

    return (
        <View style={[styles.card, {backgroundColor: generateColor()}]}>
            <TouchableOpacity onPress={props.click}>
                <MediumText color="white">{props.person.bio}</MediumText>
                <View style={styles.row}>
                    <NormalText color="white">
                        {props.person.firstName + " " + props.person.lastName.substring(0, 1) + "."}
                    </NormalText>

                    <ScrollView horizontal={true} style={{ marginLeft: 10 }}>
                        <View onStartShouldSetResponder={() => true} style={{ flexDirection: "row" }}>
                            {shuffledArr(props.person.tags).slice(0, 2).map(tag =>
                                <Tag text={tag.tag} key={tag.tag} type={tag.type}/>)}
                        </View>
                    </ScrollView>
                </View>
                
                {props.person.inCommon.length > 0 && (<View style={styles.common}>
                    {generateSchoolText(props.person.inCommon) !== "" && (<View style={styles.commonRow}>
                        <NormalText color="white">🏫 You both are </NormalText>
                        <MediumText color="white" size={14}>{generateSchoolText(props.person.inCommon)}</MediumText>
                    </View>)}
                    {generateHobbyFoodText(props.person.inCommon) !== "" && (<View style={styles.commonRow}>
                        <NormalText color="white">🙂 You both enjoy </NormalText>
                        <MediumText color="white" size={14}>{generateHobbyFoodText(props.person.inCommon)}</MediumText>
                    </View>)}
                </View>)}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        width: Dimensions.get('screen').width - 40,
        borderRadius: 10,
        marginVertical: 5
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%"
    },

    common: {
        marginTop: 10
    },

    commonRow: {
        flexDirection: "row",
        alignItems: "center",
    }
})

export default ProfileBubble;