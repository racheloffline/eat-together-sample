import React, {useState} from "react";
import {View, StyleSheet, Image, Dimensions, ScrollView} from "react-native";
import {
    Layout,
    TopNav,
    Button
} from "react-native-rapi-ui";
import LargeText from "../../components/LargeText";
import MediumText from "../../components/MediumText";
import {Ionicons} from "@expo/vector-icons";
import admin from "firebase/compat";
import firebase from "firebase/compat";

import TextInput from "../../components/TextInput";

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
            <ScrollView contentContainerStyle={styles.page} scrollEnabled={false}>
                <View style={styles.header}>
                    <LargeText style={{padding: 20}} center>Please describe your new idea or feature.</LargeText>
                </View>
                <TextInput multiline={true} width={"100%"} height={130} mainContainerStyle={{alignItems: "flex-start"}} placeholder="Enter explanation here" value={report} onChangeText={val => setReport(val)}/>
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
            </ScrollView>
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