//Meet other people

import React, {useEffect, useState} from "react";
import { StyleSheet, FlatList, Dimensions } from "react-native";
import { Layout } from "react-native-rapi-ui";
import firebase from "firebase";

import Searchbar from "../../components/Searchbar";
import ProfileBubble from "../../components/ProfileBubble";
import Header from "../../components/Header";
import { getProfileRecs } from "../../methods";
import {db} from "../../provider/Firebase";

export default function({ navigation }) {
	const [people, setPeople] = useState([]); // initial state, function used for updating initial state
	const [filteredPeople, setFilteredPeople] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");

	useEffect(() => { // updates stuff right after React makes changes to the DOM
		const ref = db.collection("Users");
		const user = firebase.auth().currentUser;
		ref.onSnapshot((query) => {
			let users = [];
			query.forEach((doc) => {
				if (doc.data().id !== user.uid) {
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

			<FlatList contentContainerStyle={styles.body} keyExtractor={item => item.id}
				data={filteredPeople} renderItem={({item}) =>
					<ProfileBubble person={item} click={() => {
						navigation.navigate("FullProfile", {
							person: item
						});
					}}/>
				}/>
		</Layout>
	);
}

const styles = StyleSheet.create({
	body: {
		alignItems: "center",
		backgroundColor: "black"
	},
});