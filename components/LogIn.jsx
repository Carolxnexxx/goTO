import React, { useState } from 'react';
import { StyleSheet, View, TextInput, ActivityIndicator, KeyboardAvoidingView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import Header from './Header.jsx';
import RegularButton from './RegularButton.jsx';

export default function LogIn({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const signIn = async () => {
        setLoading(true);
        try {
            // Ensure email and password are strings before comparing
            const storedEmail = await AsyncStorage.getItem('email');
            const storedPassword = await AsyncStorage.getItem('password');
    
            if (storedEmail === String(email) && storedPassword === String(password)) {
                Alert.alert('Login Successful', 'Welcome back!');
                // Navigate to the HomeScreen after successful login
                navigation.navigate('HomeScreen');
            } else {
                Alert.alert('Login Failed', 'Invalid email or password');
            }
        } catch (error) {
            console.log(error);
            alert('Sign in failed');
        } finally {
            setLoading(false);
        }
    };
    

    const signUp = async () => {
        setLoading(true);
        try {
            // Store email and password in AsyncStorage as strings
            await AsyncStorage.setItem('email', String(email));
            await AsyncStorage.setItem('password', String(password));
            Alert.alert('Sign Up Successful', 'Please log in with your new account');
        } catch (error) {
            console.log(error);
            alert('Sign up failed');
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <View style={styles.container}>
            <Header text="Sign in or Sign up" />
            <KeyboardAvoidingView behavior="padding">
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={email}
                        placeholder="Email"
                        onChangeText={(text) => setEmail(text)}
                    />
                    <TextInput
                        style={styles.input}
                        value={password}
                        placeholder="Password"
                        secureTextEntry={true}
                        onChangeText={(text) => setPassword(text)}
                    />

                    {loading ? (
                        <ActivityIndicator color="#0000ff"/>
                    ) : (
                        <>
                            <RegularButton text="Login" onPress={signIn} />
                            <RegularButton text="Create Account" onPress={signUp} />
                        </>
                    )}
                </View>
            </KeyboardAvoidingView>
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
    inputContainer: {
        width: 400,
        alignItems: 'center',
    },
    input: {
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
        marginVertical: 10,
        width: '90%',
    },
});
