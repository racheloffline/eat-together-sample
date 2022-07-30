//Display upcoming events to join

import React, { useEffect, useState } from "react";
import { StyleSheet, FlatList, View, ActivityIndicator } from "react-native";
import { Layout } from "react-native-rapi-ui";

import EventCard from '../../components/EventCard';
import Header from "../../components/Header";
import HorizontalSwitch from "../../components/HorizontalSwitch";
import Searchbar from "../../components/Searchbar";
import HorizontalRow from "../../components/HorizontalRow";
import Filter from "../../components/Filter";

import getDate from "../../getDate";
import { auth, db } from "../../provider/Firebase";

export default function({ navigation }) {
    // Fetch current user
    const user = auth.currentUser;
    const [userInfo, setUserInfo] = useState({});

    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    // Filters
    const [popularity, setPopularity] = useState(false);
    //const [closeness, setCloseness] = useState(false);
    const [fromFriends, setFromFriends] = useState(false);
    const [friendsAttending, setFriendsAttending] = useState(false);
    const [similarInterests, setSimilarInterests] = useState(false);

    const [unread, setUnread] = useState(false); // See if we need to display unread notif icon
    const [loading, setLoading] = useState(true); // State variable to show loading screen when fetching data

    useEffect(() => { // updates stuff right after React makes changes to the DOM
        async function fetchData() {
            await db.collection("Users").doc(user.uid).get().then(doc => {
              setUserInfo(doc.data());
            });

            const ref = db.collection("Public Events");
            await ref.onSnapshot((query) => {
                let newEvents = [];
                query.forEach((doc) => {
                    newEvents.push(doc.data());
                });
                
                // Sort events by date
                newEvents = newEvents.sort((a, b) => {
                    return a.date.seconds - b.date.seconds;
                });
                setEvents(newEvents);
                setFilteredEvents(newEvents);
            });

            //See if there's a new notif
            await db.collection("Users").doc(user.uid).onSnapshot((doc) => {
                let data = doc.data();
                setUnread(data.hasNotif);
            });
        }

        fetchData().then(() => {
          setLoading(false);
        });
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
      setLoading(true);
      let newEvents = events.filter(e => isMatch(e, text));
      setFilteredEvents(newEvents);
      setLoading(false);
    }

    // Determines if an event matches search query or not
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

      return event.hostName.toLowerCase().includes(text.toLowerCase()); // Host
    }

    // Method called when a new query is typed in/deleted
    const onChangeText = text => {
      setLoading(true);
      setSearchQuery(text);
      search(text);
      setLoading(false);
    }

    // Sort events by popularity
    const sortByPopularity = () => {
      setLoading(true);
      if (!popularity) {
        const copy = [...events];
        let newEvents = copy.sort((a, b) => b.attendees.length - a.attendees.length);

        setFilteredEvents(newEvents);
        setPopularity(true);
      } else {
        setFilteredEvents(events);
      }

      setPopularity(!popularity);
      setFromFriends(false);
      setFriendsAttending(false);
      setSimilarInterests(false);
      setLoading(false);
    }

    // Display events that friends are hosting
    const filterByFriendsHosting = () => {
      setLoading(true);
      if (!fromFriends) {
        const copy = [...events];
        let newEvents = copy.filter(e => userInfo.friendIDs.includes(e.hostID));

        setFilteredEvents(newEvents);
        setFromFriends(true);
      } else {
        setFilteredEvents(events);
      }

      setFromFriends(!fromFriends);
      setPopularity(false);
      setFriendsAttending(false);
      setSimilarInterests(false);
      setLoading(false);
    }

    // Display events that friends are attending
    const filterByFriendsAttending = () => {
      setLoading(true);
      if (!friendsAttending) {
        const copy = [...events];
        let newEvents = copy.filter(e => {
          return e.attendees.includes(user.uid);
        });

        setFilteredEvents(newEvents);
        setFriendsAttending(true);
      } else {
        setFilteredEvents(events);
      }

      setFriendsAttending(!friendsAttending);
      setPopularity(false);
      setFromFriends(false);
      setSimilarInterests(false);
      setLoading(false);
    }

    // Display events in descending order of similar tags
    const sortBySimilarInterests = () => {
      setLoading(true);
      if (!similarInterests) {
        let copy = [...events];

        fetch("https://eat-together-match.uw.r.appspot.com/find_similarity", {
          method: "POST",
          body: JSON.stringify({
            "currTags": userInfo.tags,
            "otherTags": getEventTags()
          }),
        }).then(res => res.json()).then(res => {
          let i = 0;
          copy.forEach(e => {
            e.similarity = res[i];
            i++;
          });

          copy = copy.sort((a, b) => b.similarity - a.similarity);
          setFilteredEvents(copy);
          setSimilarInterests(true);
          setLoading(false);
        }).catch(e => { // If error, alert the user
          alert("An error occured, try again later :(");
          setLoading(false);
        });
      } else {
        setFilteredEvents(events);
        setLoading(false);
      }

      setSimilarInterests(!similarInterests);
      setPopularity(false);
      setFromFriends(false);
      setFriendsAttending(false);
    }
    
    // Get a list of all the events' tags
    const getEventTags = () => {
      let tags = [];
      events.forEach(e => {
        tags.push(e.tags);
      });

      return tags;
    }

    return (
      <Layout>
        <Header name="Explore" navigation = {navigation} hasNotif = {unread}/>
        <HorizontalSwitch left="Your Events" right="Public" current="right"
          press={() => navigation.navigate("ExploreYourEvents")}/>
        <Searchbar placeholder="Search by name, location, date, or host name"
				  value={searchQuery} onChangeText={onChangeText}/>

        <HorizontalRow>
          <Filter checked={similarInterests}
            onPress={sortBySimilarInterests} text="Sort by similar interests"/>
          <Filter checked={popularity}
            onPress={sortByPopularity} text="Sort by popularity" />
          <Filter checked={fromFriends}
            onPress={filterByFriendsHosting} text="From friends"/>
          <Filter checked={friendsAttending}
            onPress={filterByFriendsAttending} text="Friends attending"/>
        </HorizontalRow>

        <View style={{ flex: 1 }}>
          {!loading ? <FlatList contentContainerStyle={styles.cards} keyExtractor={item => item.id}
            data={filteredEvents} renderItem={({item}) =>
              <EventCard event={item} click={() => {
                  //ampInstance.logEvent('BUTTON_CLICKED'); // EXPERIMENT
                navigation.navigate("FullCard", {
                  event: item,
                  public: true
                });
              }}/>
            }/> : <View style={{ flex: 1, justifyContent: "center" }}>
              <ActivityIndicator size={100} color="#5DB075"/>
            </View>}
        </View>
      </Layout>
    );
}

const styles = StyleSheet.create({
  cards: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 20,
  },
});
