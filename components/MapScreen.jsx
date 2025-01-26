import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Modal,
    Text,
    Image,
    ScrollView,
    Alert,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { FontAwesome } from '@expo/vector-icons';
import Header from './Header.jsx';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import RegularButton from './RegularButton.jsx';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MapScreen({ navigation }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [infoModalVisible, setInfoModalVisible] = useState(false);
    const [images, setImages] = useState([]);
    const [markers, setMarkers] = useState([]);
    const [region, setRegion] = useState({
        latitude: 43.6532,
        longitude: -79.3832,
        latitudeDelta: 1,
        longitudeDelta: 1,
    });
    const [currentLocation, setCurrentLocation] = useState(null);

    useEffect(() => {
        const fetchLocationAndMarkers = async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permission denied', 'You need to grant location permission to use this feature');
                    return;
                }

                const { coords } = await Location.getCurrentPositionAsync();
                setRegion({
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,
                });
                setCurrentLocation({
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                });

                await loadMarkers();
            } catch (error) {
                console.error('Error initializing map:', error);
                Alert.alert('Error', 'Failed to initialize map. Please try again later.');
            }
        };

        fetchLocationAndMarkers();
    }, []);

    const loadMarkers = async () => {
        try {
            const storedMarkers = await AsyncStorage.getItem('cleanups');
            if (storedMarkers) {
                const parsedMarkers = JSON.parse(storedMarkers);
                setMarkers(parsedMarkers);
                console.log('Markers loaded:', parsedMarkers);
            } else {
                console.log('No markers found in storage.');
            }
        } catch (error) {
            console.error('Failed to load markers:', error);
        }
    };

    const addMarker = async () => {
        if (!currentLocation) {
            Alert.alert('Error', 'Unable to get current location. Please try again.');
            return;
        }

        const newMarker = {
            id: Date.now().toString(),
            date: today,
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            pieces: images.length,
            images: [...images],
        };

        const updatedMarkers = [...markers, newMarker];

        try {
            await AsyncStorage.setItem('cleanups', JSON.stringify(updatedMarkers));
            console.log('Successfully saved to AsyncStorage:', updatedMarkers);
        } catch (error) {
            console.error('Error saving data:', error);
            Alert.alert('Failed to save data.');
        }

        setMarkers(updatedMarkers);
        setModalVisible(false);
        setImages([]);
    };

    const today = new Date().toISOString().split('T')[0];

    const pickImage = async () => {
        try {
            const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

            if (!permissionResult.granted) {
                Alert.alert('Permission denied', 'You need to grant camera permission to use this feature');
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled) {
                setImages([...images, result.assets[0].uri]);
            }
        } catch (error) {
            console.error('Error opening camera:', error);
            Alert.alert('Error', 'There was an issue opening the camera. Please check if another app is using it.');
        }
    };

    const removeImage = (index) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
    };

    return (
        <View style={styles.container}>
            <Header navigation={navigation} text="Cleanups" />
            <View style={styles.mapContainer}>
                <MapView
                    style={styles.map}
                    initialRegion={region}
                    showsUserLocation={true}
                    zoomEnabled={true}
                    showsCompass={true}
                    rotateEnabled={true}
                >
                    {markers.map((marker) => (
                        <Marker
                            key={marker.id}
                            coordinate={{
                                latitude: marker.latitude,
                                longitude: marker.longitude,
                            }}
                            pinColor="#6ccf8e"
                            title={`Cleanup on ${marker.date}`}
                            description={`Pieces: ${marker.pieces}`}
                        />
                    ))}
                </MapView>

            </View>

            <View style={styles.buttonContainers}>
                <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                    <FontAwesome name="plus" size={24} color="white" />
                </TouchableOpacity>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity
                            style={styles.closeModalButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <FontAwesome name="times" size={24} color="black" />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                            <Text style={styles.imageButtonText}>Take a Picture of Litter</Text>
                        </TouchableOpacity>

                        <ScrollView
                            contentContainerStyle={styles.imageGrid}
                            style={styles.imageScrollView}
                        >
                            {images.map((imageUri, index) => (
                                <View key={index} style={styles.imageWrapper}>
                                    <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                                    <TouchableOpacity
                                        style={styles.removeImageButton}
                                        onPress={() => removeImage(index)}
                                    >
                                        <FontAwesome name="times-circle" size={20} color="red" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => {
                                addMarker(); 
                            }}
                        >
                            <Text style={styles.closeButtonText}>Track</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </Modal>

            <RegularButton text="Calendar" onPress={() => navigation.navigate("Calendar")} />
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
    mapContainer: {
        width: 370,
        height: 500,
        borderRadius: 15,
        overflow: 'hidden',
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginBottom: 15,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    addButton: {
        position: 'absolute',
        bottom: 30,
        right: -170,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#00aaff',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    calendarContainer: {
        marginTop: 20,
    },
    cleanupItem: {
        marginBottom: 10,
    },
    imagePreview: {
        width: 100,
        height: 100,
        borderRadius: 20,
    },
    imagePreviewContainer: {
        flexDirection: 'row',
        marginBottom: 10,
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
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    closeModalButton: {
        position: 'absolute',
        top: -15,
        left: -15,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    closeButton: {
        backgroundColor: '#a8d3e6',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 16,
        color: '#fff',
    },
    imageGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    imageWrapper: {
        marginBottom: 10,
    },
    imageButton: {
        backgroundColor: '#00aaff',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    imageButtonText: {
        color: '#fff',
    },
    removeImageButton: {
        position: 'absolute',
        top: -10,
        right: -10,
        backgroundColor: 'rgba(255, 0, 0, 0.7)',
        borderRadius: 15,
        padding: 5,
    },
});
