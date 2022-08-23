import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Me from "./Me";
import Edit from "./Edit";
import EditTags from "./EditTags";
import Connections from "./Connections";
import Requests from "./Requests";
import Schedule from "./Schedule";
import Settings from "./Settings";
import FullCard from "./FullCard";
import ReportBug from "./ReportBug";
import SuggestIdea from "./SuggestIdea";

const Stack = createStackNavigator();

export default function () {
  return (
    <Stack.Navigator
      initialRouteName="Me"
      screenOptions={{
        headerShown: false,
        animationEnabled: false,
      }}
    >
      <Stack.Screen name="Me" component={Me} />
      <Stack.Screen name="Edit" component={Edit} />
      <Stack.Screen name="EditTags" component={EditTags} />
      <Stack.Screen name="Connections" component={Connections} />
      <Stack.Screen name="Requests" component={Requests} />
      <Stack.Screen name="Schedule" component={Schedule} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="FullCard" component={FullCard} />
      <Stack.Screen name="Report Bug" component={ReportBug} />
      <Stack.Screen name="Suggest Idea" component={SuggestIdea} />
    </Stack.Navigator>
  );
}
