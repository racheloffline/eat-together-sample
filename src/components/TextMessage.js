const TextMessage = props => {
    const user = firebase.auth().currentUser;
    return (
        <View style={props.sentBy == user.uid ? styles.you : styles.other} borderRadius={20}>
            <SmallText color="white">{props.message}</SmallText>
        </View>
    );
}

const styles = StyleSheet.create({
    you : {
        backgroundColor: "#5db075",
        borderRadius: 20,
    },
    other : {
        backgroundColor: "#C0C0C0",
        borderRadius: 20
    },
});

export default TextMessage;