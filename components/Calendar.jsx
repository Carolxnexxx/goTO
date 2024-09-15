import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars'; // Import the Calendar component
import Header from './Header.jsx';
import { useNavigation } from '@react-navigation/native';
import RegularButton from './RegularButton.jsx';

export default function CalendarScreen() {
    const navigation = useNavigation();

    const [markedDates, setMarkedDates] = useState({});

    useEffect(() => {
        // Example dates marked for cleanups and the current date
        const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
        setMarkedDates({
            [today]: { selected: true, marked: true, selectedColor: '#ff6666' }, // Example of current date
            '2024-09-11': { marked: true, dotColor: '#6ccf8e' }, // Example clean-up date
            '2024-09-15': { marked: true, dotColor: '#6ccf8e' },
        });
    }, []);

    // Function to handle day press (if you want any functionality when a date is clicked)
    const onDayPress = (day) => {
        console.log('Selected day', day);
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
                        <View style={[styles.legendDot, { backgroundColor: '#a8d3e6' }]} />
                        <Text style={styles.legendText}>Future Clean Ups</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: '#ff6666' }]} />
                        <Text style={styles.legendText}>Current date</Text>
                    </View>
                </View>
            </View>
            <RegularButton text="Add Another Clean Up" onPress={() => navigation.navigate('MapScreen')} />
        </View>
    );
};

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
    calendarContainer: {
        width: '100%',
        marginLeft: 40,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
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
});
