import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import Header from './Header.jsx';
import RegularButton from './RegularButton.jsx';
import { FIREBASE_AUTH } from '../FirebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

export default function LogIn({ notificationCallback }) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;

    const signIn = async () => {
        setLoading(true);
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            console.log(response);
        } catch (error) {
            console.log(error);
            alert('sign in failed')
        } finally {
            setLoading(false);
        }
    }

    const signUp = async () => {
        setLoading(true);
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            console.log(response);
            alert('check ur email')
        } catch (error) {
            console.log(error);
            alert("sign up failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <Header text="Sign in or Sign up" />
            <KeyboardAvoidingView behavior='padding'>
                <View style={styles.inputContainer}>
                <TextInput style={styles.input} value={email} placeholder="email" onChangeText={(text) => setEmail(text)} />
                <TextInput style={styles.input} value={password} placeholder="password" secureTextEntry={true} onChangeText={(text) => setPassword(text)} />

                {loading ? (
                    <ActivityIndicator size="large" color="#000ff" />
                ) : (
                    <>
                        <RegularButton text="Login" onPress={signIn} />
                        <RegularButton text="Create account" onPress={signUp} />
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
