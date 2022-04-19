import React from 'react';
import { View, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import { Section, SectionContent, SectionImage } from 'react-native-rapi-ui';
import MediumText from './MediumText';
import NormalText from './NormalText';

const EventCard = props => {
    return (
        <Section style={styles.card} borderRadius={30}>
            <TouchableOpacity onPress={props.click}>
                <SectionImage source={{uri: props.event.image}}/>

                <SectionContent>
                    <View style={styles.details}>
                        {props.event.host.image ? <Image style={styles.profile} source={{uri: props.event.host.image}}/> : 
                            <View style={styles.profile}/>}
                        <View style={{flexDirection: "column"}}>
                            <MediumText>{props.event.name}</MediumText>
                            <NormalText>{props.event.location} | {props.event.date} | {props.event.time}</NormalText>
                        </View>
                    </View>
                </SectionContent>
            </TouchableOpacity>
        </Section>
    );
}

const styles = StyleSheet.create({
    card: {
        shadowColor: "#000000",
        shadowOpacity: 0.25,
        shadowOffset: {
            width: 0, 
            height: 4
        },
        elevation: 20,
        width: Dimensions.get('window').width - 50,
        marginBottom: 10
    },

    image: {
        width: Dimensions.get('window').width - 50,
        height: 150,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },

    details: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
    },

    profile: {
        backgroundColor: "#5DB075",
        borderWidth: 2,
        borderColor: "#5DB075",
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 10
    }
})

export default EventCard;