import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { LitterProvider } from './components/LitterContext';
import { UserProvider } from './components/UserContext';
import HomeScreen from './components/HomeScreen';
import LogIn from './components/LogIn';
import BigTextInput from './components/BigTextInput';
import Rewards from './components/Rewards';
import MapScreen from './components/MapScreen';
import CalendarScreen from './components/Calendar';

const Tab = createBottomTabNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [channels, setChannels] = useState([]);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    // register for push notifications
    registerForPushNotificationsAsync().then(token => token && setExpoPushToken(token));
    if (Platform.OS === 'android') { // specific to Android -> get notification channels
      Notifications.getNotificationChannelsAsync().then(value => setChannels(value ?? []));
    }

    // listener for notifications received
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log(notification);
    });

    // listener for user interactions with notification
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    // clean up listeners when component unmounts
    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <UserProvider>
      <LitterProvider>
        <NavigationContainer>
          <Tab.Navigator>
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Log In">
              {props => <LogIn {...props} notificationCallback={schedulePushNotification} />}
            </Tab.Screen>
            <Tab.Screen name="Rewards">
              {props => <Rewards {...props} notificationCallback={schedulePushNotification} />}
            </Tab.Screen>
            <Tab.Screen name="Map" component={MapScreen} />
            <Tab.Screen name='Calendar' component={CalendarScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </LitterProvider>
    </UserProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Pick up some more litter!",
      body: 'Input some clean ups!',
      data: { data: 'goes here', test: { test1: 'more data' } },
    },
    trigger: null,
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  // configurations for channel on Android
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  // This checks whether the current device is a real device and doesn't set up permissions if not
  if (Device.isDevice) {
    // asks permissions to send notifications to the phone if not already granted
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
  } else {
    alert('Must use physical device for Push Notifications');
  }
  return token;
}