import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, View, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { firebase } from '../../configure/config';

const Dashboard = () => {
  const [name, setName] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  // fetch the data from firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userSnapshot = await firebase.firestore().collection('users')
          .doc(firebase.auth().currentUser.uid)
          .get();
  
        if (userSnapshot.exists)
          setName(userSnapshot.data());
        else
          console.log('User does not exist');
  
        const categorySnapshot = await firebase.firestore().collection('Categories').get();
        const categoryData = [];
  
        for (const doc of categorySnapshot.docs) 
        {
          const category = { id: doc.id, ...doc.data() };
          const imagePath = `images/${category.categoryImage}`; 
  
          try {
            const imageRef = firebase.storage().ref(imagePath);
            const imageUrl = await imageRef.getDownloadURL();
  
            category.imageUrl = imageUrl;
            categoryData.push(category);
          } 
          catch (error) {
            console.error('Error getting image URL for category:', category.categoryName, error);
          }
        }
  
        setData(categoryData);
        setLoading(false); 
      } catch (error) {
        console.error('Error fetching data: ', error);
        setLoading(false); 
      }
    };
  
    fetchData();
  }, []);
  

  const navigateToProductScreen = (category) => {
    navigation.navigate('ProductDisplay', { category });
  };

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', letterSpacing: 1.5, marginBottom: 20 }}>
          Hello, {name.firstName}
        </Text>

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#3498db" />
            <Text style={{ marginTop: 10 }}>Fetching Categories...</Text>
          </View>
        ) : (
          data.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.categoryContainer}
              onPress={() => navigateToProductScreen(item.id)}
            >
              <Image source={{ uri: item.imageUrl }} style={styles.categoryImage} />
              <Text style={styles.categoryText}> {item.categoryName} </Text>
            </TouchableOpacity>
          ))
        )}
      </SafeAreaView>
    </ScrollView>
  );
};

export default Dashboard


const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: '#f0f0f0',
  },

  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
  },

  greetingText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },

  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  categoryContainer: {
    width: '48%',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
  },

  categoryImage: {
    height: 120,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    resizeMode: 'cover',
  },

  categoryText: {
    padding: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});