import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';
import { LitterContext, LitterProvider } from './LitterContext';
import Button from './Button.jsx';
import Title from './Title.jsx';
import Header from './Header.jsx'

export default function HomeScreen() {
    const navigation = useNavigation();
    const [sound, setSound] = useState();
    const { totalLitter } = useContext(LitterContext);

    async function playSound() {
        const { sound } = await Audio.Sound.createAsync(require('../assets/sounds/button_click.mp3')
        );
        setSound(sound);

        await sound.playAsync();
    }

    useEffect(() => {
        return sound
            ? () => {
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    const handleButtonPressClean = () => {
        playSound();
        navigation.navigate('Clean')
    }

    const handleButtonPressLogIn = () => {
        playSound();
        navigation.navigate('Log In')
    }

    const handleButtonPressRewards = () => {
        playSound();
        navigation.navigate('Rewards')
    }

    return (
        <LitterProvider>
            <View style={styles.container}>
                <Header navigation={navigation} text="Welcome! Start" text2="Cleaning Litter" text3="Today!" />
                <Title text="Pieces of litter cleaned:" subtext={totalLitter} />
                <Button text="Sign in" subtext="or Sign up" onPress={() => handleButtonPressLogIn()} />
                <Button text="Clean" subtext="Clean up trash and litter to earn points!" onPress={() => handleButtonPressClean()} />
                <Button text="Rewards" subtext="Get rewards from the points you earn!" onPress={() => handleButtonPressRewards()} />
            </View>
        </LitterProvider>

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