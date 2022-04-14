//Meet other people

import React from "react";
import { View, StyleSheet, FlatList, Dimensions } from "react-native";
import * as firebase from "firebase";

import ProfileBubble from "../../components/ProfileBubble";

import {
  Layout,
  Button,
  Text,
  TopNav,
  Section,
  SectionContent,
  useTheme,
} from "react-native-rapi-ui";

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
					"Brawl Stars"
				]
			},
			{
				id: '2',
				name: "Eriks Xiang",
				image: "https://e3.365dm.com/16/07/768x432/rtr3cltb-1_3679323.jpg?20160706114211",
				quote: "It's not a bug, it's a feature",
				tags: [
					"Computer science",
					"Introverted"
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
					"Hater of broccoli"
				]
			},
		]
	}

	render() {
		return (
			<Layout>
				<View style={styles.header}>
					<Text size="h1">People</Text>
				</View>

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
	header: {
	  padding: 10,
	  display: "flex",
	  marginBottom: 10
	},

	body: {
		alignItems: "center",
		backgroundColor: "black"
	},
});