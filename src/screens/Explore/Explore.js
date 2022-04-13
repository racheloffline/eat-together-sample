//Display upcoming events to join

import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import * as firebase from "firebase";

import EventCard from '../../components/EventCard';

import {
  Layout,
  Button,
  Text,
  TopNav,
  Section,
  SectionContent,
  useTheme,
} from "react-native-rapi-ui";

export default class Explore extends React.PureComponent {
  state = {
    events: [
      {
        id: '1',
        name: "Open Lunch!",
        image: "https://static.onecms.io/wp-content/uploads/sites/9/2020/04/24/ppp-why-wont-anyone-rescue-restaurants-FT-BLOG0420.jpg",
        location: "Center Table",
        date: "Jan. 3",
        time: "11 am - 12 pm",
        details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        host: {
          name: "Rachelle Hua",
          image: "https://e3.365dm.com/16/07/768x432/rtr3cltb-1_3679323.jpg?20160706114211",
        },
      },
      {
        id: '2',
        name: "Open Dinner!",
        image: "https://static.onecms.io/wp-content/uploads/sites/9/2020/04/24/ppp-why-wont-anyone-rescue-restaurants-FT-BLOG0420.jpg",
        location: "Center Table",
        date: "Jan. 3",
        time: "6 pm - 7 pm",
        details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        host: {
          name: "Barack Obama",
          image: "https://e3.365dm.com/16/07/768x432/rtr3cltb-1_3679323.jpg?20160706114211",
        },
      },
      {
        id: '3',
        name: "Best Lunch Ever!",
        image: "https://static.onecms.io/wp-content/uploads/sites/9/2020/04/24/ppp-why-wont-anyone-rescue-restaurants-FT-BLOG0420.jpg",
        location: "Center Table",
        date: "Jan. 3",
        time: "6 pm - 7 pm",
        details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        host: {
          name: "Barack Obama",
          image: "https://e3.365dm.com/16/07/768x432/rtr3cltb-1_3679323.jpg?20160706114211",
        },
      },
    ]
  }

  render() {
    return (
      <Layout>
        <View style={styles.header}>
          <Text size="h1">Explore</Text>
        </View>

        <FlatList contentContainerStyle={styles.cards} keyExtractor={item => item.id}
         data={this.state.events} renderItem={({item}) =>
          <EventCard event={item} click={() => {
            this.props.navigation.navigate("FullCard", {
              event: item
            });
          }}/>
        }/>
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    padding: 10,
    display: "flex",
    marginBottom: 10
  },

  cards: {
    alignItems: "center"
  },
});