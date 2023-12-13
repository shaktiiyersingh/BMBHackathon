import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';

import { firebase } from '../../configure/config';
import { useCart } from '../../context/CartContext';

function ProductScreen({ route }) {
  const { category } = route.params;
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState([]);
  const [loading, setLoading] = useState(true); 

  const { addToCart, cartItems } = useCart();

  useEffect(() => {
    fetchProducts();
  }, [category]);

  // fetching product details and set the user's cart item quantities
  const fetchProducts = () => {
    setLoading(true);
  
    firebase
      .firestore()
      .collection('Products')
      .where('category', '==', firebase.firestore().doc(`Categories/${category}`).id)
      .get()
      .then(async (querySnapshot) => {
        const productsData = [];
        const storage = firebase.storage();
  
        for (const doc of querySnapshot.docs) 
        {
          const product = { id: doc.id, ...doc.data() };
          const imagePath = `images/${product.productImage}`; 
  
          try {
            const imageRef = storage.ref(imagePath);
            const imageUrl = await imageRef.getDownloadURL();
  
            product.productImageURL = imageUrl;
            productsData.push(product);
          } 
          catch (error) {
            console.error('Error getting image URL for product:', product.productName, error);
          }
        }
  
        setProducts(productsData);
  
        const existingCartItems = cartItems.filter(cartItem =>
          productsData.some(product => product.id === cartItem.id)
        );
  
        const initialQuantities = productsData.map(product =>
          existingCartItems.find(cartItem => cartItem.id === product.id)?.quantity || 0
        );
  
        setQuantities(initialQuantities);
        setLoading(false); 
      })
      .catch((error) => {
        console.error('Error fetching products: ', error);
        setLoading(false); 
      });
  };  

  // adding items to cart
  const addToCartHandler = (product, quantity) => {
    addToCart({ id: product.id, name: product.productName, price: product.price, quantity });
  };

  // inrease the items count
  const incrementQuantity = (index) => {
    console.log("Increment button pressed for product at index:", index);
    const numericIndex = parseInt(index, 10);
    if (!isNaN(numericIndex)) {
      const newQuantities = [...quantities];
      newQuantities[numericIndex] += 1;
      setQuantities(newQuantities);

      addToCartHandler(products[numericIndex], newQuantities[numericIndex]);
    }
  };

  // decrease the item count
  const decrementQuantity = (index) => {
    console.log("Decrement button pressed for product at index:", index);
    const numericIndex = parseInt(index, 10);
    if (!isNaN(numericIndex))
    {
      if(quantities[numericIndex] > 0) {
        const newQuantities = [...quantities];
        newQuantities[numericIndex] -= 1;
        setQuantities(newQuantities);

        addToCartHandler(products[numericIndex], newQuantities[numericIndex]);
      }
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
      
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#3498db" />
            <Text style={styles.loaderText}>Fetching Products...</Text>
          </View>
        ) : (
          products.map((item, index) => {
            const cartItem = cartItems.find((cartItem) => cartItem.id === item.id) || { quantity: 0 };

            return (
              <View style={styles.productDetails} key={item.id}>
                <Image source={{ uri: item.productImageURL }} style={styles.productImage} />
                <Text style={styles.productName}>Name: {item.productName}</Text>
                <Text style={styles.productPrice}>Price: ${item.price.toFixed(2)}</Text>

                <View style={styles.quantityControl}>
                  <TouchableOpacity onPress={() => decrementQuantity(index)} style={styles.quantityButton}>
                    <Text style={styles.quantityButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{cartItem.quantity}</Text>
                  <TouchableOpacity onPress={() => incrementQuantity(index)} style={styles.quantityButton}>
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>

              </View>
            );
          })
        )}
      </View>
    </ScrollView>

  );
}

export default ProductScreen;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  container: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',     
    padding: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  productDetails: {
    width: '45%',  
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    alignItems: 'center',  
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: 'contain', 
  },  
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  productPrice: {
    fontSize: 16,
    color: '#3498db',
    marginBottom: 10,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 6,
    marginHorizontal: 5,
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  quantityText: {
    fontSize: 18,
    marginHorizontal: 10,
    color: '#333',
  },
});

