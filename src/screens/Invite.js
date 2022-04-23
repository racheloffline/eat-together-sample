//Chat with users you have already connected with

import React from 'react';
import {FlatList, View} from 'react-native';
import { Layout, Text } from 'react-native-rapi-ui';

export default function ({ navigation }) {
	//Get a list of current chats from Firebase up here

	//Fill this in later
	const data = [];

	//The actual UI
	return (
		<View style = {{flex:1}}>

			//Heading view
			<View style = {styles.header}>

				//Heading text: invites page
				<Text size = "h1">Invites</Text>
			</View>

			//List view
			<View style = {styles.list}>

				//List of invites
				<FlatList
					data = {data} //Data for list should be the list of invites we get from firebase
					renderItem={({item}) => <Text style={styles.item}>{item.key}</Text>}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	header:	{
		padding: 10,
		display: "flex",
		marginBottom: 10
	},
	list: {
		padding: 5,
		display: "flex",
		fontWeight: 'bold',
		textAlign: 'center'
	}
});
