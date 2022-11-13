import { View, StyleSheet } from "react-native";
import firebase from "firebase/compat";
import NormalText from "./NormalText";

import moment from "moment";
import getDate from "../getDate";
import getTime from "../getTime";

const TextMessage = props => {
    const user = firebase.auth().currentUser;
    const messageDate = moment.unix(props.sentAt).toDate();

    return (
        <View style={props.sentBy == user.uid ? styles.you : styles.other} borderRadius={20}>
            {props.sentName && <NormalText color="#666666" size={12}>{props.sentName}</NormalText>}
            <NormalText color="#666666" size={12}>{getDate(messageDate, false)}, {getTime(messageDate)}</NormalText>
            <NormalText color="white" size={16}>{props.message}</NormalText>
        </View>
    );
}

const styles = StyleSheet.create({
    you: {
        backgroundColor: "#5db075",
        borderRadius: 20,
        marginHorizontal: 30,
        marginVertical: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
        alignSelf: "flex-end",
        maxWidth: 200
    },
    
    other: {
        backgroundColor: "#C0C0C0",
        borderRadius: 20,
        marginHorizontal: 30,
        marginVertical: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
        alignSelf: "flex-start",
        maxWidth: 200
    },
});

export default TextMessage;