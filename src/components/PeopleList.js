import React, {useEffect, useState} from 'react';
import { View, StyleSheet, Image} from 'react-native';
import MediumText from "./MediumText";
import {TouchableOpacity} from "react-native";
import {storage} from "../provider/Firebase";

const PeopleList = props => {
    const [image, setImage] = useState("https://static.wixstatic.com/media/d58e38_29c96d2ee659418489aec2315803f5f8~mv2.png");
    useEffect(() => {
        if (props.person.hasImage) {
            storage.ref("profilePictures/" + props.person.id).getDownloadURL().then(uri => {
                setImage(uri);
            });
        }
    }, []);
    return (
        <View style={styles.outline}>
            <TouchableOpacity onPress={props.click}>
                <View style={[styles.head, {backgroundColor: props.color}]}>
                    <View style={styles.headleft}>
                        <Image style={styles.image} source={{uri: image}}/>
                        <MediumText style={{color: 'white'}}>{props.person.name}</MediumText>
                    </View>
                </View>
            </TouchableOpacity>
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
    }
})

export default PeopleList;