import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./Home";
import WhileYouEat from "./WhileYouEat";
import ReportEvent from "./ReportEvent";
import EditEvent from "./EditEvent";
import FullProfile from "../Explore/People/FullProfile";

import Connections from "../Profile/Connections";
import Requests from "../Profile/Requests";
import FullProfile from "../Explore/People/FullProfile";
import FullCard from "../Explore/FullCard";
import ReportPerson from "../Explore/People/ReportPerson";

const Stack = createStackNavigator();

export default function () {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="WhileYouEat" component={WhileYouEat} />
      <Stack.Screen name="ReportEvent" component={ReportEvent} />
      <Stack.Screen name="EditEvent" component={EditEvent} />

      <Stack.Screen name="Connections" component={Connections} />
      <Stack.Screen name="Requests">
        {props => <Requests {...props} back="Home" />}
      </Stack.Screen>
      <Stack.Screen name="FullProfile" component={FullProfile} />
      <Stack.Screen name="FullCard" component={FullCard} />
      <Stack.Screen name="ReportPerson" component={ReportPerson} />
    </Stack.Navigator>
  );
}
