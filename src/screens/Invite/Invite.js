//Chat with users you have already connected with

import React from 'react';
import {FlatList, View, StyleSheet} from 'react-native';
import { Layout, Text } from 'react-native-rapi-ui';

export default function ({ navigation }) {
	//Get a list of current chats from Firebase up here

	//Fill this in later
	const data = [
		{key: 'Devin'},
		{key: 'Dan'},
		{key: 'Dominic'},
		{key: 'Jackson'},
		{key: 'James'},
		{key: 'Joel'},
		{key: 'John'},
		{key: 'Jillian'},
		{key: 'Jimmy'},
		{key: 'Julie'},
	];

	return (
		<View style = {{flex:1}}>

			<View style = {styles.header}>

				<Text style = {styles.headingText}>Invites</Text>
			</View>

			<View style = {styles.listView}>

				<FlatList
					data = {data}
					renderItem={
						({item}) =>
							<View>
								<Text style = {styles.listMainText}>{item.key}</Text>
								<Text style = {styles.listSubText}>Is inviting you to:</Text>
							</View>
					}
				/>
			</View>
		</View>
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
		padding: 20,
		display: "flex",
		fontWeight: 'bold',
		textAlign: 'left',
		fontSize: 24
	},
	listSubText: {
		marginLeft: 20,
		marginTop: -20,
		display: "flex",
		textAlign: 'left',
		fontSize: 18
	}
});
