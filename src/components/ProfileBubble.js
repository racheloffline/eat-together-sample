import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import MediumText from "./MediumText";
import NormalText from './NormalText';

import Tag from "./Tag";

const ProfileBubble = props => {
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
        <View style={[styles.card, {}]}>
            <TouchableOpacity onPress={props.click}>
                <MediumText size={18}>{props.person.bio}</MediumText>
                <View style={styles.row}>
                    <NormalText>
                        {props.person.firstName + " " + props.person.lastName.substring(0, 1) + "."}
                    </NormalText>

                    <ScrollView horizontal={true} style={{ marginLeft: 10 }}>
                        <View onStartShouldSetResponder={() => true} style={{ flexDirection: "row" }}>
                            {props.person.selectedTags.map(tag =>
                                <Tag text={tag.tag} key={tag.tag} type={tag.type}/>)}
                        </View>
                    </ScrollView>
                </View>
                
                {props.person.inCommon.length > 0 && (<View style={styles.common}>
                    {generateSchoolText(props.person.inCommon) !== "" && (<View style={styles.commonRow}>
                        <NormalText>🏫 You both are: {generateSchoolText(props.person.inCommon)} </NormalText>
                    </View>)}
                    {generateHobbyFoodText(props.person.inCommon) !== "" && (<View style={styles.commonRow}>
                        <NormalText>🙂 You both enjoy: {generateHobbyFoodText(props.person.inCommon)} </NormalText>
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
        marginVertical: 5,
        backgroundColor: "white"
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
        flexWrap: "wrap"
    }
})

export default ProfileBubble;