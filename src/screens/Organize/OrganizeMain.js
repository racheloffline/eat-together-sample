import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";

import OrganizePrivate from './OrganizePrivate';
import OrganizePublic from "./OrganizePublic";
import InvitePeople from "./InvitePeople";
import ExploreMain from '../Explore/ExploreMain';
import Invite from "../Invite/Invite";
import InviteFull from "../Invite/InviteFull";
import Connections from "../Profile/Connections";
import Requests from "../Profile/Requests";
import FullProfile from "../People/FullProfile";
import Report from "../People/Report";

const Stack = createStackNavigator();

export default function ({ navigation }) {
    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator initialRouteName="OrganizePrivate">
                <Stack.Screen name="OrganizePublic" options={{headerShown: false,  animationEnabled: false}} component={OrganizePublic}/>
                <Stack.Screen name="OrganizePrivate" options={{headerShown: false, animationEnabled: false}} component={OrganizePrivate}/>
                <Stack.Screen name="InvitePeople" options={{headerShown: false}} component={InvitePeople}/>
                <Stack.Screen name="Invite" component={Invite} options={{headerShown: false}}/>
                <Stack.Screen name="InviteFull" component={InviteFull} options={{headerShown: false}}/>
                <Stack.Screen name="Connections" component={Connections} options={{headerShown: false}}/>
                <Stack.Screen name="Requests" component={Requests} options={{headerShown: false}}/>
                <Stack.Screen name="FullProfile" component={FullProfile} options={{headerShown: false}}/>
                <Stack.Screen name="Report" component={Report} options={{headerShown: false}}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}