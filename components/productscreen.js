import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';

import db from './firebase'; // Import your Firebase configuration
import { TouchableOpacity } from 'react-native-gesture-handler';
import styles from './styles';

function ProductScreen({ route }) {
  const { category } = route.params; // Access the category parameter
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Firestore query to get products in the selected category
    db.collection('Products') // Replace with the name of your products collection
      .where('category', '==', db.doc(`Categories/${category}`)) // Filter products by the category reference
      .get()
      .then((querySnapshot) => {
        const productsData = [];
        querySnapshot.forEach((doc) => {
          productsData.push({ id: doc.id, ...doc.data() });
        });
        setProducts(productsData);
      })
      .catch((error) => {
        console.error('Error fetching products: ', error);
      });
  }, [category]); // Re-run the query when the category parameter changes

  return (
    <View style={styles.container}>
      <Text>Product Screen</Text>
      <Text>Category: {category}</Text>

      {/* Display the products in a FlatList or other component */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
      
            <View style={styles.productDetails}>
            <Text style={styles.productName}>Name: {item.productName}</Text>
            <Text style={styles.productPrice}>Price: {item.price}</Text>
          </View>
    
        )}
      />
    </View>
  );
}

export default ProductScreen;
