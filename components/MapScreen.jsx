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
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { storeData, getData } from '../storage';
import RegularButton from './RegularButton.jsx';

export default function MapScreen({ navigation }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [images, setImages] = useState([]);
    const [markers, setMarkers] = useState([]);
    const [cleanUps, setCleanUps] = useState([]);
    const [region, setRegion] = useState({
        latitude: 43.6532,
        longitude: -79.3832,
        latitudeDelta: 1,
        longitudeDelta: 1,
    });
    const [currentLocation, setCurrentLocation] = useState(null);

    useEffect(() => {
        const fetchLocation = async () => {
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
            } catch (error) {
                console.error('Error getting location:', error);
                Alert.alert('Error', 'Failed to get location. Please try again later.');
            }
        };

        fetchLocation();
        loadCleanUps();
        loadMarkers();
    }, []);

    const loadCleanUps = async () => {
        try {
            const savedCleanUps = await getData('@cleanUps');
            setCleanUps(savedCleanUps || []);
        } catch (error) {
            console.error('Failed to load cleanUps:', error);
        }
    };

    const loadMarkers = async () => {
        try {
            const savedMarkers = await getData('@markers');
            setMarkers(savedMarkers || []);
        } catch (error) {
            console.error('Failed to load markers:', error);
        }
    };

    const addMarker = () => {
        if (!currentLocation) {
            Alert.alert('Error', 'Unable to get current location. Please try again.');
            return;
        }

        const newMarker = {
            id: markers.length + 1,
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
        };

        const updatedMarkers = [...markers, newMarker];
        setMarkers(updatedMarkers);
        storeData('@markers', updatedMarkers);

        const currentDate = new Date().toLocaleDateString();
        const newCleanup = {
            date: currentDate,
            location: currentLocation,
            pieces: images.length,
            images: [...images],
        };

        const updatedCleanUps = [...cleanUps, newCleanup];
        setCleanUps(updatedCleanUps);
        storeData('@cleanUps', updatedCleanUps);

        setModalVisible(false);
        setImages([]);
    };

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        if (!permissionResult.granted) {
            Alert.alert('Permission denied', 'You need to grant camera permission to use this feature');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImages([...images, result.assets[0].uri]);
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
                        />
                    ))}
                </MapView>
            </View>

            <View style={styles.buttonContainers}>
                <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                    <FontAwesome name="plus" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.userButton}>
                    <FontAwesome name="users" size={24} color="white" />
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
                        {/* Close Button */}
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

                        <TouchableOpacity style={styles.closeButton} onPress={addMarker}>
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
        height: 550,
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
        bottom: 20,
        right: 40,
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
    userButton: {
        position: 'absolute',
        bottom: 20,
        left: 40,
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
    buttonContainers: {
        top: -10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
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
    imageButton: {
        backgroundColor: '#ffffff',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        width: '100%',
        alignItems: 'center',
    },
    imageButtonText: {
        color: 'black',
        fontSize: 16,
    },
    imagePreviewContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    imageWrapper: {
        position: 'relative',
        marginRight: 10,
    },
    imagePreview: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    removeImageButton: {
        position: 'absolute',
        top: 5,
        right: 5,
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
        color: '#000',
        fontSize: 16,
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
    imageScrollView: {
        maxHeight: 300,
        width: '100%',
    },
    imageGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    imageWrapper: {
        width: '33.33%',
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imagePreview: {
        width: '100%',
        height: 100,
        borderRadius: 10,
    },
});
