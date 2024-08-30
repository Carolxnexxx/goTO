import React, { createContext, useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';

export const LitterContext = createContext();

export const LitterProvider = ({ children }) => {
  const [totalLitter, setTotalLitter] = useState(0);
  const [notifiedAnimals, setNotifiedAnimals] = useState(new Set());

  const animals = [
    { name: 'C-Teater', threshold: 100 },
    { name: 'Doile', threshold: 200 },
    { name: 'Ellaphant', threshold: 300 },
    { name: 'Shindo', threshold: 500 },
    { name: 'Ziley', threshold: 700 },
    { name: 'Finneril', threshold: 1000 },
    { name: 'C-Boynel', threshold: 1500 },
    { name: 'Craleb', threshold: 2000 },
    { name: 'Fellie', threshold: 2500 },
    { name: 'Shinx', threshold: 3000 },
    { name: 'Trig', threshold: 3500 },
    { name: 'Shelly', threshold: 4000 },
  ];

  useEffect(() => {
    animals.forEach((animal) => {
      if (totalLitter >= animal.threshold && !notifiedAnimals.has(animal.name)) {
        sendNotification(animal.name);
        setNotifiedAnimals((prev) => new Set(prev).add(animal.name));
      }
    });
  }, [totalLitter]);


  const sendNotification = async (animalName) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Congratulations!`,
        body: `You've unlocked ${animalName}!`,
      },
      trigger: null, 
    });
  };

  return (
    <LitterContext.Provider value={{ totalLitter, setTotalLitter }}>
      {children}
    </LitterContext.Provider>
  );
};