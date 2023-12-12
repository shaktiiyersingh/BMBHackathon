import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useCart } from '../../context/CartContext';

import RazorpayCheckout from 'react-native-razorpay';

const PaymentScreen = () => {
  const { cartItems } = useCart();

  const calculateTotalPriceForItem = (item) => {
    return item.price * item.quantity;
  };

  const calculateOverallTotal = () => {
    return cartItems.reduce((total, item) => total + calculateTotalPriceForItem(item), 0);
  };

  const payment = () => {

  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Section</Text>
      {cartItems.map((item) => (
        <View style={styles.itemContainer} key={item.id}>
          <Text style={styles.itemName}>Name: {item.name}</Text>
          <Text style={styles.itemPrice}>Price: ${item.price?.toFixed(2)}</Text>
          <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
          <Text style={styles.totalPrice}>Total Price: ${calculateTotalPriceForItem(item)?.toFixed(2)}</Text>
        </View>
        
      ))}
      <Text style={styles.overallTotal}>Overall Total: ${calculateOverallTotal().toFixed(2)}</Text>
      <TouchableOpacity
          onPress = {() => {payment()}}
          style = {styles.paymentButton}
        >
          <Text style = {{fontSize: 15, fontWeight: 'bold', color: 'white'}}>
              Pay Now {'$' + calculateOverallTotal().toFixed(2)}
          </Text>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  itemContainer: {
    marginBottom: 16,
  },
  itemName: {
    fontSize: 16,
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 14,
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 14,
    marginBottom: 4,
  },
  totalPrice: {
    fontSize: 14,
    marginBottom: 8,
    color: 'green',
  },
  overallTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    color: 'green',
    marginBottom: 5,
  },
  paymentButton: {
    marginTop: 16,
    backgroundColor: 'green',
    width: 200, 
    height: 40, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 8, 
  },
});

export default PaymentScreen;
