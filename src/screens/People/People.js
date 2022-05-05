//Meet other people

import React from "react";
import { View, StyleSheet, FlatList, Dimensions } from "react-native";
import { Layout } from "react-native-rapi-ui";
import * as firebase from "firebase";

import ProfileBubble from "../../components/ProfileBubble";
import Header from "../../components/Header";

export default class People extends React.PureComponent {
	state = {
		people: [
			{
				id: '1',
				name: "Athy Kimme",
				image: "https://e3.365dm.com/16/07/768x432/rtr3cltb-1_3679323.jpg?20160706114211",
				quote: "There is no sunrise so beautiful that it is worth waking me up to see it.",
				tags: [
					"Not here to date",
					"Brawl Stars",
					"Rock music",
					"Lover of Mexican food",
					"Memes",
					"Extroverted",
					"Outgoing"
				]
			},
			{
				id: '2',
				name: "Eriks Xiang",
				image: "https://e3.365dm.com/16/07/768x432/rtr3cltb-1_3679323.jpg?20160706114211",
				quote: "It's not a bug, it's a feature",
				tags: [
					"Computer science",
					"Introverted",
					"Music",
					"Lover of hot pot",
					"Hater of broccoli",
					"Memes"
				]
			},
			{
				id: '3',
				name: "Sofie Michelle",
				image: "https://e3.365dm.com/16/07/768x432/rtr3cltb-1_3679323.jpg?20160706114211",
				quote: "It's not a feature, it's a bug",
				tags: [
					"Arts",
					"Jazz music",
					"Hater of broccoli",
					"Hater of CS"
				]
			},
		]
	}

	render() {
		return (
			<Layout>
				<Header name="People" navigation = {this.props.navigation}/>

				<FlatList contentContainerStyle={styles.body} keyExtractor={item => item.id}
					data={this.state.people} renderItem={({item}) =>
						<ProfileBubble person={item} click={() => {
							this.props.navigation.navigate("FullProfile", {
								person: item
							});
						}}/>
					}/>
			</Layout>
		);
	}
}

const styles = StyleSheet.create({
	body: {
		alignItems: "center",
		backgroundColor: "black"
	},
});