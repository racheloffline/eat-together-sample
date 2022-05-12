import React from 'react';
import {Button, View} from 'react-native';
import { Layout, Text } from 'react-native-rapi-ui';
import firebase from "firebase";

export default function ({ navigation }) {
    return (
        <Layout>
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Text>This is your profile!</Text>
                <Button
                    onPress={() => {
                        firebase.auth().signOut().then(r => {});
                    }}
                    title="Log Out"
                    color="#841584"
                />
                <Button
                    onPress={()=>{
                        navigation.navigate("Schedule");
                    }}
                    title="Schedule"
                    />
                <Button
                    onPress={()=>{
                        navigation.navigate("Connections");
                    }}
                    title="Connections"
                />
            </View>
        </Layout>
    );
}

