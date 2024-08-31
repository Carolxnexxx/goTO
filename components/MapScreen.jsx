import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { FontAwesome } from '@expo/vector-icons';
import Header from './Header.jsx';
import { useNavigation } from '@react-navigation/native';

export default function MapScreen() {
    const navigation = useNavigation();

    const initialRegion = {
        latitude: 43.6532, // Change these coordinates as needed
        longitude: -79.3832,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
    };

    const markers = [
        { id: 1, latitude: 43.6532, longitude: -79.3832 }, // Downtown Toronto
        { id: 2, latitude: 43.7001, longitude: -79.4163 }, // Another location
        { id: 3, latitude: 43.65107, longitude: -79.347015 }, // Third location
    ];

    return (
        <View style={styles.container}>
            <Header
                navigation={navigation}
                text="Cleanups"
            />
            <View style={styles.mapContainer}>
                <MapView
                    style={styles.map}
                    initialRegion={initialRegion}
                    showsUserLocation={true}
                    zoomEnabled={true}
                    showsCompass={true}
                    rotateEnabled={true}
                >
                    {/* Marker for "You Are Here" */}
                    <Marker
                        coordinate={{ latitude: 43.6532, longitude: -79.3832 }}
                        title="You Are Here"
                    >
                        <FontAwesome name="street-view" size={30} color="black" />
                    </Marker>

                    {/* Other markers */}
                    {markers.map((marker) => (
                        <Marker
                            key={marker.id}
                            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                            pinColor="blue" // Customize pin color
                        />
                    ))}
                </MapView>
            </View>

            {/* Add button */}
            <TouchableOpacity style={styles.addButton}>
                <FontAwesome name="plus" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.userButton}>
                <FontAwesome name="users" size={24} color="white" />
            </TouchableOpacity>
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
});
