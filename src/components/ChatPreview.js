import React, {useEffect, useState} from 'react';
import { View, StyleSheet, Image} from 'react-native';
import MediumText from "./MediumText";
import {TouchableOpacity} from "react-native";
import {storage} from "../provider/Firebase";
import SmallText from "./SmallText";

const ChatPreview = props => {
    const [image, setImage] = useState("https://static.wixstatic.com/media/d58e38_29c96d2ee659418489aec2315803f5f8~mv2.png");
    useEffect(() => { // TODO: Fix these pictures not showing up
        if (props.group.hasImage) {
            storage.ref("profilePictures/" + props.group.pictureID).getDownloadURL().then(uri => {
                setImage(uri);
            });
        }
    }, []);
    return (
        <View style={styles.outline}>
                <View style={styles.head}>
                    <View style={styles.headleft}>
                            <Image style={styles.image} source={{uri: image}}/>
                        <View style={styles.textContainer}>
                            <MediumText>{props.group.name}</MediumText>
                            <SmallText>{props.group.message}</SmallText>
                        </View>
                    </View>
                </View>
        </View>
    );
}

const styles = StyleSheet.create({
    outline: {
        padding: 10,
        alignItems: "center"
    },
    head: {
        width: 370,
        height: 80,
        backgroundColor: "white",
        borderRadius: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20
    },
    headleft: {
        flexDirection: "row",
        alignItems: "center"
    },
    textContainer: {
        flexDirection: "column",
        maxWidth: 250
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 90,
        borderColor: "white",
        borderWidth: 2,
        marginRight: 20
    },
    name: {
        marginRight: 20,
    }
})

export default ChatPreview;