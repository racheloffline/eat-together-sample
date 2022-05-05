import React, { useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Layout } from "react-native-rapi-ui";

import Button from "../../../../components/Button";
import Times from "../../../../components/Times";
import LargeText from "../../../../components/LargeText";

const Sunday = props => {
    const [times, setTimes] = useState(props.times);

    const clickTime = index => {
      const newTimes = [...times];
      newTimes[index].clicked = !newTimes[index].clicked;
      setTimes(newTimes);
    }

    return (
        <Layout style={styles.page}>
            <LargeText center>What times are you available on Sunday?</LargeText>

            <Times times={times} change={clickTime}/>

            <View style={styles.buttons}>
                <Button onPress={() => {
                  props.setTimes(times);
                  props.navigation.goBack();
                }}
                  marginHorizontal={10}>Save!</Button>
            </View>
        </Layout>
    );
}

const styles = StyleSheet.create({
    page: {
      alignItems: "center",
      width: Dimensions.get('screen').width,
      paddingHorizontal: 20,
      paddingVertical: 50
    },
  
    buttons: {
      marginTop: 50,
      display: "flex",
      flexDirection: "row",
      justifyContent: "center"
    }
  });
  

export default Sunday;