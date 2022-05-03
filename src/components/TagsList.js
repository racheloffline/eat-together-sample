import React from "react";
import { ScrollView } from "react-native";
import Tag from "./Tag";

const TagsList = props => {
    return (
        <ScrollView horizontal={true} style={{
            display: "flex",
            flexDirection: "row",
            marginBottom: 10
        }}>
          {props.tags.map(tag => <Tag text={tag} key={tag}/>)}
        </ScrollView>
    );
}

export default TagsList;