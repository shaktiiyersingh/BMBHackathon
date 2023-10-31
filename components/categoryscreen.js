
import React, { useEffect, useState } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';
import db from './firebase';
import beamImage from '../assets/beam.png';

function CategoriesScreen() {
  const [data, setData] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    db.collection('Categories')
      .get()
      .then((querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });
        setData(data);
      })
      .catch((error) => {
        console.error('Error fetching data: ', error);
      });
  }, []);

  // Function to navigate to the ProductScreen with the selected category
  const navigateToProductScreen = (category) => {
    navigation.navigate('Products', { category });
  };

  return (
    <View style={styles.container}>
      {data.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.categoryContainer}
          onPress={() => navigateToProductScreen(item.id)}
        >
          <Image
            source={beamImage} 
            style={styles.categoryImage}
          />
          <Text style={styles.categoryText}>{item.categoryName}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default CategoriesScreen;