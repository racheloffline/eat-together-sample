import React, {useEffect} from 'react';
import { View, StyleSheet, Image} from 'react-native';
import {CheckBox} from 'react-native-rapi-ui';
import LargeText from "./LargeText";
import MediumText from "./MediumText";
import {storage} from "../provider/Firebase";
import {TouchableOpacity} from "react-native";

const InvitePerson = props => {
    const [attendees, setAttendees] = React.useState(props.attendees);
    const [checkBox, setCheckbox] = React.useState(false);
    const [image, setImage] = React.useState("");
    const [quote, setQuote] = React.useState("");
    useEffect(() => {
        if (props.person.hasImage) {
            storage.ref("profilePictures/" + props.person.personID).getDownloadURL().then(uri => {
                setImage(uri);
            });
        }
        if (props.person.quote.length > 31) {
            setQuote(props.person.quote.substr(0, 28) + "...");
        } else {
            setQuote(props.person.quote);
        }
    })
    return (
        <View style={styles.outline}>
            <View style={styles.head}>
                <TouchableOpacity onPress={() => {
                    props.navigation.navigate("FullProfile", {
                        person: props.person
                    });
                }}>
                    <View style={styles.headleft}>
                    <Image style={styles.image} source={{uri: image === "" ? "https://static.wixstatic.com/media/d58e38_29c96d2ee659418489aec2315803f5f8~mv2.png" : image}}/>
                    <MediumText>{props.person.name}</MediumText>
                    </View>
                </TouchableOpacity>
                <View style={styles.checkbox}>
                    <CheckBox value={checkBox} onValueChange={(val) => {
                        setCheckbox(val);
                        const curr = attendees;
                        const isName = (elem) => elem == props.person.personID;
                        if (val) { // Add attendee
                            if (curr.length == 0) { // Undisable the "send invites" button
                                props.undisable();
                            }

                            let index = curr.findIndex(isName);
                            if (index == -1) {
                                curr.push(props.person.personID.toString());
                            }
                        } else { // Remove attendee
                            if (curr.length == 1) { // Disable the "send invites" button
                                props.disable();
                            }

                            let index = curr.findIndex(isName);
                            if (index != -1) {
                                curr.splice(index, 1);
                            }
                        }
                        setAttendees(curr);
                    }} />
                </View>
            </View>
            <View style={[styles.body, {backgroundColor: props.color}]}>
                <MediumText>"{quote}"</MediumText>
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
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    body: {
        width: 370,
        height: 100,
        backgroundColor: "red",
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        padding: 30,
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

export default InvitePerson;