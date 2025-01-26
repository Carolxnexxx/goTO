import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars'; 
import Header from './Header.jsx';
import { useNavigation } from '@react-navigation/native';
import RegularButton from './RegularButton.jsx';
import { getData } from '../storage'; 
import { Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

export default function CalendarScreen() {
    const navigation = useNavigation();
    const [markedDates, setMarkedDates] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCleanup, setSelectedCleanup] = useState(null); 

    useEffect(() => {
        const fetchCleanups = async () => {
            try {
                const savedCleanUps = await AsyncStorage.getItem('cleanups');
                const parsedCleanUps = savedCleanUps ? JSON.parse(savedCleanUps) : [];
                
                const today = new Date().toISOString().split('T')[0]; 

                let updatedMarkedDates = {};

                if (Array.isArray(parsedCleanUps)) {
                    parsedCleanUps.forEach((cleanup) => {
                        const cleanupDate = cleanup.date; 

                        if (cleanupDate) {
                            updatedMarkedDates[cleanupDate] = {
                                marked: true,
                                dotColor: '#6ccf8e', 
                            };
                        }
                    });
                }

                console.log('Updated markedDates:', updatedMarkedDates);
                setMarkedDates(updatedMarkedDates);
            }
            catch (error) {
                console.error('Error fetching cleanups:', error);
            }
        };
        fetchCleanups(); 
    }, []);

    const onDayPress = async (day) => {
        console.log('Pressed day:', day.dateString); 
        
        if (markedDates[day.dateString] && markedDates[day.dateString].dotColor === '#6ccf8e') {
            try {
                const savedCleanUps = await AsyncStorage.getItem('cleanups');
                
                if (savedCleanUps) {
                    const cleanups = JSON.parse(savedCleanUps);
                    console.log('Cleanups retrieved from AsyncStorage:', cleanups);
    
                    const cleanup = cleanups.find(c => c.date === day.dateString);
                    console.log('Cleanup for selected day:', cleanup); 
    
                    if (cleanup) {
                        console.log('Pieces of litter cleaned:', cleanup.pieces); 
                        setSelectedCleanup(cleanup); 
                        setModalVisible(true); 
                    } else {
                        console.log('No cleanup data for this day'); 
                    }
                } else {
                    console.log('No cleanups found in AsyncStorage'); 
                }
            } catch (error) {
                console.log('Error fetching cleanups from AsyncStorage:', error); 
            }
        } else {
            console.log('No cleanup available for this date or no green dot'); 
        }
    };

    const getCleanupForDate = async (date) => {
        try {
            const savedCleanUps = await getData('@cleanups');
            console.log('Stored cleanups:', savedCleanUps); 

            if (savedCleanUps) {
                if (typeof savedCleanUps === 'object' && !Array.isArray(savedCleanUps)) {
                    savedCleanUps = Object.values(savedCleanUps).flat();
                }
    
                console.log('Normalized cleanups array:', savedCleanUps);
    
                const cleanupsForDate = savedCleanUps.filter(cleanup => cleanup.date === date);
    
                console.log('Found cleanups for date:', cleanupsForDate); 
    
                return cleanupsForDate.length > 0 ? cleanupsForDate[0] : null;
            }
            return null; 
        } catch (error) {
            console.error('Error fetching cleanups:', error);
            return null;
        }
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedCleanup(null); 
    };

    return (
        <View style={styles.container}>
            <Header navigation={navigation} text="Past Clean Ups" />
            <View style={styles.calendarContainer}>
                <Calendar
                    onDayPress={onDayPress}
                    markedDates={markedDates}
                    theme={{
                        calendarBackground: '#e6f9e6',
                        textSectionTitleColor: '#333',
                        dayTextColor: '#333',
                        todayTextColor: '#ff6666',
                        selectedDayBackgroundColor: '#ff6666',
                        arrowColor: '#6ccf8e',
                        dotColor: '#6ccf8e',
                        monthTextColor: '#333',
                        textDayFontWeight: '300',
                        textMonthFontWeight: 'bold',
                        textDayHeaderFontWeight: '300',
                        textDayFontSize: 16,
                        textMonthFontSize: 20,
                        textDayHeaderFontSize: 14,
                    }}
                    style={styles.calendar}
                />
                <View style={styles.legendContainer}>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: '#6ccf8e' }]} />
                        <Text style={styles.legendText}>Past Clean Ups</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: '#ff6666' }]} />
                        <Text style={styles.legendText}>Current date</Text>
                    </View>
                </View>
            </View>
            <RegularButton text="Add Another Clean Up" onPress={() => navigation.navigate('MapScreen')} />

            {selectedCleanup && modalVisible && (
                <Modal
                    visible={modalVisible}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={closeModal}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Cleanup Details</Text>

                            <Text style={styles.modalText}>
                                Pieces of Litter Cleaned: {selectedCleanup.pieces || 'N/A'}
                            </Text>

                            {selectedCleanup.images && selectedCleanup.images.length > 0 ? (
                                <Image
                                    source={{ uri: selectedCleanup.images[0] }}
                                    style={styles.cleanupImage}
                                    onError={() => console.error('Image failed to load')}
                                />
                            ) : (
                                <Text style={styles.modalText}>No images available.</Text>
                            )}

                            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    cleanupImage: {
        width: 250, 
        height: 200,
        marginBottom: 10, 
        borderRadius: 10, 
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '100%',
        position: 'absolute',
        top: 0,
        zIndex: 5,
    },
    calendarContainer: {
        width: '100%',
        marginLeft: 40,
    },
    calendar: {
        borderRadius: 10,
        overflow: 'hidden',
        width: '90%',
        paddingBottom: 10,
        marginBottom: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        borderColor: '#dcdcdc',
        borderWidth: 1,
    },
    legendContainer: {
        width: '90%',
        padding: 20,
        backgroundColor: '#e6f9e6',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderColor: '#dcdcdc',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        flexDirection: 'row',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    legendDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 5,
    },
    legendText: {
        fontSize: 12,
        color: '#333',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: 300,
        padding: 20,
        backgroundColor: 'white', // Ensure the modal has a solid white background
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalText: {
        fontSize: 16,
        marginBottom: 10,
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#6ccf8e',
        padding: 10,
        borderRadius: 5,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
    },
});
