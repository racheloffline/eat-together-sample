//Meet other people

import React, {useEffect, useState} from "react";
import { StyleSheet, FlatList, View, Dimensions, TouchableOpacity } from "react-native";
import { Layout } from "react-native-rapi-ui";
import firebase from "firebase";
import { Ionicons } from '@expo/vector-icons';

import Searchbar from "../../components/Searchbar";
import ProfileBubble from "../../components/ProfileBubble";
import Header from "../../components/Header";
import Button from "../../components/Button";
import Filter from "../../components/Filter";
import Divider from "../../components/Divider";

import LargeText from "../../components/LargeText";

import {db} from "../../provider/Firebase";

export default function({ navigation }) {
	const [people, setPeople] = useState([]); // initial state, function used for updating initial state
	const [filteredPeople, setFilteredPeople] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [showFilters, setShowFilters] = useState(false); // show filters or not

	// Filters
	const [mutualFriends, setMutualFriends] = useState(false);
	const [similarInterests, setSimilarInterests] = useState(false);
	const [sharedEvents, setSharedEvents] = useState(false);

	useEffect(() => { // updates stuff right after React makes changes to the DOM
		const ref = db.collection("Users");
		const user = firebase.auth().currentUser;
		ref.onSnapshot((query) => {
			let users = [];
			query.forEach((doc) => {
				if (doc.data().id !== user.uid && doc.data().verified) {
					users.push(doc.data());
				}
			});
			setPeople(users);
			setFilteredPeople(users);
		});
	}, []);

	// Method to filter out people based on name, username, or tags
	const search = text => {
		let newPeople = people.filter(p => isMatch(p, text));
		setFilteredPeople(newPeople);
	}

	// Determines if a person matches the search query or not
	const isMatch = (person, text) => {
		if (person.name.toLowerCase().includes(text.toLowerCase())) { // Name
			return true;
		}

		if (person.username.toLowerCase().includes(text.toLowerCase())) { // Username
			return true;
		}

		if (person.quote.toLowerCase().includes(text.toLowerCase())) { // Quote
			return true;
		}

		return person.tags.some(tag => tag.toLowerCase().includes(text.toLowerCase())); // Tags
	}

	// Method called when a new query is typed in/deleted
	const onChangeText = text => {
		setSearchQuery(text);
		search(text);
	}

	return (
		<Layout>
			<Header name="People" navigation = {navigation}/>
			<Searchbar placeholder="Search by name, username, quote, or tags"
				value={searchQuery} onChangeText={onChangeText}/>

			{showFilters && <View style={styles.overlay}>
				<View style={styles.filterContainer}>
					<TouchableOpacity onPress={() => setShowFilters(false)}
						style={{ position: "absolute", left: 10, top: 10 }}>
						<Ionicons name="ios-close" size={50} color="black" />
					</TouchableOpacity>
					
					<LargeText center marginBottom={10}>Filters</LargeText>
					<Filter checked={mutualFriends}
						onPress={() => setMutualFriends(!mutualFriends)} text="Mutual friends"/>
					<Filter checked={similarInterests}
						onPress={() => setSimilarInterests(!similarInterests)} text="Similar interests/tags"/>
					<Filter checked={sharedEvents}
						onPress={() => setSharedEvents(!sharedEvents)} text="Shared events"/>

					<Button marginVertical={20}>Apply</Button>
				</View>
			</View>}

			<View style={styles.body}>
				<View style={styles.filter}>
					<Button paddingVertical={10} paddingHorizontal={20}
						onPress={() => setShowFilters(true)}>
						<Ionicons name="filter" size={24}/> Filter
					</Button>
				</View>

				<FlatList contentContainerStyle={{ paddingTop: 40 }} keyExtractor={item => item.id}
					data={filteredPeople} renderItem={({item}) =>
						<ProfileBubble person={item} click={() => {
							navigation.navigate("FullProfile", {
								person: item
							});
						}}/>
					}/>
			</View>
		</Layout>
	);
}

const styles = StyleSheet.create({
	body: {
		flex: 1,
		alignItems: "center",
		backgroundColor: "black",
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
		padding: 30,
		borderRadius: 20
	}
});