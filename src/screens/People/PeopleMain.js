import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";

import People from './People';
import FullProfile from "./FullProfile";

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
                </Stack.Navigator>
            </NavigationContainer>
        );
    }
}