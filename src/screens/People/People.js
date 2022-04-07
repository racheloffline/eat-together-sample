//Meet other people

import React from "react";
import { View, StyleSheet, Image } from "react-native";
import * as firebase from "firebase";

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
	render() {
		return (
			<Layout>
				<View style={styles.header}>
					<Text size="h1">People</Text>
				</View>

				<View style={styles.body}>
					<Text>Meet interesting people here!</Text>
				</View>
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
  
	cards: {
	  alignItems: "center"
	},
});