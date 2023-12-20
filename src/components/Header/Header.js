import React, { useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

import { updateStoredCredentials } from '../AutoLogin/authUtils';
import { firebase } from '../../configure/config';
import { useCart } from '../../context/CartContext';

const Header = (props) => 
{
  const navigation = useNavigation();
  const { cartItems } = useCart();

  const [showOptions, setShowOptions] = useState(false);

  // Sign out
  const handleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        updateStoredCredentials(); 
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  // Change password
  const changePassword = () => {
    firebase
      .auth()
      .sendPasswordResetEmail(firebase.auth().currentUser.email)
      .then(() => {
        alert('Password reset email sent');
      })
      .catch((error) => {
        alert(error);
      });
  };

  // only for login and registration component
  if (!props.showCartIcon) {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 15 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 28 }}>{props.name}</Text>
      </View>
    );
  }

  // other component
  return (
    <View style={styles.container}>
      
      <View>
        <Text style={styles.title}>{props.name}</Text>
      </View>
      
      <View style={styles.iconContainer}>
        <View  style={styles.iconWrapper}>
          <TouchableOpacity onPress={() => navigation.navigate('CartDisplay')}>
            {cartItems.length > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
              </View>
            )}
            <Ionicons name="cart" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <View style={styles.iconWrapper}>
          <TouchableOpacity onPress={() => navigation.navigate('Inventory')}>
            <FontAwesome name="shopping-bag" size={18} color="black" />
          </TouchableOpacity>
        </View>

        <View style={styles.iconWrapper}>
          <TouchableOpacity onPress={() => setShowOptions(!showOptions)}>
            <Ionicons name="settings-outline" size={24} />
          </TouchableOpacity>

          {showOptions && (
            <View style={styles.optionsContainer}>
              <TouchableOpacity onPress={() => changePassword()} style={styles.optionItem}>
                <Ionicons name="key-outline" size={24} color="black" style={styles.optionIcon} />
                <Text style={styles.optionText}>Change Password</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleSignOut()} style={styles.optionItem}>
                <Ionicons name="log-out-outline" size={24} color="black" style={styles.optionIcon} />
                <Text style={styles.optionText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 0.02 * width,
    paddingVertical: 10,
  },
  titleContainer: {
    flex: 1, 
    marginRight: 10, 
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18, 
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    marginHorizontal: 10, 
  },
  cartBadge: {
    position: 'absolute',
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    top: -12,
    right: -8,
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 14, // Adjust as needed
    fontWeight: 'bold',
  },
  optionsContainer: {
    width: '650%',
    position: 'absolute',
    top: 40,
    right: 10, // Adjust as needed
    backgroundColor: 'white',
    padding: 10,
    zIndex: 1,
    elevation: 2, // For shadow (Android)
  },
  optionItem: {
    marginBottom: 6, // Adjust as needed
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    marginRight: 10, // Adjust as needed
  },
  optionText: {
    fontSize: 12, // Adjust as needed
  },
});
export default Header;
