import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Title(props) {
  return (
    <View style={styles.container}>
      <View style={styles.litterContainer}>
        <Text style={styles.litterTitle}>{props.text}</Text>
        <Text style={styles.litterCount}>{props.subtext}</Text>
      </View>
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
    width: "100%",
    marginTop: 30,
  },
  litterContainer: {
    width: '90%',
    padding: 20,
    backgroundColor: '#e6f9e6',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
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
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 10,
  },
});
