import React, { useState, useEffect } from 'react';
import {View} from 'react-native';
import { auth } from '../provider/Firebase';

import Button from '../components/Button';
import LargeText from '../components/LargeText';
import NormalText from '../components/NormalText';

export default function ({ navigation }) {
    const user = auth.currentUser;
    const [resent, setResent] = useState(false);

    useEffect(() => {
        console.log(user);
    }, [])

    const resend = () => {
        user.sendEmailVerification();
        setResent(true);
    }
    return (
        <View style={{
            flex: 1,
            alignItems: "center",
            paddingHorizontal: 20,
            justifyContent: "center"
        }}>
            <LargeText center>Check your email inbox to verify your account!</LargeText>
            <View style={{marginBottom: 50, marginTop: 20}}>
                <Button onPress={resend} marginVertical={5}>Resend Verification</Button>
                {resent && <NormalText color="#5DB075" center>Sent!</NormalText>}
            </View>

            <Button onPress={() => {
                auth.signOut().then(r => {});
            }}>Logout</Button>
        </View>
    );
}