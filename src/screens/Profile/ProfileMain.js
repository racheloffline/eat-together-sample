import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";

import Me from './Me';
import Settings from './Settings';
import Schedule from './Schedule'

const profStack = createStackNavigator();

export default function ({ navigation }) {
    return (
        <NavigationContainer independent={true}>
            <profStack.Navigator initialRouteName="Explore" >
                <profStack.Screen name="Me" component={Me}/>
                <profStack.Screen name="Settings" component={Settings}/>
                <profStack.Screen name="Schedule" component={Schedule}/>
            </profStack.Navigator>
        </NavigationContainer>
    );
}
