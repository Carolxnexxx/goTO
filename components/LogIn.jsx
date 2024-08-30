import React from 'react';
import { StyleSheet, View } from 'react-native';
import Header from './Header.jsx';
import SmallTextInput from './SmallTextInput.jsx';
import RegularButton from './RegularButton.jsx';

export default function LogIn({ notificationCallback }) {

    const handlePress = () => {
        notificationCallback();
    }

    return (
        <View style={styles.container}>
            <Header text="Sign in or Sign up" />
            <SmallTextInput />
            <RegularButton text="Notifications?" onPress={handlePress}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '100%',
        position: 'absolute',
        top: 0,
        zIndex: 5,
    },
});
