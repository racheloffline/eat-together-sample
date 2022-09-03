import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Me from "./Me";
import Edit from "./Edit";
import EditTags from "./EditTags";
import Connections from "./Connections";
import Requests from "./Requests";

import Settings from "./Settings";
import FullCard from "./FullCard";
import ReportBug from "./ReportBug";
import SuggestIdea from "./SuggestIdea";
import FullProfile from "../Explore/People/FullProfile";
import ReportPerson from "../Explore/People/ReportPerson";

import AvailabilitiesHome from "./Availabilities/AvailabilitiesHome";
import EditDay from "./Availabilities/EditDay";

const Stack = createStackNavigator();

export default function () {
  return (
    <Stack.Navigator
      initialRouteName="Me"
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
    >
      <Stack.Screen name="Me" component={Me} />
      <Stack.Screen name="Edit" component={Edit} />
      <Stack.Screen name="EditTags" component={EditTags} />
      <Stack.Screen name="Connections" component={Connections} />
      <Stack.Screen name="Requests" component={Requests} />

      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="FullCard" component={FullCard} />
      <Stack.Screen name="Report Bug" component={ReportBug} />
      <Stack.Screen name="Suggest Idea" component={SuggestIdea} />
      <Stack.Screen name="FullProfile" component={FullProfile} />
      <Stack.Screen name="ReportPerson" component={ReportPerson} />

      <Stack.Screen name="AvailabilitiesHome" component={AvailabilitiesHome} />
      <Stack.Screen name="EditDay" component={EditDay} />
    </Stack.Navigator>
  );
}
