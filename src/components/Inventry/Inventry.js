import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

import { firebase } from '../../configure/config';
import { useCart } from '../../context/CartContext';

const Inventory = () => {
  const [orders, setOrders] = useState([]);
  const { getCurrentUserId } = useCart();

  // fetch data from the orders document
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userId = getCurrentUserId();
        const ordersCollection = await firebase.firestore().collection('orders')
          .where('userId', '==', userId)
          .get();

        const ordersData = ordersCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(ordersData);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [getCurrentUserId]);

  // time format
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    const formattedDate = `${date.getDate()} ${getMonthName(date.getMonth())} | ${formatAMPM(date)}`;
    return formattedDate;
  };
  
  // get month
  const getMonthName = (monthIndex) => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return months[monthIndex];
  };
  
  // am pm format
  const formatAMPM = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    minutes = minutes < 10 ? '0' + minutes : minutes;
    const strTime = hours + '.' + minutes + ' ' + ampm;
    return strTime;
  };

  // get color for status 
  const getStatusColor = (status) => {
    status = status.toLowerCase();
    switch (status) 
    {
      case 'pending':
        return 'yellow';
      case 'delivered':
        return 'green';
      case 'cancelled':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Orders</Text>
      {orders.length === 0 ? (
        <Text style={styles.noOrdersText}>No orders found.</Text>
      ) : (
        <ScrollView>
          {orders.map((order) => (
            <View key={order.id} style={styles.orderItem}>
              <View style={styles.orderHeader}>
                <Text style={styles.timestamp}>
                  {formatTimestamp(order.timestamp)}
                </Text>
                <View style={{ 
                    backgroundColor: getStatusColor(order.orderStatus), 
                    paddingHorizontal: 5,
                    paddingVertical: 8,  
                    borderWidth: 2,
                    borderColor: getStatusColor(order.orderStatus),
                    borderRadius: 5  
                    }}>
                    <Text style={styles.orderStatus}>{order.orderStatus}</Text>
                </View>
              </View>
              <Text style={styles.itemsTitle}>ITEMS:</Text>
              {order.items.map((item, index) => (
                <View key={index} style={styles.itemDetail}>
                  <Text style={styles.itemName}>Name: {item.name}</Text>
                  <Text style={styles.itemPrice}>Price: {item.price}</Text>
                  <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
                  <Text style={styles.itemQuantity}>Overall Price: {item.quantity * item.price}</Text>
                </View>
              ))}
              <Text style={styles.itemTotalPrice}>TotalPrice: {order.totalPrice}</Text>
              <Text style={{}}>Address: {order.address}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default Inventory;


const styles = StyleSheet.create({
    container: {
    flex: 1,
    padding: 20,
    },
    title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    },
    noOrdersText: {
    fontSize: 18,
    fontStyle: 'italic',
    },
    orderItem: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 10,
    },
    orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    },
    timestamp: {
    fontSize: 14,
    color: '#555',
    },
    orderStatus: {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
    textShadowColor: '#000', // Shadow color (black with 75% opacity)
    textShadowOffset: { width: 2, height: 2 }, // Shadow offset (horizontal and vertical)
    textShadowRadius: 4, // Shadow blur radius
    },
    itemsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    },
    itemDetail: {
    marginBottom: 5,
    },
    itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    },
    itemPrice: {
    fontSize: 14,
    color: '#555',
    },
    itemQuantity: {
    fontSize: 14,
    color: '#555',
    },
    itemTotalPrice: {
    fontSize: 14,
    color: 'green',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    fontWeight: 'bold',
    marginBottom: 15,
    },
  });
  