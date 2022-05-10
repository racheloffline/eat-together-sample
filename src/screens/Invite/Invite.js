//Chat with users you have already connected with

import React, {useEffect, useState} from 'react';
import {FlatList, View, StyleSheet, Image, ScrollView, TouchableOpacity} from 'react-native';
import {Layout, Text, TopNav} from 'react-native-rapi-ui';
import LargeText from "../../components/LargeText";
import NormalText from "../../components/NormalText";
import SmallText from "../../components/SmallText";
import {Ionicons} from "@expo/vector-icons";
import Tag from "../../components/Tag";
import MediumText from "../../components/MediumText";
import {db} from "../../provider/Firebase";
import {AuthContext, AuthProvider} from "../../provider/AuthProvider";
import firebase from "firebase";

export default function ({ navigation }) {
	//Get a list of current invites from Firebase up here
	const user = firebase.auth().currentUser;
	const [invites, setInvites] = useState([]); // initial state, function used for updating initial state

	//Give the correct email/name to the inviteFull screen
	let refToGive;

	//check to see which text to display for accepted status
	function checkAccepted(item) {
		if(item.accepted == null) {
			return ""
		} else if(item.accepted === "accepted") {
			return "You have accepted this invite!"
		} else if(item.accepted === "declined") {
			return "You have declined this invite."
		} else {
			return "ERROR";
		}
	}

	//get the list of invites from firebase
	function getInvitesFromFirebase(ref) {
		ref.onSnapshot((query) => {
			const list = [];
			query.forEach((doc) => {
				let data = doc.data();
				list.push({
					id: doc.id,
					name: data.name,
					image: data.image,
					location: data.location,
					date: data.date,
					time: data.time,
					details: data.description,
					hostID: data.hostID,
					hostImage: data.hostImage,
					accepted: data.accepted,
					inviteID: data.inviteID,
					ref: refToGive
				});
			});
			setInvites(list);
		});
	}

	useEffect(() => { // updates stuff right after React makes changes to the DOM
		let ref = db.collection("User Invites").doc(user.email);
		ref.get().then((doc) => {
			if(doc.exists) {
				ref = ref.collection("Invites")
				refToGive = user.email
				getInvitesFromFirebase(ref)
			} else {
				db.collection("Users").doc(user.uid).get().then((doc) => {
					ref = db.collection("User Invites").doc(doc.data().name).collection("Invites")
					refToGive = doc.data().name
					getInvitesFromFirebase(ref)
				})
			}
		})



	}, []);

	return (
		<Layout>
			<TopNav
				middleContent="Invites"
				leftContent={
					<Ionicons
						name="chevron-back"
						size={20}
					/>
				}
				leftAction={() => navigation.goBack()}
			/>
			<View style = {styles.listView}>
				<FlatList
					data = {invites}
					renderItem={
						({item}) =>
							<View>
								<TouchableOpacity onPress={() => {
									navigation.navigate("InviteFull", {
										invite: item
									})
								}}>
									<MediumText style = {styles.listMainText}>{item.hostID}</MediumText>
									<NormalText style = {styles.listSubText}>Is inviting you to: {item.name}</NormalText>
									<NormalText style = {styles.listSubText}>{checkAccepted(item)}</NormalText>
								</TouchableOpacity>
							</View>
					}
				/>
			</View>

		</Layout>

	);
}

const styles = StyleSheet.create({
	header:	{
		padding: 40,
		display: "flex",
		marginBottom: -20
	},
	headingText: {
		fontSize: 50
	},
	listView: {
		marginLeft: 25
	},
	listMainText: {
		padding: 12,
		marginLeft: -12,
		display: "flex",
		textAlign: 'left',
		fontSize: 24
	},
	listSubText: {
		marginLeft: 20,
		display: "flex",
		textAlign: 'left',
		fontSize: 18
	}
});
