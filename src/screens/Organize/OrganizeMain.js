import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";

import OrganizePrivate from './OrganizePrivate';
import OrganizePublic from "./OrganizePublic";
import InvitePeople from "./InvitePeople";

const Stack = createStackNavigator();

export default function ({ navigation }) {
    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator initialRouteName="OrganizePrivate" >
                <Stack.Screen name="OrganizePrivate" options={{headerShown: false, animationEnabled: false}} component={OrganizePrivate}/>
                <Stack.Screen name="OrganizePublic" options={{headerShown: false,  animationEnabled: false}} component={OrganizePublic}/>
                <Stack.Screen name="InvitePeople" options={{headerShown: false}} component={InvitePeople}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}