import React from "react";
import { StyleSheet, View, Image } from "react-native";

const styles = StyleSheet.create({
    icon: {
        position: "absolute",
        right: 285,
        top: 70,
    },

    image: {
        resizeMode: 'contain',
        width: 70,
        height: 70,
        borderColor: "red",
        borderWidth: 3,
        // borderRadius: 100,
        backgroundColor: "white",
      },
});

const WithBadge = props => {
    return (
        <View style={styles.icon}>
          <Image style={styles.image}
                source={ (props.mealsSignedUp >= 50) ? require( "../../assets/food.jpg") :
                            ( (props.mealsSignedUp >= 10) && (props.mealsAttended >= 0.75) ? require( "../../assets/foodBackground.png") :
                                    ( (props.mealsSignedUp >= 10) ? require ( "../../assets/register.png")
                                                                  : require ( "../../assets/forget.png") 
                                    )
                            )
                        }
            />
        </View>
    );
  }

export default WithBadge;
