import React from 'react';
import { View, StyleSheet, Image} from 'react-native';
import {CheckBox} from 'react-native-rapi-ui';
import LargeText from "./LargeText";
import MediumText from "./MediumText";

const HorizontalSwitch = props => {
    const [checkBox, setCheckbox] = React.useState(false);
    return (
        <View style={styles.outline}>
            <View style={styles.head}>
                <View style={styles.headleft}>
                <Image style={styles.image} source={{uri: props.person.profile}}/>
                <LargeText>{props.person.name}</LargeText>
                </View>
                <View style={styles.checkbox}>
                    <CheckBox value={checkBox} onValueChange={(val) => setCheckbox(val)} />
                </View>
            </View>
            <View style={[styles.body, {backgroundColor: props.color}]}>
                <MediumText>"{props.person.quote}"</MediumText>
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

export default HorizontalSwitch;