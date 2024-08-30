import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { getData, removeData, storeData } from '../storage';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from './UserContext';

export default function SmallTextInput() {
    const [Username, setUsername] = useState('');
    const [Password, setPassword] = useState('');
    const [logins, setLoginTasks] = useState([]);

    const [message, setMessage] = useState('');
    const [sound, setSound] = useState();

    const navigation = useNavigation();

    const { setUserContext } = useContext(UserContext);

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
                let storedData = await getData("logins");
                if (storedData) {
                    setLoginTasks(storedData);
                }
            } catch (e) {
                Alert.alert(e.message);
            }
        }

        fetchTasks();
    }, [])

    const handleButtonPressSignIn = async () => {
        const userExist = logins.find(login => login.username === Username);

        if (userExist) {
            if (userExist.password === Password) {
                navigation.navigate('Clean');
                const sendUsername = userExist.username;
                setUserContext(sendUsername);
            } else {
                setMessage("Password does not match");
                setUserContext("Sign in to input a clean up!");
            }
        } else {
            setMessage("Username does not exist.");
            setUserContext("Sign in to input a clean up!");
        }
        setUsername('');
        setPassword('');
        playSound();
    }

    const handleButtonPressSignUp = async () => {
        const newLogin = {
            username: Username,
            password: Password,
        }

        const userExist = logins.some(login => login.username === Username);

        if (userExist) {
            setMessage("Username already exists.") 
            setUserContext("Sign in to input a clean up!")
        } else {
            setMessage("Adding new user. Sign in again to confirm.")
            const updatedLogin = [...logins, newLogin];

            try {
                await storeData("logins", updatedLogin);
                setLoginTasks(updatedLogin);
            } catch (e) {
                Alert.alert(e.message);
            }
        }
        setUsername('');
        setPassword('');
        playSound();
    }

    const clearList = async () => {
        try {
            await removeData("logins");
            setLoginTasks([]);
        } catch (e) {
            Alert.alert(e.message);
        }
    }
    return (
        <View style={styles.container}>
            <View style={styles.loginContainer}>
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Username:</Text>
                    <TextInput style={styles.input}
                        onChangeText={(text) => setUsername(text)}
                        value={Username}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Password:</Text>
                    <TextInput style={styles.input} secureTextEntry={true}
                        onChangeText={(text) => setPassword(text)}
                        value={Password} />
                </View>
                <Text style={styles.inputLabel}>{message}</Text>
                <TouchableOpacity style={styles.button} onPress={() => handleButtonPressSignIn()}>
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>Sign In</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => handleButtonPressSignUp()}>
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>Sign Up</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => clearList()}>
                    <Text style={styles.inputLabel}>Clear</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginVertical: 10,
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
        marginVertical: 10,
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
    cleanSubtitle: {
        fontSize: 14,
        color: '#555',
    },
});