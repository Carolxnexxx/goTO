import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { UserProvider } from './UserContext';

export default function CleanUp(props) {

  return (
    <UserProvider>
      <View style={styles.container}>
        <View style={styles.litterContainer}>
          <Text style={styles.litterTitle}>
            {props.username}
          </Text>
          <Text style={styles.litterCount}>{props.litter} pieces of litter cleaned at {props.location} on {props.date}</Text>
        </View>
      </View>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 0,
    padding: 0,
    width: "100%",
  },
  litterContainer: {
    width: '100%',
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
  },
  litterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  litterCount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 10,
    color: 'black',
  },
});
