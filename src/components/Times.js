import React from "react";
import { ScrollView } from "react-native";

import Button from "./Button";

const Times = props => {
    return (
        <ScrollView style={{marginTop: 10}}>
            {props.times.map((t, i) =>
                <Button backgroundColor={!t.available ? "#444444" : null}
                    marginVertical={8} key={i} onPress={() => props.change(i)}>
                        {t.startTime.format("h a").toString()} - {t.endTime.format("h a").toString()}
                </Button>)}
        </ScrollView>
    );
}

export default Times;