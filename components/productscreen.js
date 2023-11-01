import React, { useEffect, useState } from 'react';
import { View, Image, Text, Button, FlatList } from 'react-native';

import db from './firebase'; // Import your Firebase configuration
import { TouchableOpacity } from 'react-native-gesture-handler';
import styles from './styles';
import beamImage from '../assets/beam.png';

function ProductScreen({ route }) {
  const { category } = route.params; // Access the category parameter
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState([]);
  
  const incrementQuantity = (index) => {
    console.log("Increment button pressed for product at index:", index);
  
    const numericIndex = parseInt(index, 10);
     // Ensure index is treated as a number
     if (!isNaN(numericIndex)){
        const newQuantities = [...quantities];
        newQuantities[numericIndex] += 1;
        setQuantities(newQuantities);
      };
}
  
  const decrementQuantity = (index) => {
    console.log("Decrement button pressed for product at index:", index);
    const numericIndex = parseInt(index, 10); // Ensure index is treated as a number
    if (!isNaN(numericIndex)) {
      if (quantities[numericIndex] > 0) {
        const newQuantities = [...quantities];
        newQuantities[numericIndex] -= 1;
        setQuantities(newQuantities);
      }
    }
  };
  

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
        const initialQuantities = productsData.map(() => 0);
        setQuantities(initialQuantities);
      })
      .catch((error) => {
        console.error('Error fetching products: ', error);
      });
  }, [category]); // Re-run the query when the category parameter changes

  return (
    <View style={styles.container}>
     
      {products.map((item, index) => (
      <View style={styles.productDetails} key={item.id}>
        <Image
              source={beamImage} 
              style={styles.productImage}
        />
        <Text style={styles.productName}>Name: {item.productName}</Text>
        <Text style={styles.productPrice}>Price: {item.price}</Text>
        <View style={styles.quantityControl}>
            <Button
              title="+"
              onPress={() => incrementQuantity(index)}
              style={styles.quantityButton}
            />
            <Text style={styles.quantityText}>{quantities[index]}</Text>
            <Button
              title="-"
              onPress={() => decrementQuantity(index)}
              style={styles.quantityButton}
            />
          </View>
    </View>
    
      ))}
        
      {/* Display the products in a FlatList or other component */}

    </View>
  );
}

export default ProductScreen;
