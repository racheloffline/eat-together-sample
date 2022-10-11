//Meet other people

import React, { useEffect, useState } from "react";
import { FlatList, View, ActivityIndicator } from "react-native";
import { Layout } from "react-native-rapi-ui";

import Searchbar from "../../../components/Searchbar";
import ProfileBubble from "../../../components/ProfileBubble";
import Header from "../../../components/Header";
import HorizontalRow from "../../../components/HorizontalRow";
import HorizontalSwitch from "../../../components/HorizontalSwitch";
import Filter from "../../../components/Filter";

import MediumText from "../../../components/MediumText";

import { generateColor, randomize3 } from "../../../methods";
import { db, auth } from "../../../provider/Firebase";

export default function ({ navigation }) {
  // Fetch current user
  const user = auth.currentUser;
  const [userInfo, setUserInfo] = useState({});

  const [mutuals, setMutuals] = useState([]); // Mutual friends

  const [people, setPeople] = useState([]); // List of all users
  const [filteredPeople, setFilteredPeople] = useState([]); // List of filtered users
  const [filteredSearchedPeople, setFilteredSearchPeople] = useState([]); // List of users with filters and search query on

  const [searchQuery, setSearchQuery] = useState("");

  // Filters
  const [similarInterests, setSimilarInterests] = useState(false);
  const [mutualFriends, setMutualFriends] = useState(false);

  const [loading, setLoading] = useState(true); // State variable to show loading screen when fetching data

  // Fetch all users
  useEffect(() => {
    // updates stuff right after React makes changes to the DOM
    async function fetchData() {
      const ref = db.collection("Users");
      let userData;

      // This is causing the page to crash, needs fix ASAP
      await ref
        .doc(user.uid)
        .get()
        .then((doc) => {
          setUserInfo(doc.data());
          userData = doc.data();

          doc.data().friendIDs.forEach((id) => {
            db.collection("Users")
              .doc(id)
              .get()
              .then((doc) => {
                if (doc && doc.data().friendIDs) {
                  // TODO FIX: Not all docs have friendIDs in db
                  setMutuals((mutuals) =>
                    mutuals.concat(doc.data().friendIDs)
                  );
                }
              });
          });
        });

      await ref.onSnapshot((query) => {
        let users = [];
        query.forEach((doc) => {
          let data = doc.data();
          if (data.id !== user.uid && data.verified && !userData.blockedIDs.includes(doc.data().id)
            && !doc.data().blockedIDs.includes(user.uid) && !userData.friendIDs.includes(doc.data().id)) { // Only show verified + unblocked + non-friend users
            data.inCommon = getCommonTags(userData, data);
            data.color = generateColor();
            data.selectedTags = randomize3(data.tags);
            users.push(data);
          }
        });

        setPeople(users);
        setFilteredPeople(users);
        setFilteredSearchPeople(users);
      });
    }

    fetchData().then(() => {
      setLoading(false);
    });
  }, []);


  // Filters
  useEffect(() => {
    async function filter() {
      let newPeople = [...people];
  
      if (similarInterests) {
        newPeople = await sortBySimilarInterests(newPeople);
      }
  
      if (mutualFriends) {
        newPeople = filterByMutualFriends(newPeople);
      }

      setFilteredPeople(newPeople);
      const newSearchedPeople = search(newPeople, searchQuery);
      setFilteredSearchPeople(newSearchedPeople);
    }

    setLoading(true);
    filter().then(() => {
      setLoading(false);
    });
  }, [similarInterests, mutualFriends]);

  // Get tags in common with current user and user being compared to
  const getCommonTags = (currUser, otherUser) => {
    let commonTags = [];
    const otherTags = otherUser.tags.map((tag) => tag.tag);

    currUser.tags.forEach((tag) => {
      if (otherTags.includes(tag.tag)) {
        commonTags.push(tag);
      }
    });

    return commonTags;
  };

  // Method to filter out people based on name, username, or tags
  const search = (newPeople, text) => {
    return newPeople.filter((p) => isMatch(p, text));
  };

  // Determines if a person matches the search query or not
  const isMatch = (person, text) => {
    // Name
    const fullName = person.firstName + " " + person.lastName;
    if (fullName.toLowerCase().includes(text.toLowerCase())) {
      return true;
    }

    // Username
    if (person.username.toLowerCase().includes(text.toLowerCase())) {
      return true;
    }

    // Tags
    return person.tags.some((tag) =>
      tag.tag.toLowerCase().includes(text.toLowerCase())
    );
  };

  // Method called when a new query is typed in/deleted
  const onChangeText = (text) => {
    setSearchQuery(text);
    const newPeople = search(filteredPeople, text);
    setFilteredSearchPeople(newPeople);
  };

  // Display people in descending order of similar tags
  const sortBySimilarInterests = async (newPeople) => {
    let result;

    await fetch("https://eat-together-match.uw.r.appspot.com/find_similarity", {
      method: "POST",
      body: JSON.stringify({
        currTags: userInfo.tags.map((t) => t.tag),
        otherTags: getPeopleTags(newPeople),
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        let i = 0;
        newPeople.forEach((p) => {
          p.similarity = res[i];
          i++;
        });

        result = newPeople.sort((a, b) => b.similarity - a.similarity);
      })
      .catch((e) => {
        // If error, alert the user
        alert("An error occured, try again later :(");
        result = newPeople;
      });

    return result;
  };

  // Get a list of everyone's tags
  const getPeopleTags = (newPeople) => {
    let tags = [];
    newPeople.forEach((p) => {
      tags.push(p.tags.map((t) => t.tag));
    });

    return tags;
  };

  // Display people who are mutual friends
  const filterByMutualFriends = (newPeople) => {
    return newPeople.filter((p) => mutuals.includes(p.id));
  };

  return (
    <Layout>
      <Header name="Explore" />
      <HorizontalSwitch
        left="Meals"
        right="People"
        current="right"
        press={() => navigation.navigate("Explore")}
      />

      <View style={{ paddingHorizontal: 20 }}>
        <Searchbar
          placeholder="Search by name, username, or tags"
          value={searchQuery}
          onChangeText={onChangeText}
        />

        <HorizontalRow>
          <Filter
            checked={similarInterests}
            onPress={() => setSimilarInterests(!similarInterests)}
            text="Sort by similar interests"
          />
          <Filter
            checked={mutualFriends}
            onPress={() => setMutualFriends(!mutualFriends)}
            text="Mutual friends"
          />
        </HorizontalRow>
      </View>

      <View style={{ flex: 1, alignItems: "center" }}>
        {!loading ?
          filteredSearchedPeople.length > 0 ? (
          <FlatList
            keyExtractor={(item) => item.id}
            data={filteredSearchedPeople}
            renderItem={({ item }) => (
              <ProfileBubble
                person={item}
                click={() => {
                  navigation.navigate("FullProfile", {
                    person: item,
                  });
                }}
              />
            )}
          />
          ) : (<View style={{ flex: 1, justifyContent: "center" }}>
            <MediumText center>Empty 🍽️</MediumText>
          </View>) : (
          <View style={{ flex: 1, justifyContent: "center" }}>
            <ActivityIndicator size={100} color="#5DB075" />
          </View>
        )}
      </View>
    </Layout>
  );
}
