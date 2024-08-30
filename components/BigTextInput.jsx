import React, { useEffect, useState, useContext } from 'react';
import { StatusBar, StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { getData, removeData, storeData } from '../storage.js';
import { Audio } from 'expo-av';
import { LitterContext } from './LitterContext.jsx';
import { UserContext, UserProvider } from './UserContext.jsx';
import CleanUps from './CleanUps.jsx';
import Header from './Header.jsx';
import RegularTitle from './RegularTitle.jsx';

export default function BigTextInput({ navigation }) {
    const [Litter, setLitter] = useState('');
    const [Location, setLocation] = useState('');
    const [Date, setDate] = useState('');
    const [tasks, setTasks] = useState([]);

    const [sound, setSound] = useState();

    const { setTotalLitter } = useContext(LitterContext);
    const { sendUsername } = useContext(UserContext);

    async function playSound() {
        const { sound } = await Audio.Sound.createAsync(require('../assets/sounds/button_click.mp3')
        );
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

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                let storedData = await getData("tasks");
                if (storedData) {
                    setTasks(storedData);
                }
            } catch (e) {
                Alert.alert(e.message);
            }
        }

        fetchTasks();
    }, [])

    const handleButtonPress = async () => {
        const newTask = {
            litter: Number(Litter),
            location: Location,
            date: Date,
            username: sendUsername,
        }
        const updatedTasks = [...tasks, newTask];

        try {
            await storeData("tasks", updatedTasks);
            setTasks(updatedTasks);
            const totalLitter = updatedTasks.reduce((sum, task) => sum + task.litter, 0);
            setTotalLitter(totalLitter);
        } catch (e) {
            Alert.alert(e.message);
        }
        setLitter('');
        setLocation('');
        setDate('');
        playSound();
    }

    const clearList = async () => {
        try {
            await removeData("tasks");
            setTasks([]);
        } catch (e) {
            Alert.alert(e.message);
        }
    }

    return (
        <UserProvider>
            <View style={styles.container}>
                <Header text="Clean" navigation={navigation} />
                <RegularTitle text={sendUsername !== "Sign in to input a clean up!" ? "Welcome " + sendUsername + "! Input a Clean Up!" : sendUsername} />
                <ScrollView style={styles.scrollView}>
                {sendUsername !== "Sign in to input a clean up!" && <View style={styles.loginContainer}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Pieces of Litter Picked Up:</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={(text) => setLitter(text)}
                                value={Litter}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Location:</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={(text) => setLocation(text)}
                                value={Location}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Date:</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={(text) => setDate(text)}
                                value={Date}
                            />
                        </View>
                        <TouchableOpacity style={styles.button} onPress={() => handleButtonPress()}>
                            <View style={styles.textContainer}>
                                <Text style={styles.title}>Track</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={styles.previousContainer}>
                            <View style={styles.litterContainer}>
                                <Text style={styles.litterTitle}>Previous Clean Ups</Text>
                            </View>
                        </View>
                        <CleanUps taskList={tasks} clearListCallback={clearList} /> 
                    </View>}
                    <Text style={styles.longtext}>
                        Lorem ipsum dolor sit amet askldjfklsj klasjdf kldjsakf kalsdjfklsaj fklsa
                        sdjfklaj asldkfjkldsa asjdkfljhkj jh jkhjkh jk jhjk hjkh aksdjfkslad kalsdjf kals
                        kasjf kalsdjf klfdjsa kasdljf lkfjdaskljsdklfjdlaskjfd saklsdjfklajsdlkfjads
                        asldjflsda
                        asdklfjklsajd fklasdkfjlkasjdkfljsdklajfkldsa jaksldfj klasjdf as
                    </Text>
                </ScrollView>
                <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.scrollView}>
                </ScrollView>
            </View>
        </UserProvider>
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
        zIndex: 5
      },
    previousContainer: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        alignItems: 'center',
        justifyContent: 'center',
        width: "100%"
    },
    longtext: {
        fontSize: 42,
        color: "#f2f2f2",
        marginVertical: 30,
    },
    scrollView: {
        marginHorizontal: 20,
    },
    scrollContainer: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
    },
    loginContainer: {
        width: '90%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
        left: 20,
    },
    loginTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#e6f9e6',
        borderRadius: 10,
        borderColor: '#dcdcdc',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        width: "100%",
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
    litterContainer: {
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
        width: 332,
        marginVertical: 10,
    },
    litterTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    scrollView: {
        backgroundColor: 'f2f2f2',
    },
});
