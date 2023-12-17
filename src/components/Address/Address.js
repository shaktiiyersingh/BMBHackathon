import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

import { firebase } from '../../configure/config';
import { useCart } from '../../context/CartContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Address() {

  const [getAddressList, setGetAddressList] = useState([]);

  const navigation = useNavigation();
  const { getCurrentUserId } = useCart();
  const isFocused = useIsFocused();

  const getAddress = async () => {
    const userDocRef = firebase.firestore().collection('users').doc(getCurrentUserId());
    const userDoc = await userDocRef.get();
    const getChoosenAddressId = await AsyncStorage.getItem("ADDRESS");

    const tempDart = userDoc.data()?.address || [];

    tempDart.map(item => {
      if(item.addressId == getChoosenAddressId)
        item.selected = true;
      else
        item.selected = false;
    })

    setGetAddressList(tempDart);
  }

  useEffect(() => {
    getAddress();
  }, [isFocused])


  const saveDefaultAddress = async (item) => {
    await AsyncStorage.setItem("ADDRESS", item.addressId);
    let tempDart = getAddressList;

    tempDart.map(itm => {
      if(itm.addressId == item.addressId)
        itm.selected = true;
      else
        itm.selected = false;
    })

    let temp = [];
    tempDart.map((item) => {
      temp.push(item);
    })

    setGetAddressList(temp);
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={getAddressList}
        renderItem={({ item, index }) => (
          <View style={[
            styles.addressItem,
            { marginBottom: index === getAddressList.length - 1 ? 100 : 10 }
          ]}>
            <View style={styles.addressDetails}>
              <Text style={styles.addressText}>{"Street: " + item.street}</Text>
              <Text style={styles.addressText}>{"City: " + item.city}</Text>
              <Text style={styles.addressText}>{"Pincode: " + item.pincode}</Text>
              <Text style={styles.addressText}>{"Phone No: " + item.mobile}</Text>
            </View>
            {
              item.selected == true 
              ?
              <Text>Default</Text> 
              :
              (
                <View>
                 <TouchableOpacity 
                    style={styles.defaultButton}
                    onPress={() => saveDefaultAddress(item)}
                  >
                    <Text style={styles.buttonText}>Set Default</Text>
                  </TouchableOpacity>
                </View>
              )
            }
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddAddress')}
      >
        <Text style={styles.btnText}>Add New Address</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addButton: {
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
  btnText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
  },
  addressItem: {
    width: '90%',
    backgroundColor: '#fff',
    elevation: 4,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  addressDetails: {
    flex: 1,
  },
  addressText: {
    marginBottom: 5,
  },
  defaultButton: {
    backgroundColor: 'green',
    borderRadius: 5,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold'
  },
});
