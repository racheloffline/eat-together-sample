import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";

import Explore from './Explore';
import FullCard from './FullCard';
import ExploreYourEvents from "./ExploreYourEvents";
import FullCardPrivate from "./FullCardPrivate";
import EditEvent from "./EditEvent";

import Invite from "../Invite/Invite";
import InviteFull from "../Invite/InviteFull";
import Connections from "../Profile/Connections";
import Requests from "../Profile/Requests";
import FullProfile from "../People/FullProfile";
import Report from "../People/Report";
//import InviteMain from "../Invite/InviteMain";

import Chats from "../Invite/Chats";
import ChatRoom from "../Invite/ChatRoom";
import ReportEvent from "./ReportEvent";

const Stack = createStackNavigator();

export default function ({ navigation }) {
    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator initialRouteName="Explore" >
                <Stack.Screen name="Explore" options={{headerShown: false, animationEnabled: false}} component={Explore}/>
                <Stack.Screen name="ExploreYourEvents" options={{headerShown: false,  animationEnabled: false}} component={ExploreYourEvents}/>
                <Stack.Screen name="FullCard" options={{headerShown: false}} component={FullCard}/>
                <Stack.Screen name="FullCardPrivate" options={{headerShown: false}} component={FullCardPrivate}/>
                <Stack.Screen name="EditEvent" component={EditEvent} options={{headerShown: false}}/>
                {/*<Stack.Screen name="InviteMain" options={{headerShown: false}} component={InviteMain}/>*/}

                <Stack.Screen name="Invite" component={Invite} options={{headerShown: false}}/>
                <Stack.Screen name="InviteFull" component={InviteFull} options={{headerShown: false}}/>
                <Stack.Screen name="Connections" component={Connections} options={{headerShown: false, animationEnabled: true}}/>
                <Stack.Screen name="Requests" component={Requests} options={{headerShown: false, animationEnabled: false}}/>
                <Stack.Screen name="FullProfile" component={FullProfile} options={{headerShown: false}}/>
                <Stack.Screen name="Report" component={Report} options={{headerShown: false}}/>

                <Stack.Screen name="Chats" component={Chats} options={{headerShown: false, animationEnabled: false}}/>
                <Stack.Screen name="ChatRoom" component={ChatRoom} options={{headerShown: false}}/>
                <Stack.Screen name="ReportEvent" component={ReportEvent} options={{headerShown: false}}/>
            </Stack.Navigator>
        </NavigationContainer>
        );
}