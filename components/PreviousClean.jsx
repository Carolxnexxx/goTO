import React from 'react';
import { StyleSheet, View } from 'react-native';
import Header from './Header.jsx';
import RegularButton from './RegularButton.jsx';
import { useNavigation } from '@react-navigation/native';

export default function PreviousClean() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Header text = "Previous Clean Ups"/>
      <RegularButton text="Add another Clean up" onPress={() => navigation.navigate('Clean')}/>
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
    zIndex: 5
},
});
