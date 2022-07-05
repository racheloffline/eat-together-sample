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
          {props.tags.map((tag, i) => <Tag text={tag} key={tag}
            remove={props.remove ? () => props.remove(tag, i) : false}/>)}
        </ScrollView>
    );
}

export default TagsList;