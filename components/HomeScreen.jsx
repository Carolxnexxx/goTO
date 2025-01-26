import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Audio } from 'expo-av';
import Button from './Button.jsx';
import Header from './Header.jsx';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
    const [sound, setSound] = useState();
    const [totalPieces, setTotalPieces] = useState(0); 

    async function playSound() {
        const { sound } = await Audio.Sound.createAsync(require('../assets/sounds/button_click.mp3'));
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

    const calculateTotalPieces = async () => {
        try {
            const savedCleanUps = await AsyncStorage.getItem('cleanups');
            console.log('Fetched CleanUps:', savedCleanUps);

            if (savedCleanUps) {
                const cleanups = JSON.parse(savedCleanUps);
                console.log('Cleanups:', cleanups);

                const total = cleanups.reduce((sum, cleanup) => {
                    return sum + (typeof cleanup.pieces === 'number' ? cleanup.pieces : 0);
                }, 0);

                setTotalPieces(total);
            } else {
                setTotalPieces(0); 
            }
        } catch (error) {
            console.error('Error fetching cleanups:', error);
            setTotalPieces(0); 
        }
    };

    useEffect(() => {
        calculateTotalPieces(); 
    }, []);

    const handleButtonPressClean = () => {
        playSound();
        navigation.navigate('MapScreen');
    }

    const handleButtonPressSignOut = () => {
        playSound();
        navigation.navigate('LogIn');
    }

    const handleButtonPressRewards = () => {
        playSound();
        navigation.navigate('Rewards');
    }

    return (
        <View style={styles.container}>
            <Header navigation={navigation} text="Welcome! Start" text2="Cleaning Litter" text3="Today!" />

            <View style={styles.container2}>
                <View style={styles.litterContainer}>
                    <Text style={styles.litterTitle}>Pieces of litter cleaned: </Text>
                    <Text style={styles.litterCount}>{totalPieces.toString()}</Text>
                </View>
            </View>
            <Button
                text="Clean"
                subtext="Clean up trash and litter to earn points!"
                onPress={() => handleButtonPressClean()}
            />
            <Button
                text="Rewards"
                subtext="Get rewards from the points you earn!"
                onPress={() => handleButtonPressRewards()}
            />
            <Button
                text="Sign Out"
                subtext="or log into a different account"
                onPress={() => handleButtonPressSignOut()}
            />
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
    container2: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 0,
        padding: 0,
        width: "100%",
        marginTop: 30,
    },
    litterContainer: {
        width: '90%',
        padding: 20,
        backgroundColor: '#e6f9e6',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        borderColor: '#dcdcdc',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    litterTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    litterCount: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginTop: 10,
    },
});
