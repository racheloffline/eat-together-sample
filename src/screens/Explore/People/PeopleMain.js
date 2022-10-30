import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import People from "./People";
import ReportPerson from "./ReportPerson";
import FullProfile from "./FullProfile";
import FullCard from '../FullCard';

import Connections from "../../Connections/Connections";
import Requests from "../../Connections/Requests";
import ReportEvent from "../../Home/ReportEvent";

const Stack = createStackNavigator();

export default function () {
  return (
    <Stack.Navigator
      initialRouteName="People"
      screenOptions={{
        headerShown: false,
        animationEnabled: false,
      }}
    >
      <Stack.Screen name="People" component={People} />
      <Stack.Screen name="FullProfile">
        {props => <FullProfile {...props} blockBack="People" />}
      </Stack.Screen>
      <Stack.Screen name="ReportPerson" component={ReportPerson} />
      <Stack.Screen name="FullCard" component={FullCard}/>

      <Stack.Screen name="Connections" component={Connections} />
      <Stack.Screen name="Requests">
        {props => <Requests {...props} back="People" />}
      </Stack.Screen>
      <Stack.Screen name="ReportEvent" component={ReportEvent}/>
    </Stack.Navigator>
  );
}
