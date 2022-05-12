import React from 'react';
import { View, StyleSheet, Image} from 'react-native';
import {CheckBox} from 'react-native-rapi-ui';
import LargeText from "./LargeText";
import MediumText from "./MediumText";

const MessageList = props => {
    const [attendees, setAttendees] = React.useState(props.attendees);
    const [checkBox, setCheckbox] = React.useState(false);
    return (
        <View style={styles.outline}>
            <View style={styles.head}>
                <View style={styles.headleft}>
                    <Image style={styles.image} source={{uri: props.person.profile}}/>
                    <MediumText>{props.person.name}</MediumText>
                </View>
                <View style={styles.checkbox}>
                    <CheckBox value={checkBox} onValueChange={(val)=>{alert("CHECKED")}} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    outline: {
        padding: 10
    },
    head: {
        width: 370,
        height: 80,
        backgroundColor: "grey",
        borderRadius: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    headleft: {
        flexDirection: "row",
        alignItems: "center"
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 90,
        borderColor: "white",
        borderWidth: 2,
        marginLeft: 25,
        marginRight: 20
    },
    name: {
        marginRight: 20,
    },
    checkbox: {
        marginRight: 25
    }
})

export default MessageList;