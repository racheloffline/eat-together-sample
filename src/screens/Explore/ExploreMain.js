import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";

import Explore from './Explore';
import FullCard from './FullCard';

const Stack = createStackNavigator();

export default class ExploreMain extends React.PureComponent {
    render() {
        return (
            <NavigationContainer independent={true}>
                <Stack.Navigator initialRouteName="Explore">
                    <Stack.Screen name="Explore" options={{headerShown: false}}>
                        {props => <Explore {...props}/>}
                    </Stack.Screen>
                    <Stack.Screen name="FullCard" options={{headerShown: false}}>
                        {props => <FullCard {...props}/>}
                    </Stack.Screen>
                </Stack.Navigator>
            </NavigationContainer>
        );
    }
}