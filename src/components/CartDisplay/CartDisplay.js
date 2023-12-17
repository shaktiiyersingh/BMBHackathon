import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Alert, ActivityIndicator, Dimensions } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCart } from '../../context/CartContext';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../../configure/config';



const CartScreen = () => {
  const { cartItems, clearCart, setCartItems, getCurrentUserId } = useCart();
  
  const [cancelItemLoading, setCancelItemLoading] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState('No Selected Address');

  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const getAddress = async () => {
    const userDocRef = firebase.firestore().collection('users').doc(getCurrentUserId());
    const userDoc = await userDocRef.get();
    const getChoosenAddressId = await AsyncStorage.getItem("ADDRESS");

    if(userDoc.data().address)
    {
      let tempDart = [];
      tempDart = userDoc.data().address;
      tempDart.map(item => {
        if(item.addressId == getChoosenAddressId)
          setSelectedAddress(
            item.street + ", " +
            item.city + ", " +
            item.pincode + ", " +
            item.mobile  
          );
      })
    }
  }

  useEffect(() => {
    getAddress();
  }, [isFocused])

  useEffect(() => {
    setLoading(false);
  }, []);

  // calculate the total cost for each item in cart
  const calculateTotalPriceForItem = (item) => {
    return item.price * item.quantity;
  };

  // calculate the total cost of cart items
  const calculateOverallTotal = () => {
    return cartItems.reduce((total, item) => total + calculateTotalPriceForItem(item), 0);
  };

  // cancel one item in the cart
  const handleCancelItem = async (itemId) => {
    try {
      setCancelItemLoading((prevLoading) => ({
        ...prevLoading,
        [itemId]: true,
      }));

      const updatedCartItems = cartItems.filter((item) => item.id !== itemId);

      const userId = getCurrentUserId();
      const cartDocRef = await firebase.firestore().collection('carts').where('userId', '==', userId).get();

      if (!cartDocRef.empty) {
        const cartDoc = cartDocRef.docs[0];
        await cartDoc.ref.update({ items: updatedCartItems });
        setCartItems(updatedCartItems);
      }
    } catch (error) {
      console.error('Error canceling item:', error);
    } finally {
      setCancelItemLoading((prevLoading) => ({
        ...prevLoading,
        [itemId]: false,
      }));
    }
  };
  
  // cancel all the items in the cart
  const handleCancelAll = async () => {
    try {
      clearCart();
  
      const userId = getCurrentUserId();
      const cartDocRef = await firebase.firestore().collection('carts').where('userId', '==', userId).get();
  
      if (!cartDocRef.empty) {
        const cartDoc = cartDocRef.docs[0];
        await cartDoc.ref.update({ items: [] });
      }
    } catch (error) {
      console.error('Error canceling all items:', error);
    }
  };  

  // check out 
  const handleCheckout = () => {
    if (calculateOverallTotal() > 0) 
      navigation.navigate('Payment', { selectedAddress });
    else
      Alert.alert('Your cart is empty. Add items before checking out.');
  };

  return (
    <ScrollView>
      {loading ? (
        <View style={[styles.container, styles.loaderContainer]}>
          <ActivityIndicator size="large" color="#3498db" />
        </View>
      ) : (
        <View style={styles.container}>
          <Text style={styles.title}>Cart Screen</Text>
          
          {cartItems.map((item) => (
            <View style={styles.itemContainer} key={item.id}>
              <Text style={styles.itemName}>Name: {item.name}</Text>
              <Text style={styles.itemPrice}>Price: ${item.price?.toFixed(2)}</Text>
              <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
              <Text style={styles.totalPrice}>Total Price: ${calculateTotalPriceForItem(item)?.toFixed(2)}</Text>
              <Button 
                title="Cancel" 
                onPress={() => handleCancelItem(item.id)} 
                color="#e74c3c" 
                style={styles.cancelBtn}
              />
              {cancelItemLoading[item.id] && (
                <ActivityIndicator size="small" color="#3498db" />
              )}
            </View>
          ))}
          
          <Text style={styles.overallTotal}>Overall Total: ${calculateOverallTotal().toFixed(2)}</Text>
          
          <View style={styles.address}>
            <Text>Selected Address</Text>
            <Text 
              style={{
                color: 'blue', 
                textDecorationLine: 'underline'
              }}
              onPress={() => navigation.navigate('Address')}
            >
              Change Address
            </Text>
          </View>
          <Text
            style={{
              width: '100%',
              marginTop: 30,
              marginBottom: 100,
              fontSize: 13,
              fontWeight: 'bold',
              color: 'grey',
            }}
          >
            {selectedAddress}
          </Text>

          <View style={styles.buttonContainer}>
            <Button 
              title="Clear all" 
              onPress={handleCancelAll} 
              color="#c0392b" 
              disabled={calculateOverallTotal() === 0}
            />

            <View style={{ marginTop: 16 }} />

            <Button 
              title="Checkout" 
              onPress={handleCheckout} 
              style={styles.checkoutButton} 
              disabled={calculateOverallTotal() === 0 || selectedAddress === 'No Selected Address'}
            />
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ecf0f1',
  },
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#3498db',
  },
  itemContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    elevation: 3,
    alignItems: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 14,
    marginBottom: 4,
    color: '#2ecc71',
  },
  itemQuantity: {
    fontSize: 14,
    marginBottom: 4,
    color: '#3498db',
  },
  totalPrice: {
    fontSize: 14,
    marginBottom: 4,
    color: '#65B741',
    fontWeight: 'bold',
  },
  overallTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    color: 'green',
  },
  cancelBtn: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#e74c3c',
    borderRadius: 5,
    alignSelf: 'center',
  },
  address: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginTop: 20
  },
  checkoutButton: {
    marginTop: 16,
    backgroundColor: '#3498db',
  },
});

export default CartScreen;