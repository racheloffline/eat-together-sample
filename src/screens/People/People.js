//Meet other people

import React, {useEffect, useState} from "react";
import { View, StyleSheet, FlatList, Dimensions } from "react-native";
import { Layout } from "react-native-rapi-ui";
import * as firebase from "firebase";

import ProfileBubble from "../../components/ProfileBubble";
import Header from "../../components/Header";
import {db} from "../../provider/Firebase";

export default function({ navigation }) {
	const [people, setPeople] = useState([]); // initial state, function used for updating initial state

	useEffect(() => { // updates stuff right after React makes changes to the DOM
		const ref = db.collection("Users");
		ref.onSnapshot((query) => {
			let users = [];
			query.forEach((doc) => {
			users.push(doc.data());
		});
		setPeople(users);
	});
	}, []);

	return (
		<Layout>
			<Header name="People" navigation = {navigation}/>

			<FlatList contentContainerStyle={styles.body} keyExtractor={item => item.id}
				data={people} renderItem={({item}) =>
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