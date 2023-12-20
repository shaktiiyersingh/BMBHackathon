import AsyncStorage from '@react-native-async-storage/async-storage';

export const updateStoredCredentials = async (email, password) => {
  try {
    if (email && password) 
    {
      await AsyncStorage.setItem('userEmail', email);
      await AsyncStorage.setItem('userPassword', password);
    } 
    else 
    {
      await AsyncStorage.removeItem('userEmail');
      await AsyncStorage.removeItem('userPassword');
    }
  } catch (error) {
    console.error('Error storing or removing credentials:', error);
  }
};
