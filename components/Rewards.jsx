import React, { useContext, useState } from 'react';
import { View, Text, Image, StyleSheet, Modal, TouchableOpacity, Pressable } from 'react-native';
import { LitterContext } from './LitterContext.jsx';
import Header from './Header.jsx';

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
    const { totalLitter } = useContext(LitterContext);

    const [modalVisible, setModalVisible] = useState(false);
    const [unblurredModalVisible, setUnblurredModalVisible] = useState(false);

    const [currentAnimalName, setCurrentAnimalName] = useState('');
    const [currentAnimalImage, setCurrentAnimalImage] = useState(null);
    const [currentAnimalType, setCurrentAnimalType] = useState('');
    const [currentAnimalFact, setCurrentAnimalFact] = useState('');

    const animals = [
        { name: 'C-Teater', imageSource: require('../assets/images/turtle.png'), type: 'Sea Turtle', threshold: 100,
            fact: "It's estimated that approximately 52% of all sea turtles have eaten plastic! For most turtles, ingesting ONE piece of plastic is enough to kill them."},
        { name: 'Doile', imageSource: require('../assets/images/dolphin.png'), type: 'Dolphin', threshold: 200 },
        { name: 'Ellaphant', imageSource: require('../assets/images/elephant.png'), type: 'Elephant', threshold: 300 },
        { name: 'Shindo', imageSource: require('../assets/images/whale.png'), type: 'Whale', threshold: 500 },
        { name: 'Ziley', imageSource: require('../assets/images/fish.png'), type: 'Tuna', threshold: 700 },
        { name: 'Finneril', imageSource: require('../assets/images/orange_fish.png'), type: 'Clownfish', threshold: 1000 },
        { name: 'C-Boynel', imageSource: require('../assets/images/seagull.png'), type: 'Seagull', threshold: 1500 },
        { name: 'Craleb', imageSource: require('../assets/images/crab.png'), type: 'Crab', threshold: 2000 },
        { name: 'Fellie', imageSource: require('../assets/images/fox.png'), type: 'Fox', threshold: 2500 },
        { name: 'Shinx', imageSource: require('../assets/images/starfish.png'), type: 'Starfish', threshold: 3000 },
        { name: 'Trig', imageSource: require('../assets/images/tiger.png'), type: 'Tiger', threshold: 3500 },
        { name: 'Shelly', imageSource: require('../assets/images/seahorse.png'), type: 'Seahorse', threshold: 4000 },
    ];

    const handleAnimalPress = (animal, isBlurry) => {
        setCurrentAnimalName(animal.name);
        setCurrentAnimalImage(animal.imageSource);
        setCurrentAnimalType(animal.type);
        setCurrentAnimalFact(animal.fact);

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
                        const isBlurry = totalLitter <= animal.threshold;
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
                        <Text style={styles.modalTitle}>Congratulations!</Text>
                        <Image source={currentAnimalImage} style={styles.unblurredAnimalImage} />
                        <Text style={styles.modalText}>
                            You have unlocked {currentAnimalName}
                        </Text>
                        <Text style={styles.modalText}>
                            Type: {currentAnimalType}!
                        </Text>
                        <Text style={styles.modalText}>
                            Did you know... {currentAnimalType}
                        </Text>
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
        width: 100,
        height: 100,
        marginBottom: 10,
    },
});
