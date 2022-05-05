import React from "react";
import { ScrollView, StyleSheet, Dimensions } from "react-native";

import Button from "./Button";

const Times = props => {
    return (
        <ScrollView style={{marginTop: 10}}>
            {props.times.map((t, i) =>
                <Button backgroundColor={!t.clicked ? "#444444" : null}
                    marginVertical={8} key={i} onPress={() => 
                    props.change(i)}>{t.time}</Button>)}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    layout: {
        width: Dimensions.get('screen').width/1.2
    }
});

export default Times;