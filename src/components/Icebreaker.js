import React from 'react';
import { View } from 'react-native';
import NormalText from './NormalText';

const Icebreaker = props => {
    return (
        <View style={{marginTop: 10}}>
            <NormalText color="white">
                {props.number}. {props.icebreaker}
            </NormalText>
        </View>
        
    );
}

export default Icebreaker;