import React from "react";
import { StyleSheet, View, Image } from "react-native";


const WithBadge = props => {
    const ratio = props.mealsAttended / props.mealsSignedUp;
    const color = props.color;

    const styles = StyleSheet.create({
        image: {
            resizeMode: 'contain',
            width: 50,
            height: 50,
            borderRadius: 100,
            backgroundColor: color,
          },
    });

    return (
        <View style={styles.icon}>
            {props.mealsSignedUp >= 5 && ratio > 0.7 && <Image style={styles.image}
                source={ ratio >= 0.9 ? require( "../../assets/gold.jpg") :
                        ( ratio >= 0.8 ? require( "../../assets/orange.jpg")
                            : require ( "../../assets/black.jpg") 
                        )
                    }
                />}
        </View>
    );
  }

export default WithBadge;
