import React, {useState} from "react";
import {View, StyleSheet, Dimensions, ScrollView} from "react-native";
import {
    Layout,
    TopNav,
    Button
} from "react-native-rapi-ui";
import TextInput from "../../components/TextInput";
import LargeText from "../../components/LargeText";
import MediumText from "../../components/MediumText";
import {Ionicons} from "@expo/vector-icons";
import admin from "firebase/compat";
import firebase from "firebase/compat";

const ReportBug = ({ route, navigation }) => {
    const [report, setReport] = useState('');
    return (
        <Layout>
            <TopNav
                middleContent={
                    <MediumText center>Report Bug</MediumText>
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
                    <LargeText style={{padding: 20}} center>We're sorry for your unfortunate experience. Please describe the issue.</LargeText>
                </View>
                <TextInput multiline={true} width={"100%"} height={130} placeholder="Enter explanation here" value={report} onChangeText={val => setReport(val)}/>
                <Button style={{marginTop: 20}} text="Report" status="danger" onPress={() => {
                    admin
                        .firestore()
                        .collection("mail")
                        .add({
                            to: "eat.together.team@gmail.com",
                            message: {
                                subject: "BUG REPORT BY: " + firebase.auth().currentUser.uid,
                                text: report,
                            },
                        })
                        .then(() => {
                            alert("Thank you for reporting this bug. We will look in to it as soon as possible.")
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
        backgroundColor: "pink",
        width: Dimensions.get('screen').width,
        marginBottom: 20
    }
});

export default ReportBug;