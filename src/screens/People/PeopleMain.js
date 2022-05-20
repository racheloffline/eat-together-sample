import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";

import People from './People';
import FullProfile from "./FullProfile";
import Invite from "../Invite/Invite";
import InviteFull from "../Invite/InviteFull";
import Connections from "../Profile/Connections";
import Requests from "../Profile/Requests";
import Report from "./Report";
//import InviteMain from "../Invite/InviteMain";
import Chats from "../Invite/Chats";

const Stack = createStackNavigator();

export default class PeopleMain extends React.PureComponent {
    render() {
        return (
            <NavigationContainer independent={true}>
                <Stack.Navigator initialRouteName="People">
                    <Stack.Screen name="People" options={{headerShown: false}}>
                        {props => <People {...props}/>}
                    </Stack.Screen>
                    <Stack.Screen name="FullProfile" options={{headerShown: false}}>
                        {props => <FullProfile {...props}/>}
                    </Stack.Screen>
                    {/*<Stack.Screen name="InviteMain" options={{headerShown: false}} component={InviteMain}/>*/}
                    <Stack.Screen name="Invite" component={Invite} options={{headerShown: false}}/>
                    <Stack.Screen name="InviteFull" component={InviteFull} options={{headerShown: false}}/>
                    <Stack.Screen name="Chats" component={Chats} options={{headerShown: false, animationEnabled: false}}/>
                    <Stack.Screen name="Connections" component={Connections} options={{headerShown: false, animationEnabled: true}}/>
                    <Stack.Screen name="Requests" component={Requests} options={{headerShown: false, animationEnabled: false}}/>
                    <Stack.Screen name="Report" component={Report} options={{headerShown: false}}/>
                </Stack.Navigator>
            </NavigationContainer>
        );
    }
}