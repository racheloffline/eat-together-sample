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

import { db, auth } from "../../../provider/Firebase";

export default function ({ navigation }) {
  // Fetch current user
  const user = auth.currentUser;
  const [userInfo, setUserInfo] = useState({});

  const [mutuals, setMutuals] = useState([]); // Mutual friends

  const [people, setPeople] = useState([]); // initial state, function used for updating initial state
  const [filteredPeople, setFilteredPeople] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [unread, setUnread] = useState(false); //show the unread notification icon

  // Filters
  const [similarInterests, setSimilarInterests] = useState(false);
  const [mutualFriends, setMutualFriends] = useState(false);

  const [loading, setLoading] = useState(true); // State variable to show loading screen when fetching data

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
                if (doc) {
                  setMutuals((mutuals) => mutuals.concat(doc.data().friendIDs));
                }
              });
          });
        });

      await ref.onSnapshot((query) => {
        let users = [];
        query.forEach((doc) => {
          if (doc.data().id !== user.uid && doc.data().verified) {
            let data = doc.data();
						data.inCommon = getCommonTags(userData, data);
						users.push(data);
          }
        });

        setPeople(users);
        setFilteredPeople(users);
      });

      await ref.doc(user.uid).onSnapshot((doc) => {
        setUnread(doc.data().hasNotif);
      });
    }

    fetchData().then(() => {
      setLoading(false);
    });
  }, []);

  // Get tags in common with current user and user being compared to
	const getCommonTags = (currUser, otherUser) => {
		let commonTags = [];
		const otherTags = otherUser.tags.map(tag => tag.tag);
		
		currUser.tags.forEach(tag => {
			if (otherTags.includes(tag.tag)) {
				commonTags.push(tag);
			}
		});
 
		return commonTags;
	}

  // Method to filter out people based on name, username, or tags
  const search = (text) => {
    let newPeople = people.filter((p) => isMatch(p, text));
    setFilteredPeople(newPeople);
    
    // Reset all filters
    setSimilarInterests(false);
    setMutualFriends(false);
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
		return person.tags.some(tag => tag.tag.toLowerCase().includes(text.toLowerCase()));
  };

  // Method called when a new query is typed in/deleted
  const onChangeText = (text) => {
    setSearchQuery(text);
    search(text);
  };

  // Display people in descending order of similar tags
  const sortBySimilarInterests = () => {
    setLoading(true);

    if (!similarInterests) {
      let copy = [...people];

      fetch("https://eat-together-match.uw.r.appspot.com/find_similarity", {
        method: "POST",
        body: JSON.stringify({
          "currTags": userInfo.tags.map(t => t.tag),
			  	"otherTags": getPeopleTags()
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          let i = 0;
          copy.forEach((p) => {
            p.similarity = res[i];
            i++;
          });

          copy = copy.sort((a, b) => b.similarity - a.similarity);
          setFilteredPeople(copy);
          setSimilarInterests(true);
          setLoading(false);
        })
        .catch((e) => {
          // If error, alert the user
          alert("An error occured, try again later :(");
          setLoading(false);
        });
    } else {
      setLoading(false);
      setFilteredPeople(people);
    }

    setSimilarInterests(!similarInterests);
    setMutualFriends(false);
    setSearchQuery("");
  };

  // Get a list of everyone's tags
  const getPeopleTags = () => {
		let tags = [];
		people.forEach(p => {
			tags.push(p.tags.map(t => t.tag));
		});
  
		return tags;
	}

  // Display people who are mutual friends
  const filterByMutualFriends = () => {
    setLoading(true);

    if (!mutualFriends) {
      const newPeople = people.filter((p) => mutuals.includes(p.id));
      setFilteredPeople(newPeople);
    } else {
      setFilteredPeople(people);
    }

    setLoading(false);
    setMutualFriends(!mutualFriends);
    setSimilarInterests(false);
    setSearchQuery("");
  };

  return (
    <Layout>
      <Header name="Explore"/>
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
            onPress={sortBySimilarInterests}
            text="Sort by similar interests"
          />
          <Filter
            checked={mutualFriends}
            onPress={filterByMutualFriends}
            text="Mutual friends"
          />
        </HorizontalRow>
      </View>

      <View style={{ flex: 1, alignItems: "center" }}>
        {!loading ? (
          <FlatList
            keyExtractor={(item) => item.id}
            data={filteredPeople}
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
        ) : (
          <View style={{ flex: 1, justifyContent: "center" }}>
            <ActivityIndicator size={100} color="#5DB075" />
          </View>
        )}
      </View>
    </Layout>
  );
}
