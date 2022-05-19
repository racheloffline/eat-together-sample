import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";

import Invite from "../Invite/Invite";
import InviteFull from "../Invite/InviteFull";
import Connections from "../Profile/Connections";
import Requests from "../Profile/Requests";
import FullProfile from "../People/FullProfile";
import Report from "../People/Report";
import Chats from "../Invite/Chats";
import OrganizeMain from "../Organize/OrganizeMain";
import ExploreMain from "../Explore/ExploreMain";
import PeopleMain from "../People/PeopleMain";

const Stack = createStackNavigator();

export default function () {
    return (
        <NavigationContainer independent = {true}>
            <Stack.Navigator initialRouteName="Invite">
                <Stack.Screen name="PeopleMain" component={PeopleMain} />
                <Stack.Screen name="ExploreMain" component={ExploreMain} />
                <Stack.Screen name="OrganizeMain" component={OrganizeMain}/>
                <Stack.Screen name="Chats" component={Chats} options={{headerShown: false, animationEnabled: false}}/>
                <Stack.Screen name="Invite" component={Invite} options={{headerShown: false, animationEnabled: false}}/>
                <Stack.Screen name="InviteFull" component={InviteFull} options={{headerShown: false}}/>
                <Stack.Screen name="Connections" component={Connections} options={{headerShown: false}}/>
                <Stack.Screen name="Requests" component={Requests} options={{headerShown: false}}/>
                <Stack.Screen name="FullProfile" component={FullProfile} options={{headerShown: false}}/>
                <Stack.Screen name="Report" component={Report} options={{headerShown: false}}/>
            </Stack.Navigator>
        </NavigationContainer>
    )
}

