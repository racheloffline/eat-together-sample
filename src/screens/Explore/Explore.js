//Display upcoming events to join

import React, {useEffect, useState} from "react";
import { StyleSheet, FlatList, View, Dimensions, TouchableOpacity } from "react-native";
import { Layout } from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";

import EventCard from '../../components/EventCard';
import Header from "../../components/Header";
import HorizontalSwitch from "../../components/HorizontalSwitch";
import Searchbar from "../../components/Searchbar";
import Button from "../../components/Button";
import Filter from "../../components/Filter";
import Divider from "../../components/Divider";

import LargeText from "../../components/LargeText";
import MediumText from "../../components/MediumText";
import NormalText from "../../components/NormalText";

import getDate from "../../getDate";
import { auth, db } from "../../provider/Firebase";

export default function({ navigation }) {

    //Get the user
    const user = auth.currentUser;

    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilters, setShowFilters] = useState(false); // show filters or not

    // Filters: sorting
    const [date, setDate] = useState(false);
    const [popularity, setPopularity] = useState(false);
    const [closeness, setCloseness] = useState(false);

    // Filters: other
    const [fromFriends, setFromFriends] = useState(false);
    const [similarInterests, setSimilarInterests] = useState(false);

    //See if we need to display unread notif icon
    const [unread, setUnread] = useState(false);

    useEffect(() => { // updates stuff right after React makes changes to the DOM
        async function fetchData() {
            const ref = db.collection("Public Events");
            await ref.onSnapshot((query) => {
                let newEvents = [];
                query.forEach((doc) => {
                    newEvents.push(doc.data());
                });

                setEvents(newEvents);
                setFilteredEvents(newEvents);
            })

            //See if there's a new notif
            await db.collection("Users").doc(user.uid).onSnapshot((doc) => {
                let data = doc.data();
                setUnread(data.hasNotif);
            })
        }
        fetchData();
    }, []);

    //Check to see if we should display the "No Events" placeholder text
    function shouldDisplayPlaceholder(list) {
        if(list == null || list.length === 0) {
            return "No events available at this time."
        } else {
            return ""
        }
    }

    // Method to filter out events
    const search = text => {
      let newEvents = events.filter(e => isMatch(e, text));
      setFilteredEvents(newEvents);
    }

    // Determines if an event
    const isMatch = (event, text) => {
      if (event.name.toLowerCase().includes(text.toLowerCase())) { // Name
        return true;
      }

      if (event.location.toLowerCase().includes(text.toLowerCase())) { // Location
        return true;
      }

      if (getDate(event.date.toDate()).toLowerCase().includes(text.toLowerCase())) { // Date
        return true;
      }

      return event.additionalInfo.toLowerCase().includes(text.toLowerCase()); // Additional info
    }

    // Method called when a new query is typed in/deleted
    const onChangeText = text => {
      setSearchQuery(text);
      search(text);
    }

    return (
      <Layout>
        <Header name="Explore" navigation = {navigation} hasNotif = {unread}/>
        <HorizontalSwitch left="Your Events" right="Public" current="right" press={() => navigation.navigate("ExploreYourEvents")}/>
        <Searchbar placeholder="Search by name, date, location, or additional info"
				  value={searchQuery} onChangeText={onChangeText}/>
        
        {showFilters && <View style={styles.overlay}>
            <View style = {(shouldDisplayPlaceholder(events) === "") ? {marginVertical: -5} : {marginVertical: 15}}>
                <NormalText center={"center"}>{shouldDisplayPlaceholder(events)}</NormalText>
            </View>
          <View style={styles.filterContainer}>
            <TouchableOpacity onPress={() => setShowFilters(false)}
              style={{ position: "absolute", left: 10, top: 10 }}>
              <Ionicons name="ios-close" size={50} color="black" />
            </TouchableOpacity>
            
            <LargeText center marginBottom={10}>Filters</LargeText>
            <MediumText>Sort by:</MediumText>
            <Filter checked={date}
              onPress={() => setDate(!date)} text="Date (recent)"/>
            <Filter checked={popularity}
              onPress={() => setPopularity(!popularity)} text="Popularity"/>
            <Filter checked={closeness}
              onPress={() => setCloseness(!closeness)} text="Closeness"/>

            <Divider width="100%"/>
            
            <MediumText>Other:</MediumText>
            <Filter checked={fromFriends}
              onPress={() => setFromFriends(!fromFriends)} text="From friends"/>
            <Filter checked={similarInterests}
              onPress={() => setSimilarInterests(!similarInterests)} text="Similar interests"/>

            <Button marginVertical={20}>Apply</Button>
          </View>
        </View>}

        <View style={{ flex: 1 }}>
          <View style={styles.filter}>
            <Button paddingVertical={10} paddingHorizontal={20}
              onPress={() => setShowFilters(true)}>
              <Ionicons name="filter" size={24}/> Filter
            </Button>
          </View>
          
          <FlatList contentContainerStyle={styles.cards} keyExtractor={item => item.id}
          data={filteredEvents} renderItem={({item}) =>
            <EventCard event={item} click={() => {
                //ampInstance.logEvent('BUTTON_CLICKED'); // EXPERIMENT
              navigation.navigate("FullCard", {
                event: item,
                public: true
              });
            }}/>
          }/>
        </View>
      </Layout>
    );
}

const styles = StyleSheet.create({
  cards: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 40
  },

  filter: {
		position: "absolute",
		left: 0,
		zIndex: 1
	},
	
	overlay: {
		position: "absolute",
		left: 0,
		top: 0,
		width: "100%",
		height: "100%",
		backgroundColor: "rgba(0,0,0,0.5)",
		zIndex: 2,
		alignItems: "center",
		justifyContent: "center"
	},

	filterContainer: {
		position: "absolute",
		width: Dimensions.get("window").width - 60,
		backgroundColor: "white",
		zIndex: 3,
		paddingVertical: 20,
    paddingHorizontal: 40,
		borderRadius: 20
	}
});
