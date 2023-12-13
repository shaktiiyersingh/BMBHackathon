import React, { useState } from 'react';
import { Text, View, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { firebase } from '../../configure/config';

const Registration = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const navigation = useNavigation();

  // save a new user in firebase using email authentication
  const registerUser = async (email, password, firstName, lastName) => {
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
      const user = firebase.auth().currentUser;
  
      await user.sendEmailVerification({
        handleCodeInApp: true,
        url: 'https://test-b2b2e.firebaseapp.com',
      });
  
      alert('Verification email sent');
  
      const verificationTimer = setTimeout(async () => {
        if (!user.emailVerified) {
          alert('Email verification expired. Please register again.');
          await user.delete();

          navigation.navigate('Login');
        }
      }, 5 * 60 * 1000); 
  
      await user.reload(); 
      while (!user.emailVerified) {
        await user.reload(); 
      }
  
      clearTimeout(verificationTimer);
  
      await firebase.firestore().collection('users').doc(user.uid).set({
        firstName,
        lastName,
        email,
      });
  
      navigation.navigate('Login');
    } catch (error) {
      alert(error.message);
    }
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <View style={styles.circleBackground}>
          <Icon name="user-plus" size={50} color="#fff" />
        </View>
      </View>

      <View style={{ marginTop: 10 }}>
        <Text style={{ fontSize: 11, color: 'grey', letterSpacing: 1.5 }}> FIRST NAME </Text>
        <TextInput
          style={styles.textInput}
          placeholder="First Name"
          onChangeText={(firstName) => setFirstName(firstName)}
          autoCorrect={false}
        />

        <Text style={{ fontSize: 11, color: 'grey', letterSpacing: 1.5 }}> LAST NAME </Text>
        <TextInput
          style={styles.textInput}
          placeholder="Last Name"
          onChangeText={(lastName) => setLastName(lastName)}
          autoCorrect={false}
        />

        <Text style={{ fontSize: 11, color: 'grey', letterSpacing: 1.5 }}> EMAIL ADDRESS </Text>
        <TextInput
          style={styles.textInput}
          placeholder="Email"
          onChangeText={(email) => setEmail(email)}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
        />

        <Text style={{ fontSize: 11, color: 'grey', letterSpacing: 1.5 }}> PASSWORD </Text>
        <TextInput
          style={styles.textInput}
          placeholder="Password"
          onChangeText={(password) => setPassword(password)}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={true}
        />
      </View>

      <TouchableOpacity onPress={() => registerUser(email, password, firstName, lastName)} style={styles.button}>
        <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#fff' }}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Registration;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  iconContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  circleBackground: {
    backgroundColor: '#3498db',
    borderRadius: 50,
    padding: 15,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 28,
    marginTop: 30,
    marginBottom: 20,
    textAlign: 'center',
  },
  formContainer: {
    marginTop: 10,
  },
  label: {
    fontSize: 14,
    color: '#333',
    letterSpacing: 1.2,
    marginBottom: 5,
  },
  textInput: {
    height: 40,
    borderColor: '#ccc',
    borderBottomWidth: 1,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff',
  },
});
