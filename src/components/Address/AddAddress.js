import React, { useState } from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native';

import { firebase } from '../../configure/config';
import { useCart } from '../../context/CartContext';

export default function AddAddress() {

  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [mobile, setMobile] = useState('');
  const { getCurrentUserId } = useCart();

  const navigation = useNavigation();


  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };
  

  const saveAddress = async () => {

    const addressId = generateUUID();
    const userId = getCurrentUserId();
    const userDocRef = firebase.firestore().collection('users').doc(userId);
  
    try {
      const userDoc = await userDocRef.get();
  
      if (userDoc.exists) 
      {
        if (userDoc.data().address) 
        {
          const updatedAddressArray = [
            ...userDoc.data().address,
            { addressId, street, city, pincode, mobile }
          ];
  
          await userDocRef.update({ address: updatedAddressArray });
        } 
        else 
        {
          await userDocRef.update({ address: [{ addressId, street, city, pincode, mobile }] });
        }
      } 
      console.log('Address saved successfully!');
      navigation.goBack();
      
    } 
    catch (error) {
      console.error('Error saving address:', error);
    }
  };
  

  return (
    <View style={styles.container}>
        <Text style={{ fontSize: 11, color: 'grey', letterSpacing: 1.5 }}> STREET </Text>
        <TextInput
          style={styles.textInput}
          placeholder="STREET"
          onChangeText={(street) => setStreet(street)}
          autoCorrect={false}
        />

        <Text style={{ fontSize: 11, color: 'grey', letterSpacing: 1.5 }}> CITY </Text>
        <TextInput
          style={styles.textInput}
          placeholder="CITY"
          onChangeText={(city) => setCity(city)}
          autoCorrect={false}
        />
        <Text style={{ fontSize: 11, color: 'grey', letterSpacing: 1.5 }}> PINCODE </Text>
        <TextInput
          style={styles.textInput}
          placeholder="PINCODE"
          keyboardType='number-pad'
          onChangeText={(pincode) => setPincode(pincode)}
          autoCorrect={false}
        />

        <Text style={{ fontSize: 11, color: 'grey', letterSpacing: 1.5 }}> PHONE NUMBER </Text>
        <TextInput
          style={styles.textInput}
          placeholder="PHONE NUMBER"
          maxLength={10}
          keyboardType='number-pad'
          onChangeText={(mobile) => setMobile(mobile)}
          autoCorrect={false}
        />
        <TouchableOpacity
            style={styles.AddButton}
            onPress={saveAddress}
        >
            <Text style={styles.BtnText}>Save Address</Text>
        </TouchableOpacity>

    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 20,
    },
    iconContainer: {
      alignItems: 'center',
      marginTop: 30,
      marginBottom: 20,
    },
    circleBackground: {
      backgroundColor: '#3498db',
      borderRadius: 50,
      padding: 15,
    },
    title: {
      fontWeight: 'bold',
      fontSize: 28,
      marginTop: 30,
      marginBottom: 20,
      textAlign: 'center',
    },
    formContainer: {
      marginTop: 10,
    },
    label: {
      fontSize: 14,
      color: '#333',
      letterSpacing: 1.2,
      marginBottom: 5,
    },
    textInput: {
      height: 40,
      borderColor: '#ccc',
      borderBottomWidth: 1,
      marginBottom: 20,
      fontSize: 16,
    },
    button: {
      backgroundColor: '#3498db',
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 20,
    },
    buttonText: {
      fontWeight: 'bold',
      fontSize: 16,
      color: '#fff',
    },
    AddButton: {
        width: '50%',
        height: 50,
        backgroundColor: 'orange',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 10,
        alignSelf: 'center',
        borderRadius: 10,
    },
    BtnText: {
        color: 'black',
        fontSize: 16,
        fontWeight: '600',
    },
  });
  