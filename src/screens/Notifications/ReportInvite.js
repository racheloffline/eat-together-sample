import React, {useState} from "react";
import {View, StyleSheet, Dimensions, Keyboard, TouchableWithoutFeedback, ScrollView} from "react-native";
import {Layout, TopNav, Button, TextInput} from "react-native-rapi-ui";
import LargeText from "../../components/LargeText";
import MediumText from "../../components/MediumText";
import {Ionicons} from "@expo/vector-icons";
import admin from "firebase";
import firebase from "firebase";
import keyboard from "react-native-web/dist/exports/Keyboard";

const ReportInvite = ({ route, navigation }) => {
    const [report, setReport] = useState("");
    return (
        <Layout>
            <TopNav
                middleContent={<MediumText center>Report Invite</MediumText>}
                leftContent={<Ionicons name="chevron-back" size={20} />}
                leftAction={() => navigation.goBack()}
            />
            <ScrollView contentContainerStyle={styles.page} scrollEnabled={false}>
                <View style={styles.header}>
                    <LargeText
                        style={{ padding: 20 }}
                        center
                    >
                        We're sorry for your unfortunate experience. Please describe the
                        issue.
                    </LargeText>
                </View>
                <TextInput
                    multiline={true}
                    containerStyle={{ paddingBottom: 70 }}
                    placeholder="Enter explanation here"
                    value={report}
                    onChangeText={(val) => setReport(val)}
                />
                <Button
                    style={{ marginTop: 20 }}
                    text="Report"
                    status="danger"
                    onPress={() => {
                        admin
                            .firestore()
                            .collection("mail")
                            .add({
                                to: "eat.together.team@gmail.com",
                                message: {
                                    subject:
                                        "INVITE REPORT ON " +
                                        route.params.inviteID +
                                        " by " +
                                        firebase.auth().currentUser.uid,
                                    text: report,
                                },
                            })
                            .then(() => {
                                alert(
                                    "The team has been notified of your report and we will take action as soon as possible."
                                );
                                navigation.goBack();
                            });
                    }}
                />
            </ScrollView>
        </Layout>
    );
};

const styles = StyleSheet.create({
    page: {
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 40
    },

    header: {
        backgroundColor: "pink",
        width: Dimensions.get('screen').width,
        marginBottom: 20,
        alignItems: "center"
    }
});

export default ReportInvite;