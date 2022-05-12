import React from 'react';
import { View, StyleSheet, Image} from 'react-native';
import MediumText from "./MediumText";

const PeopleList = props => {
    return (
        <View style={styles.outline}>
            <View style={[styles.head, {backgroundColor: props.color}]}>
                <View style={styles.headleft}>
                    <Image style={styles.image} source={{uri: props.person.profile}}/>
                    <MediumText style={{color: 'white'}}>{props.person.name}</MediumText>
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
    }
})

export default PeopleList;