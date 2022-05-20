import React from "react";
import { TextInput } from "react-native-rapi-ui";
import { FontAwesome } from "@expo/vector-icons";

const Searchbar = props => {
    return (
        <TextInput leftContent={<FontAwesome name="search" size={18} color="black" />}
            placeholder={props.placeholder} value={props.value} onChangeText={text => props.onChangeText(text)}
            containerStyle={{ width: props.width }}/>
    );
}

export default Searchbar;