import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';

import { useCart } from '../../context/CartContext';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../../configure/config';


const CartScreen = () => {
  const { cartItems, clearCart, setCartItems, getCurrentUserId } = useCart();
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

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
  const handleCheckout = async () => {
    if (calculateOverallTotal() > 0) 
    {
      try {
        const userId = getCurrentUserId();
        const orderDocRef = await firebase.firestore().collection('orders').add({
          userId,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          items: cartItems,
          orderStatus: 'pending',
        });

        clearCart();
        
        Alert.alert('Order placed successfully!');
        navigation.navigate('Payment');
      } catch (error) {
        console.error('Error placing order:', error);
      }
    } 
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
            </View>
          ))}
          
          <Text style={styles.overallTotal}>Overall Total: ${calculateOverallTotal().toFixed(2)}</Text>
          
          <Button title="Clear all" onPress={handleCancelAll} color="#c0392b" />

          <View style={{ marginTop: 16 }} />

          <Button 
            title="Checkout" 
            onPress={handleCheckout} 
            style={styles.checkoutButton} 
            disabled={calculateOverallTotal() === 0}
          />
        </View>
      )}
    </ScrollView>
  );
};

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
  checkoutButton: {
    marginTop: 16,
    backgroundColor: '#3498db',
  },
});

export default CartScreen;