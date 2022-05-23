//View invites to private events

import React, {useEffect, useState} from 'react';
import {FlatList, View, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import {Layout, TopNav} from 'react-native-rapi-ui';
import NormalText from "../../components/NormalText";
import {Ionicons} from "@expo/vector-icons";
import MediumText from "../../components/MediumText";
import {db} from "../../provider/Firebase";
import firebase from "firebase";
import HorizontalSwitch from "../../components/HorizontalSwitch";
import InviteIcon from "./InviteIcon";

export default function ({ navigation }) {
	//Get a list of current invites from Firebase up here
	const user = firebase.auth().currentUser;
	const [invites, setInvites] = useState([]); // initial state, function used for updating initial state

	//check to see which text to display for accepted status
	function checkAccepted(item) {
		if(item.accepted == null) {
			return "New invite!"
		} else if(item.accepted === "accepted") {
			return "You have accepted this invite!"
		} else if(item.accepted === "declined") {
			return "You have declined this invite."
		} else {
			return "ERROR";
		}
	}

	//Check to see if we should display the "No Invites" placeholder text
	function shouldDisplayPlaceholder(list) {
		if(list == null || list.length === 0) {
			return "No invites as of yet. Explore some public events! :)"
		} else {
			return ""
		}
	}

	useEffect(() => {

		let ref = db.collection("User Invites").doc(user.uid).collection("Invites");
		ref.onSnapshot((query) => {
			const list = [];
			query.forEach((doc) => {
				let data = doc.data();
				list.push({
					id: doc.id,
					name: data.name,
					image: data.image,
					hasImage: data.hasImage,
					location: data.location,
					//date: DateTimeConverter.getDate(DateTimeConverter.toDate(data.date)), // Fix this, add time back?
					date: data.date.toDate().toDateString(),
					time: data.date.toDate().toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'}),
					details: data.description,
					hostID: data.hostID,
					hostName: data.hostName,
					hostImage: data.hostImage,
					accepted: data.accepted,
					inviteID: data.inviteID
				});
			});
			setInvites(list);
		});

	}, []);

	return (
		<Layout>
			<TopNav
				middleContent={
					<MediumText center>Notifications</MediumText>
				}
				leftContent={
					<Ionicons
						name="chevron-back"
						size={20}
					/>
				}
				rightContent={
					<Ionicons
						name="person-add"
						size={20}
					/>
				}
				leftAction={() => navigation.goBack()}
				rightAction={() => navigation.navigate("Connections")}
			/>
			<View style = {styles.switchView}>
				<HorizontalSwitch left="Invites" right="Chats" current="left" press={(val) => navigation.navigate("Chats")}/>
			</View>
			<View style = {styles.noInvitesView}>
				<NormalText center={"center"}>{shouldDisplayPlaceholder(invites)}</NormalText>
			</View>
			<View style = {styles.listView}>
				<FlatList
					data = {invites}
					renderItem={
						({item}) =>
							<TouchableOpacity onPress={() => {
								navigation.navigate("InviteFull", {
									invite: item
								})
							}}>
								<View style = {styles.buttons}>
									<View width = {60} marginTop = {25}>
										<InviteIcon accepted = {item.accepted}/>
									</View>
									<View width = {300} >
										<MediumText style = {styles.listMainText}>{item.hostName}</MediumText>
										<NormalText style = {styles.listSubText}>Is inviting you to: {item.name}</NormalText>
										<NormalText style = {styles.listSubText}>{checkAccepted(item)}</NormalText>
									</View>
								</View>
							</TouchableOpacity>

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
	switchView: {
		marginVertical: 10
	},
	noInvitesView: {
		marginVertical: -20,
	},
	listView: {
		marginLeft: -15
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
	},
	buttons: {
		justifyContent: "center",
		flexDirection: "row"
	}
});
