import React, {useState} from "react";
import {View, StyleSheet, Image, Dimensions} from "react-native";
import {
    Layout,
    TopNav,
    Text,
    themeColor,
    useTheme,
    Button, TextInput
} from "react-native-rapi-ui";
import LargeText from "../../components/LargeText";
import MediumText from "../../components/MediumText";
import NormalText from "../../components/NormalText";
import {FontAwesome, Ionicons} from "@expo/vector-icons";
import getDate from "../../getDate";
import admin from "firebase";
import firebase from "firebase";

const SuggestIdea = ({ route, navigation }) => {
    const [report, setReport] = useState('');
    return (
        <Layout>
            <TopNav
                middleContent={
                    <MediumText center>Suggest Idea</MediumText>
                }
                leftContent={
                    <Ionicons
                        name="chevron-back"
                        size={20}
                    />
                }
                leftAction={() => navigation.goBack()}
            />
            <View style={styles.page}>
                <View style={styles.header}>
                    <LargeText style={{marginVertical: 50, marginHorizontal: 20}} center>Please describe your new idea or feautre.</LargeText>
                </View>
                <TextInput multiline={true} containerStyle={{paddingBottom: 70}} placeholder="Enter explanation here" value={report} onChangeText={val => setReport(val)}/>
                <Button style={{marginTop: 20}} text="Submit" onPress={() => {
                    admin
                        .firestore()
                        .collection("mail")
                        .add({
                            to: "eat.together.team@gmail.com",
                            message: {
                                subject: "FEATURE SUGGESTION BY: " + firebase.auth().currentUser.uid,
                                text: report,
                            },
                        })
                        .then(() => {
                            alert("Thank you for the suggestion! Happy eating!")
                            navigation.goBack();
                        });
                }}/>
            </View>
        </Layout>
    );
}

const styles = StyleSheet.create({
    page: {
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 40
    },

    header: {
        backgroundColor: "lemonchiffon",
        width: Dimensions.get('screen').width,
        marginBottom: 20
    }
});

export default SuggestIdea;