//Display upcoming events to join

import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, FlatList, View, ActivityIndicator } from "react-native";
import { Layout } from "react-native-rapi-ui";
import RBSheet from "react-native-raw-bottom-sheet";

import EventCard from "../../components/EventCard";
import Header from "../../components/Header";
import HorizontalSwitch from "../../components/HorizontalSwitch";
import Searchbar from "../../components/Searchbar";
import HorizontalRow from "../../components/HorizontalRow";
import Filter from "../../components/Filter";
import Link from "../../components/Link";

import MediumText from "../../components/MediumText";

import { getTimeOfDay, isAvailable, compareDates } from "../../methods";
import { auth, db } from "../../provider/Firebase";

export default function({ navigation }) {
    // Fetch current user
    const user = auth.currentUser;
    const [userInfo, setUserInfo] = useState({});

    const [events, setEvents] = useState([]); // All public events
    const [filteredEvents, setFilteredEvents] = useState([]); // Filtered events
    const [filteredSearchedEvents, setFilteredSearchedEvents] = useState([]); // Events that are filtered and search-queried

    const [searchQuery, setSearchQuery] = useState("");

    // Filters
    const [similarInterests, setSimilarInterests] = useState(false);
    const [popularity, setPopularity] = useState(false);
    const [available, setAvailable] = useState(false);
    const [fromFriends, setFromFriends] = useState(false);
    const [friendsAttending, setFriendsAttending] = useState(false);
    const [morning, setMorning] = useState(false);
    const [afternoon, setAfternoon] = useState(false);
    const [evening, setEvening] = useState(false);

    // Display a bottom drawer showing more filters
    const showSortFilterRef = useRef();
    const showTimeFilterRef = useRef();

    const [loading, setLoading] = useState(true); // State variable to show loading screen when fetching data

    useEffect(() => { // updates stuff right after React makes changes to the DOM
        async function fetchData() {
            let userData;
            await db.collection("Users").doc(user.uid).onSnapshot(doc => {
                userData = doc.data();
                setUserInfo(doc.data());
            });

            const ref = db.collection("Public Events");
            await ref.onSnapshot((query) => {
                let newEvents = [];
                query.forEach((doc) => {
                    if (doc.data().date.toDate() > new Date() && 
                      !userData.blockedIDs.includes(doc.data().hostID)) {
                        newEvents.push(doc.data());
                    }
                });
                
                // Sort events by date
                newEvents = newEvents.sort((a, b) => {
                    return compareDates(a, b);
                });
                setEvents(newEvents);
                setFilteredEvents(newEvents);
                setFilteredSearchedEvents(newEvents);
            });
        }

        fetchData().then(() => {
          setLoading(false);
        });
    }, []);

    // For filters
    useEffect(() => {
      async function filter() {
        let newEvents = [...events];

        if (similarInterests) {
          newEvents = await sortBySimilarInterests(newEvents);
        }

        if (popularity) {
          newEvents = sortByPopularity(newEvents);
        }

        if (available) {
          newEvents = filterByAvailability(newEvents);
        }

        if (fromFriends) {
          newEvents = filterByFriendsHosting(newEvents);
        }

        if (friendsAttending) {
          newEvents = filterByFriendsAttending(newEvents);
        }

        if (morning) {
          newEvents = filterByTime("morning", newEvents);
        }

        if (afternoon) {
          newEvents = filterByTime("afternoon", newEvents);
        }

        if (evening) {
          newEvents = filterByTime("evening", newEvents);
        }

        setFilteredEvents(newEvents);

        const newSearchedEvents = search(newEvents, searchQuery);
        setFilteredSearchedEvents(newSearchedEvents);
      }

      setLoading(true);
      filter().then(() => setLoading(false));
    }, [
      similarInterests,
      popularity,
      available,
      fromFriends,
      friendsAttending,
      morning,
      afternoon,
      evening,
    ]);

    // Method to filter out events
    const search = (newEvents, text) => {
      return newEvents.filter((e) => isMatch(e, text));
    };

    // Determines if an event matches search query or not
    const isMatch = (event, text) => {
      // Name
      if (event.name.toLowerCase().includes(text.toLowerCase())) {
        return true;
      }

      // Tags
      if (event.tags.some(tag => tag.toLowerCase().includes(text.toLowerCase()))) {
        return true;
      }

      // Host
      if (event.hostName) {
        return event.hostName.toLowerCase().includes(text.toLowerCase());
      }

      const fullName = event.hostFirstName + " " + event.hostLastName;
      return fullName.toLowerCase().includes(text.toLowerCase());
    };

    // Method called when a new query is typed in/deleted
    const onChangeText = (text) => {
      setSearchQuery(text);
      const newEvents = search(filteredEvents, text);
      setFilteredSearchedEvents(newEvents);
    };

    // Sort events by popularity
    const sortByPopularity = (newEvents) => {
      newEvents = newEvents.sort(
        (a, b) => b.attendees.length - a.attendees.length
      );
      return newEvents;
    };

    // Display events that match the user's availabilities
    const filterByAvailability = (newEvents) => {
      return newEvents.filter(e => isAvailable(userInfo, e));
    }

    // Display events that friends are hosting
    const filterByFriendsHosting = (newEvents) => {
      newEvents = newEvents.filter((e) => userInfo.friendIDs.includes(e.hostID));
      return newEvents;
    };

    // Display events that friends are attending
    const filterByFriendsAttending = (newEvents) => {
      newEvents = newEvents.filter((e) => {
        let included = false;

        e.attendees.forEach((a) => {
          if (userInfo.friendIDs.includes(a)) {
            included = true;
            return;
          }
        });

        return included;
      });

      return newEvents;
    };

    // Display events in descending order of similar tags
    const sortBySimilarInterests = async (newEvents) => {
      let result;

      await fetch("https://eat-together-match.uw.r.appspot.com/find_similarity", {
        method: "POST",
        body: JSON.stringify({
          currTags: userInfo.tags.map(t => t.tag),
          otherTags: getEventTags(),
        }),
      })
      .then((res) => res.json())
      .then((res) => {
        let i = 0;
        newEvents.forEach((e) => {
          e.similarity = res[i];
          i++;
        });

        newEvents = newEvents.sort((a, b) => b.similarity - a.similarity);
        result = newEvents;
      })
      .catch((e) => {
        // If error, alert the user
        alert("An error occured, try again later :(");
        result = events;
      });

      return result;
    }
    
    // Get a list of all the events' tags
    const getEventTags = () => {
      let tags = [];
      events.forEach(e => {
        tags.push(e.tags);
      });

      return tags;
    }

    // Filter events by time of day
    const filterByTime = (time, newEvents) => {
      newEvents = newEvents.filter(e => getTimeOfDay(e.date.toDate()) === time);
      return newEvents;
    }

    return (
      <Layout>
        <Header name="Explore"/>
        <HorizontalSwitch
          left="Meals"
          right="People"
          current="left"
          press={() => navigation.navigate("People")}
        />

        <View style={{ paddingHorizontal: 20 }}>
          <Searchbar placeholder="Search by name, tags, or host name"
            value={searchQuery} onChangeText={onChangeText}/>
          
          <HorizontalRow>
            <Filter checked={available}
              onPress={() => setAvailable(!available)} text="Fits schedule"/>
            <Filter checked={morning || afternoon || evening}
              onPress={() => showTimeFilterRef.current.open()}
              text={morning ? "Morning" : 
                afternoon ? "Afternoon" : 
                evening ? "Evening" : "Time of day"}/>
            <Filter checked={similarInterests || popularity}
              onPress={() => showSortFilterRef.current.open()}
              text={similarInterests ? "Similar interests"
                : popularity ? "Popularity" : "Sort by"}/>
            <Filter checked={fromFriends}
              onPress={() => setFromFriends(!fromFriends)} text="From friends"/>
            <Filter checked={friendsAttending}
              onPress={() => setFriendsAttending(!friendsAttending)} text="Friends attending"/>
          </HorizontalRow>
        </View>

        <RBSheet
          height={300}
          ref={showTimeFilterRef}
          closeOnDragDown={true}
          closeOnPressMask={false}
          customStyles={{
              wrapper: {
                  backgroundColor: "rgba(0,0,0,0.5)",
              },
              draggableIcon: {
                  backgroundColor: "black"
              },
              container: {
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  padding: 10
              }
          }}>
          <Filter checked={morning} text="Morning" marginBottom={5}
            onPress={() => {
              setMorning(!morning);
              setAfternoon(false);
              setEvening(false);
              showTimeFilterRef.current.close();
            }}/>
          <Filter checked={afternoon} text="Afternoon" marginBottom={5}
            onPress={() => {
              setAfternoon(!afternoon);
              setMorning(false);
              setEvening(false);
              showTimeFilterRef.current.close();
            }}/>
          <Filter checked={evening} text="Evening" marginBottom={20}
            onPress={() => {
              setEvening(!evening);
              setMorning(false);
              setAfternoon(false);
              showTimeFilterRef.current.close();
            }}/>
          <Link onPress={() => {
            setMorning(false);
            setAfternoon(false);
            setEvening(false);
            showTimeFilterRef.current.close();
          }}
        >
          Clear
        </Link>
      </RBSheet>

      <RBSheet
        height={300}
        ref={showSortFilterRef}
        closeOnDragDown={true}
        closeOnPressMask={false}
        customStyles={{
          wrapper: {
            backgroundColor: "rgba(0,0,0,0.5)",
          },
          draggableIcon: {
            backgroundColor: "black",
          },
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 10,
          },
        }}
      >
        <Filter
          checked={similarInterests}
          text="Similar interests"
          marginBottom={5}
          onPress={() => {
            setSimilarInterests(!similarInterests);
            setPopularity(false);
            showSortFilterRef.current.close();
          }}
        />
        <Filter
          checked={popularity}
          text="Popularity"
          marginBottom={20}
          onPress={() => {
            setPopularity(!popularity);
            setSimilarInterests(false);
            showSortFilterRef.current.close();
          }}
        />
        <Link
          onPress={() => {
            setSimilarInterests(false);
            setPopularity(false);
            showSortFilterRef.current.close();
          }}>Clear</Link>
        </RBSheet>

        <View style={{ flex: 1 }}>
          {!loading ? 
            filteredSearchedEvents.length > 0 ? (
            <FlatList contentContainerStyle={styles.cards} keyExtractor={item => item.id}
              data={filteredSearchedEvents} renderItem={({item}) =>
                <EventCard event={item} click={() => {
                    //ampInstance.logEvent('BUTTON_CLICKED'); // EXPERIMENT
                  navigation.navigate("FullCard", {
                    event: item
                  });
                }}/>
            }/>
            ) : (
              <View style={{ flex: 1, justifyContent: "center" }}>
                <MediumText center>Empty 🍽️</MediumText>
              </View>) : (
              <View style={{ flex: 1, justifyContent: "center" }}>
                <ActivityIndicator size={100} color="#5DB075"/>
              </View>
          )}
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
