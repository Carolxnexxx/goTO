import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CleanUp from './CleanUp.jsx';
import RegularButton from './RegularButton.jsx';

export default function CleanUps(props) {
    return (
        <View style={styles.container}>
            {
                props.taskList.map(
                    (task, index) => <CleanUp key={index} date={task.date} litter={task.litter} location={task.location} username={task.username}/>
                )
            }
            {
                props.taskList.length > 0
                    ?
                    <RegularButton text='Clear List' onPress={() => props.clearListCallback()} />
                    :
                    <Text style={styles.inputLabel}>Add a task to get started!</Text>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 0,
        padding: 0,
    },
    inputLabel: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
});
