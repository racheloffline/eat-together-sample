// A component that wraps elements in a view that prevents the keyboard from hiding them

import React from 'react';
import { KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';

const KeyboardAvoidingWrapper = props => {

    const {
        behavior = "position",
        style = {},
        keyboardVerticalOffset = 0
    } = props;

    return (
        <KeyboardAvoidingView style={style} behavior={behavior} keyboardVerticalOffset={keyboardVerticalOffset}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                {props.children}
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

export default KeyboardAvoidingWrapper;