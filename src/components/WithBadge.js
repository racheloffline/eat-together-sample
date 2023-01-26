import React from "react";
import { StyleSheet, View, Image } from "react-native";

const styles = StyleSheet.create({
    image: {
        resizeMode: 'contain',
        width: 50,
        height: 50,
        borderRadius: 50,
        backgroundColor: "white",
      },
});

const WithBadge = props => {
    const ratio = props.mealsAttended / props.mealsSignedUp;

    return (
        <View style={styles.icon}>
            {props.mealsSignedUp >= 5 && ratio >= 0.7 && <Image style={styles.image}
                source={ ratio >= 0.9 ? require( "../../assets/food.jpg") :
                        ( ratio >= 0.8 ? require( "../../assets/foodBackground.png")
                            : require ( "../../assets/forget.png") 
                        )
                    }
                />}
        </View>
    );
  }

export default WithBadge;
