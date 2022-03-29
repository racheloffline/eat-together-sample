//Chat with users you have already connected with

import React from 'react';
import { View } from 'react-native';
import { Layout, Text } from 'react-native-rapi-ui';

export default function ({ navigation }) {
	return (
		<Layout>
			<View
				style={{
					flex: 1,
					backgroundColor: "pink",
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<Text>Our chat goes here!</Text>
			</View>
		</Layout>
	);
}
