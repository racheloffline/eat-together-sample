import { View, StyleSheet } from "react-native";
import firebase from "firebase";
import MediumText from "./MediumText";
const TextMessage = props => {
    const user = firebase.auth().currentUser;
    return (
        <View style={props.sentBy == user.uid ? styles.you : styles.other} borderRadius={20}>
            <MediumText color="white">{props.message}</MediumText>
        </View>
    );
}

const styles = StyleSheet.create({
    you : {
        backgroundColor: "#5db075",
        borderRadius: 20,
        marginHorizontal: 30,
        marginVertical: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
        alignSelf: "flex-end",
        maxWidth: 200
    },
    other : {
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