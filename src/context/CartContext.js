import React, { createContext, useContext, useEffect, useState } from 'react';
import { firebase } from '../configure/config'; 

import { debounce } from 'lodash';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {

  const [cartItems, setCartItems] = useState([]);

  const getCurrentUserId = () => {
    const user = firebase.auth().currentUser;
    return user ? user.uid : 'defaultUserId';
  };

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const currentUserId = getCurrentUserId();
        const cartDocRef = await firebase.firestore().collection('carts').where('userId', '==', currentUserId).get();
    
        if (!cartDocRef.empty) 
        {
          const cartDocd = cartDocRef.docs[0];
          const cartData = cartDocd.data();
          const itemsArray = cartData.items;
    
          if (itemsArray)
            setCartItems(itemsArray);
          else
            setCartItems([]);
        } 
        else
          setCartItems([]);
        
      } 
      catch (error) {
        console.error('Error fetching cart data:', error);
      }
    };
    
    fetchCartData();

    const unsubscribeAuth = firebase.auth().onAuthStateChanged((user) => {
      if (user) 
        fetchCartData();
      else 
        setCartItems([]);
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  
  const updateFirestoreCart = async (items) => {
    try {
      const userId = getCurrentUserId();
      const cartCollection = firebase.firestore().collection('carts');
  
      await firebase.firestore().runTransaction(async (transaction) => 
      {
        const existingCartQuery = await cartCollection.where('userId', '==', userId).get();
  
        if (!existingCartQuery.empty) 
        {
          const existingCartDoc = existingCartQuery.docs[0];
          transaction.update(existingCartDoc.ref, { items: items });
        } 
        else 
        {
          const newCartRef = cartCollection.doc();
          transaction.set(newCartRef, {
            userId: userId,
            items: items
          });
        }
      });
    } catch (error) {
      console.error('Error updating Firestore cart:', error);
    }
  };
  

  const addToCart = (product) => {
    setCartItems((prevCartItems) => {
      
      const existingItemIndex = prevCartItems.findIndex((item) => item.id === product.id);
      if (existingItemIndex !== -1) 
      {
        const updatedCartItems = [...prevCartItems];

        if (product.quantity > 0) 
          updatedCartItems[existingItemIndex] = product;
        else 
          updatedCartItems.splice(existingItemIndex, 1);

        updateFirestoreCart(updatedCartItems);
        return updatedCartItems;
      } 
      else 
      {
        const newCartItems = [...prevCartItems, product];
        updateFirestoreCart(newCartItems);
        return newCartItems;
      }
    });
  };

  const debouncedAddToCart = debounce(addToCart, 250);

  const clearCart = () => {
    setCartItems([]);
    updateFirestoreCart([]);
  };


  return (
    <CartContext.Provider value={{ cartItems, addToCart: debouncedAddToCart, clearCart, setCartItems, getCurrentUserId }}>
      {children}
    </CartContext.Provider>
  );
};
