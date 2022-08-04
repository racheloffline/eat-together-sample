import React from "react";
import { View, ScrollView } from "react-native";
import Tag from "./Tag";

const TagsList = props => {
    return (
        <View style={{ flexDirection: "row" }} onStartShouldSetResponder={() => true}>
            <ScrollView horizontal={true} style={{ marginVertical: 10 }}
                contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
            {props.tags.map((tag, i) => <Tag text={tag} key={tag}
                remove={props.remove ? () => props.remove(tag, i) : false}/>)}
            </ScrollView>
        </View>
    );
}

export default TagsList;