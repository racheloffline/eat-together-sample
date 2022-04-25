import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import {Layout, Section, SectionContent, Text} from 'react-native-rapi-ui';

const HorizontalSwitch = props => {
    let style_left = null;
    let style_right = null;
    let action_left = null;
    let action_right = null;
    if (props.current == "left") {
        style_left = styles.leftCurrent;
        style_right = styles.rightOther;
        action_right = props.press;
        action_left = (val) => console.log("pressed");
    } else {
        style_left = styles.leftOther;
        style_right = styles.rightCurrent;
        action_left = props.press;
        action_right = (val) => console.log("pressed");
    }
    return (
        <Layout style={styles.container}>
            <TouchableOpacity style={style_left} onPress={action_left}>
                <Text style={styles.buttonText}>{props.left}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={style_right} onPress={action_right}>
                <Text style={styles.buttonText}>{props.right}</Text>
            </TouchableOpacity>
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        paddingTop: 10,
        paddingHorizontal: 60,
        paddingBottom: 70
    },
   leftCurrent : {
       height: 40,
       flex: 1,
       borderBottomLeftRadius: 30,
       borderTopLeftRadius: 30,
       backgroundColor: "#5db075"
   },
    rightCurrent : {
        height: 40,
        flex: 1,
        borderBottomRightRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: "#5db075"

    },
    leftOther: {
        height: 40,
        flex: 1,
        borderBottomLeftRadius: 30,
        borderTopLeftRadius: 30,
        backgroundColor: "#C0C0C0"
    },
    rightOther: {
        height: 40,
        flex: 1,
        borderBottomRightRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: "#C0C0C0"
    },
    buttonText: {
        textAlign: "center",
        marginTop: 10,
        color: "white"
    }
})

export default HorizontalSwitch;