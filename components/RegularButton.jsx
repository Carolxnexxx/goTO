import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function RegularButton(props) {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={props.onPress}>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{props.text}</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
        width: '100%',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 10,
        borderColor: '#dcdcdc',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginVertical: 0,
        width: '90%',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
});