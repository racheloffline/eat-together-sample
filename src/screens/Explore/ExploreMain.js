import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";

import Explore from './Explore';
import FullCard from './FullCard';
import ExploreYourEvents from "./ExploreYourEvents";
import {View} from "react-native";
import FullCardPrivate from "./FullCardPrivate";
import Invite from "../Invite/Invite";
import InviteFull from "../Invite/InviteFull";

const Stack = createStackNavigator();

export default function ({ navigation }) {
    return (
            <NavigationContainer independent={true}>
                <Stack.Navigator initialRouteName="Explore" >
                    <Stack.Screen name="Explore" options={{headerShown: false, animationEnabled: false}} component={Explore}/>
                    <Stack.Screen name="ExploreYourEvents" options={{headerShown: false,  animationEnabled: false}} component={ExploreYourEvents}/>
                    <Stack.Screen name="FullCard" options={{headerShown: false}} component={FullCard}/>
                    <Stack.Screen name="FullCardPrivate" options={{headerShown: false}} component={FullCardPrivate}/>
                    <Stack.Screen name="Invite" component={Invite} options={{headerShown: false}}/>
                    <Stack.Screen name="InviteFull" component={InviteFull} options={{headerShown: false}}/>
                </Stack.Navigator>
            </NavigationContainer>
        );
}