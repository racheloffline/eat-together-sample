import React, {useEffect, useState} from 'react';
import {View, ScrollView, StyleSheet, Image, Dimensions, FlatList} from 'react-native';
import {
  Layout,
  TopNav,
  Text,
  themeColor,
  useTheme,
  Button
} from "react-native-rapi-ui";
import firebase from "firebase";
import { Ionicons } from "@expo/vector-icons";
import {db} from "../../provider/Firebase";
import LargeText from "../../components/LargeText";
import MediumText from "../../components/MediumText";
import TagsList from "../../components/TagsList";
import {getAuth} from "firebase/auth";
import EventCard from '../../components/EventCard';

export default function ({ navigation }) {
    const user = firebase.auth().currentUser;
    const [name, setName] = React.useState('');
    const [quote, setQuote] = React.useState('');
    const [image, setImage] = React.useState('');
    const [tags, setTags] = React.useState('');
    const [events, setEvents] = useState([]);
    useEffect(() => {
            const ref = db.collection("Users");
            ref.onSnapshot((query) => {
                query.forEach(doc => {
                    if (doc.data().id === user.uid) {
                        setName(doc.data().name);
                        setQuote(doc.data().quote);
                        setImage(doc.data().image);
                        setTags(doc.data().tags);
                    }
                });
            });
            const ref2 = db.collection("Public Events");
            let list = [];
            ref2.onSnapshot((query) => {
                query.forEach(doc => {
                if (doc.data().hostID === user.uid) {
                    list.push(doc.data());
                }
                });
                setEvents(list);
            });
            const ref3 = db.collection("Private Events");
            ref3.onSnapshot((query) => {
                query.forEach(doc => {
                if (doc.data().hostID === user.uid) {
                    list.push(doc.data());
                }
                });
            setEvents(list);
            });
    }, []);
    return (
    <Layout>
        <View style={styles.page}>
            <View style={styles.background}/>
                <View style = {{paddingLeft: 350}}>
                    <Ionicons name="cog-outline" size = {30} onPress={() => {
                        navigation.navigate("Settings");
                    }}></Ionicons>
                </View>
                <Image style={styles.image} source={{uri: image}}/>
                <View style={styles.name}>
                    <LargeText>{name}</LargeText>
                    <View style = {{alignItems: 'center'}}>
                        <Ionicons name="calendar-outline" size = {30} onPress={() => {
                            navigation.navigate("Schedule");
                        }}></Ionicons>
                    </View>
                </View>
                <MediumText>{quote}</MediumText>
        </View>
        <FlatList contentContainerStyle={styles.cards} keyExtractor={item => item.id}
            data={events} renderItem={({item}) =>
                                <EventCard event={item} click={() => {
                                    navigation.navigate("FullCardPrivate", {
                                        event: item,
                                        public: false
                                    });
                                }}/>
                            }/>
    </Layout>

    );
}
const styles = StyleSheet.create({
  cards: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 40
  },
  page: {
    paddingTop: 30,
    alignItems: "center",
    paddingHorizontal: 10
  },

  background: {
    position: "absolute",
    width: Dimensions.get('screen').width,
    height: 100,
    backgroundColor: "#5DB075"
  },

  image: {
    width: 150,
    height: 150,
    borderColor: "white",
    borderWidth: 3,
    borderRadius: 100
  },

  name: {
    marginVertical: 20
  },
});
