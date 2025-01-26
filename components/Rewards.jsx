import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Modal, TouchableOpacity, Pressable } from 'react-native';
import Header from './Header.jsx';
import AsyncStorage from '@react-native-async-storage/async-storage';


function AnimalItem({ name, imageSource, index, blurRadius, onPress }) {
    return (
        <TouchableOpacity onPress={onPress} style={styles.animalItem}>
            <View style={styles.numberContainer}>
                <Text style={styles.numberText}>{index + 1}</Text>
            </View>
            <Image
                source={imageSource}
                style={styles.animalImage}
                blurRadius={blurRadius}
            />
            <Text style={styles.animalName}>{name}</Text>
        </TouchableOpacity>
    );
}

export default function Rewards() {

    const [totalPieces, setTotalPieces] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [unblurredModalVisible, setUnblurredModalVisible] = useState(false);

    const [currentAnimalName, setCurrentAnimalName] = useState('');
    const [currentAnimalRealImage, setCurrentAnimalRealImage] = useState(null);
    const [currentAnimalType, setCurrentAnimalType] = useState('');
    const [currentAnimalFact, setCurrentAnimalFact] = useState('');
    const [currentAnimalPoints, setCurrentAnimalPoints] = useState('');

    const animals = [
        {
            name: 'C-Teater', imageSource: require('../assets/images/cartoonAnimals/turtle.png'), imageSourceReal: require('../assets/images/realAnimals/turtle.jpg'), type: 'Sea Turtle', threshold: 10,
            fact: "It's estimated that approximately 52% of all sea turtles have eaten plastic! For most turtles, ingesting ONE piece of plastic is enough to kill them."
        },
        {
            name: 'Doile', imageSource: require('../assets/images/cartoonAnimals/dolphin.png'), imageSourceReal: require('../assets/images/realAnimals/dolphin.jpg'), type: 'Dolphin', threshold: 20,
            fact: "Dolphins have names for each other! They use unique whistles to call one another, much like how humans use names."
        },
        {
            name: 'Ellaphant', imageSource: require('../assets/images/cartoonAnimals/elephant.png'), imageSourceReal: require('../assets/images/realAnimals/elephant.jpg'), type: 'Elephant', threshold: 30,
            fact: "Elephants are known for their incredible memory. They can remember locations, other elephants, and even humans for many years."
        },
        {
            name: 'Shindo', imageSource: require('../assets/images/cartoonAnimals/whale.png'), imageSourceReal: require('../assets/images/realAnimals/whale.jpg'), type: 'Whale', threshold: 50,
            fact: "Whales communicate with each other through songs that can travel for miles underwater, and some whale songs can last up to 30 minutes!"
        },
        {
            name: 'Ziley', imageSource: require('../assets/images/cartoonAnimals/fish.png'), imageSourceReal: require('../assets/images/realAnimals/tuna.jpg'), type: 'Tuna', threshold: 70,
            fact: "Tuna are incredibly fast swimmers, reaching speeds of up to 75 km/h (46 mph) — faster than most cars on the highway!"
        },
        {
            name: 'Finneril', imageSource: require('../assets/images/cartoonAnimals/orange_fish.png'), imageSourceReal: require('../assets/images/realAnimals/clownfish.jpeg'), type: 'Clownfish', threshold: 100,
            fact: "Clownfish are immune to the stings of sea anemones, which they live in, due to a special layer of mucus on their skin."
        },
        {
            name: 'C-Boynel', imageSource: require('../assets/images/cartoonAnimals/seagull.png'), imageSourceReal: require('../assets/images/realAnimals/seagull.jpg'), type: 'Seagull', threshold: 150,
            fact: "Seagulls are known for their intelligence and problem-solving skills, often using tools to find food or even steal food from other birds!"
        },
        {
            name: 'Craleb', imageSource: require('../assets/images/cartoonAnimals/crab.png'), imageSourceReal: require('../assets/images/realAnimals/crab.jpg'), type: 'Crab', threshold: 200,
            fact: "Crabs have a unique way of walking called ‘sideways’ because of the structure of their legs, allowing them to move quickly across the sand."
        },
        {
            name: 'Fellie', imageSource: require('../assets/images/cartoonAnimals/fox.png'), imageSourceReal: require('../assets/images/realAnimals/fox.png'), type: 'Fox', threshold: 250,
            fact: "Foxes have excellent hearing and can hear a mouse squeak from 100 feet away, even if it's under the snow!"
        },
        {
            name: 'Shinx', imageSource: require('../assets/images/cartoonAnimals/starfish.png'), imageSourceReal: require('../assets/images/realAnimals/starfish.jpg'), type: 'Starfish', threshold: 300,
            fact: "Starfish have no brains or blood, but they can regenerate lost arms and even grow a completely new starfish from just one arm!"
        },
        {
            name: 'Trig', imageSource: require('../assets/images/cartoonAnimals/tiger.png'), imageSourceReal: require('../assets/images/realAnimals/tiger.jpg'), type: 'Tiger', threshold: 350,
            fact: "Tigers are the largest wild cats, with some males weighing over 600 pounds. They also have unique stripes, just like human fingerprints!"
        },
        {
            name: 'Shelly', imageSource: require('../assets/images/cartoonAnimals/seahorse.png'), imageSourceReal: require('../assets/images/realAnimals/seahorse.jpg'), type: 'Seahorse', threshold: 400,
            fact: "Seahorses are the only species where the males carry and give birth to the babies, not the females!"
        },
    ];

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

    const litter = totalPieces;

    const handleAnimalPress = (animal, isBlurry) => {
        setCurrentAnimalName(animal.name);
        setCurrentAnimalRealImage(animal.imageSourceReal);
        setCurrentAnimalType(animal.type);
        setCurrentAnimalFact(animal.fact);
        setCurrentAnimalPoints(animal.threshold);

        if (isBlurry) {
            setModalVisible(true);
        } else {
            setUnblurredModalVisible(true);
        }
    };

    return (
        <View style={styles.container}>
            <Header text="Rewards" />
            <View style={styles.animalContainer}>
                <View style={styles.animalList}>
                    {animals.map((animal, index) => {
                        const isBlurry = litter <= animal.threshold;
                        return (
                            <AnimalItem
                                key={index}
                                name={animal.name}
                                imageSource={animal.imageSource}
                                index={index}
                                blurRadius={isBlurry ? 10 : 0}
                                onPress={() => handleAnimalPress(animal, isBlurry)}
                            />
                        );
                    })}
                </View>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Unknown Animal</Text>
                        <Text style={styles.modalText}>
                            Pick up litter to discover new animals and unlock {currentAnimalName}!
                        </Text>
                        <Pressable
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={unblurredModalVisible}
                onRequestClose={() => setUnblurredModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>You have unlocked {currentAnimalName}!</Text>
                        <Image source={currentAnimalRealImage} style={styles.unblurredAnimalImage} />
                        <View style={styles.unblurredTextContainer}>
                            <Text style={styles.unblurredModalText}>Type: {currentAnimalType}!</Text>
                            <Text style={styles.unblurredModalText}>Did you know... </Text>
                            <Text style={styles.unblurredModalText}>{currentAnimalFact}</Text>
                            <Text style={styles.unblurredModalText}>Points: {currentAnimalPoints}</Text>
                        </View>
                        <Pressable
                            style={styles.closeButton}
                            onPress={() => setUnblurredModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
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
    animalContainer: {
        justifyContent: 'flex-start',
        width: '90%',
        padding: 20,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
        borderColor: '#dcdcdc',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    animalList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    animalItem: {
        width: '30%',
        marginVertical: 10,
        alignItems: 'center',
    },
    animalImage: {
        width: 80,
        height: 80,
        marginBottom: 5,
    },
    animalName: {
        fontSize: 14,
        textAlign: 'center',
        color: '#333',
    },
    numberContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 0,
    },
    numberText: {
        color: '#000000',
        fontSize: 20,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: '#e6f9e6',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalText: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 20,
    },
    unblurredTextContainer: {
        alignItems: 'left',
    },
    unblurredModalText: {
        fontSize: 14,
        textAlign: 'left',
        marginBottom: 20,
    },
    closeButton: {
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    closeButtonText: {
        color: '#000',
        fontSize: 16,
    },
    unblurredAnimalImage: {
        width: 290,
        height: 200,
        marginTop: 10,
        marginBottom: 20,
    },
});
