import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeData = async (key, value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
        throw new Error("Failed to save data.");
    }
};

export const getData = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue ? JSON.parse(jsonValue) : null;
    } catch (e) {
        throw new Error("Failed to retrieve data.")
    }
};

export const removeData = async (key) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
        throw new Error("Failed to delete data.")
    }
};