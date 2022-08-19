import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import OrganizePrivate from "./OrganizePrivate";
import OrganizePublic from "./OrganizePublic";
import InvitePeople from "./InvitePeople";
import Invite from "../Notifications/Notifications";
import InviteFull from "../Notifications/NotificationFull";
import Connections from "../Profile/Connections";
import Requests from "../Profile/Requests";
import FullProfile from "../Explore/People/FullProfile";
import Report from "../Explore/People/Report";
//import InviteMain from "../Invite/InviteMain";
import Chats from "../Chat/Chats";
import ChatRoom from "../Chat/ChatRoom";

const Stack = createStackNavigator();

export default function ({ navigation }) {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="OrganizePrivate">
        <Stack.Screen
          name="OrganizePublic"
          options={{ headerShown: false, animationEnabled: false }}
          component={OrganizePublic}
        />
        <Stack.Screen
          name="OrganizePrivate"
          options={{ headerShown: false, animationEnabled: false }}
          component={OrganizePrivate}
        />
        <Stack.Screen
          name="InvitePeople"
          options={{ headerShown: false }}
          component={InvitePeople}
        />
        {/*<Stack.Screen name="InviteMain" options={{headerShown: false}} component={InviteMain}/>*/}
        <Stack.Screen
          name="Invite"
          component={Invite}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="InviteFull"
          component={InviteFull}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Chats"
          component={Chats}
          options={{ headerShown: false, animationEnabled: false }}
        />
        <Stack.Screen
          name="ChatRoom"
          component={ChatRoom}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Connections"
          component={Connections}
          options={{ headerShown: false, animationEnabled: true }}
        />
        <Stack.Screen
          name="Requests"
          component={Requests}
          options={{ headerShown: false, animationEnabled: false }}
        />
        <Stack.Screen
          name="FullProfile"
          component={FullProfile}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Report"
          component={Report}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
