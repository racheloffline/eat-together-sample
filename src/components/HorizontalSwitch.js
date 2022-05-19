import React from 'react';
import {View, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import MediumText from './MediumText';

const HorizontalSwitch = props => {
    let style_left = null;
    let style_right = null;
    let action_left = null;
    let action_right = null;
    if (props.current == "left") {
        style_left = styles.leftCurrent;
        style_right = styles.rightOther;
        action_right = props.press;
    } else {
        style_left = styles.leftOther;
        style_right = styles.rightCurrent;
        action_left = props.press;
    }
    return (
        <View style={styles.container}>
            <TouchableOpacity style={style_left} onPress={action_left}>
                <MediumText center color="white" size={16}>{props.left}</MediumText>
            </TouchableOpacity>
            <TouchableOpacity style={style_right} onPress={action_right}>
                <MediumText center color="white" size={16}>{props.right}</MediumText>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        paddingTop: 10,
        paddingHorizontal: 60,
        paddingBottom: 30,
        alignItems: "center",
        justifyContent: "center"
    },

    leftCurrent: {
        height: 40,
        flex: 1,
        borderBottomLeftRadius: 30,
        borderTopLeftRadius: 30,
        backgroundColor: "#5db075",
        alignItems: "center",
        justifyContent: "center"
    },

    rightCurrent: {
        height: 40,
        flex: 1,
        borderBottomRightRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: "#5db075",
        alignItems: "center",
        justifyContent: "center"
    },

    leftOther: {
        height: 40,
        flex: 1,
        borderBottomLeftRadius: 30,
        borderTopLeftRadius: 30,
        backgroundColor: "#C0C0C0",
        alignItems: "center",
        justifyContent: "center"
    },

    rightOther: {
        height: 40,
        flex: 1,
        borderBottomRightRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: "#C0C0C0",
        alignItems: "center",
        justifyContent: "center"
    },

    buttonText: {
        textAlign: "center",
        color: "white"
    }
});

export default HorizontalSwitch;