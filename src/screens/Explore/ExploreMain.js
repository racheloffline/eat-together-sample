import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";

import Explore from './Explore';
import FullCard from './FullCard';

const Stack = createStackNavigator();

export default function ({ navigation }) {
    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator initialRouteName="Explore">
                <Stack.Screen name="Explore" options={{headerShown: false}} component={Explore}/>
                <Stack.Screen name="FullCard" options={{headerShown: false}} component={FullCard}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}