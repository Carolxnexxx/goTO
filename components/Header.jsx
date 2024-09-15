import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';

export default function Header(props) {
  const navigation = useNavigation();
  const [sound, setSound] = useState();

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync( require('../assets/sounds/button_click.mp3')
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

  const handleButtonPress = () => {
    playSound();
    navigation.navigate('Home')
  }

  return (
    <View style={styles.container}>
      <Image style={styles.topImage} source={require('../assets/images/GOTO.png')} />
      <View style={styles.header}>
      <TouchableOpacity onPress={() => handleButtonPress()}>
          <Image style={styles.icon} source={require('../assets/images/icon.png')} />
        </TouchableOpacity>
        <View style={styles.textContainer}>
        <Text style={styles.titleText}>{props.text}</Text>
        <Text style={styles.titleText}>{props.text2}</Text>
        <Text style={styles.titleText}>{props.text3}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 0,
  },
  textContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: "white",
  },
  topImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: "100%",
    height: 390,
  },
  icon: {
    top: 30,
    left: -170,
    marginBottom: 10,
    height: 60,
    width: 60,
  }
});