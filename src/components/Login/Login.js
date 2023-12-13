import React, { useState }from 'react'
import { Text, View, Image, TouchableOpacity, TextInput, StyleSheet, Dimensions } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { firebase } from '../../configure/config'

const Login = () => {
    const navigation = useNavigation();

    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');

    // login in user using email
    const loginUser = async (email, password) => {
      try{
        await firebase.auth().signInWithEmailAndPassword(email, password)
        navigation.navigate('Dashboard');
      } 
      catch(error)
      {
        alert(error.message);
      }
    }
    
    // forgot password
    const forgetPassword = () => {
      firebase.auth().sendPasswordResetEmail(email)
      .then(() => {
        alert("Password reset email sent")
      }).catch((error) => {
        alert(error)
      })
    }

    // google login
    const googleLogin = async () => {
      try {
        const provider = new firebase.auth.GoogleAuthProvider();
        const result = await firebase.auth().signInWithPopup(provider);
    
        const user = result.user;
        const displayName = user.displayName;
        const email = user.email;

        const [firstName, lastName] = displayName.split(' ');

        await firebase.firestore().collection('users').doc(user.uid).set({
          firstName: firstName,
          lastName: lastName,
          email: email,
        });
        navigation.navigate('Dashboard');
      } catch (error) {
        alert(error.message);
      }
    };    

    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Build your</Text>
          <Text style={styles.title}>building</Text>
          <Text style={styles.subtitle}>Anything you need for your buildings</Text>
        </View>
  
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>EMAIL</Text>
          <TextInput
            style={styles.textInput}
            placeholder='Email'
            onChangeText={email => setEmail(email)}
            autoCorrect={false}
          />
  
          <Text style={styles.inputLabel}>PASSWORD</Text>
          <TextInput
            style={styles.textInput}
            placeholder='Password'
            onChangeText={password => setPassword(password)}
            autoCorrect={false}
            secureTextEntry={true}
          />
        </View>
  
        <TouchableOpacity onPress={() => loginUser(email, password)} style={styles.button}>
          <Text style={styles.buttonText}>Log in</Text>
        </TouchableOpacity>
  
        <TouchableOpacity onPress={() => forgetPassword()} style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
  
        <TouchableOpacity onPress={() => navigation.navigate('Registration')} style={styles.signUp}>
          <Text style={styles.signUpText}>SignUp!</Text>
        </TouchableOpacity>
  
        <TouchableOpacity onPress={() => googleLogin()}>
          <View style={styles.googleLog}>
            <Image style={styles.googleIcon} source={require('../../../assets/google_icon.png')} />
            <Text style={styles.googleText}>Sign in with Google</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  
  const { width, height } = Dimensions.get('window');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      marginTop: height * 0.22,
      paddingTop: height * 0.01,
      paddingBottom: height * 0.05,
      paddingHorizontal: width * 0.05,
      backgroundColor: '#fff',
      borderTopLeftRadius: 50,
      borderTopRightRadius: 50,
    },
    titleContainer: {
      marginBottom: height * 0.03,
      alignItems: 'center',
    },
    title: {
      fontWeight: 'bold',
      fontSize: height * 0.04,
      marginBottom: height * 0.005,
    },
    subtitle: {
      fontSize: height * 0.015,
      color: 'grey',
      textAlign: 'center',
    },
    inputContainer: {
      width: '100%',
      marginBottom: height * 0.03,
    },
    inputLabel: {
      fontSize: height * 0.012,
      color: 'grey',
      letterSpacing: 1.5,
      marginBottom: height * 0.01,
    },
    textInput: {
      paddingVertical: height * 0.015,
      width: '100%',
      fontSize: height * 0.018,
      borderRadius: height * 0.04,
      marginBottom: height * 0.02,
      textAlign: 'center',
      color: '#2c3e50',
      letterSpacing: 1,
      backgroundColor: 'lightgrey',
    },
    button: {
      height: height * 0.05,
      width: '35%',
      backgroundColor: '#000',
      color: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: height * 0.02,
      marginBottom: height * 0.03,
    },
    buttonText: {
      fontWeight: 'bold',
      fontSize: height * 0.022,
      color: '#fff',
    },
    forgotPassword: {
      marginBottom: height * 0.029,
    },
    forgotPasswordText: {
      fontWeight: 'bold',
      fontSize: height * 0.016,
      color: 'grey',
    },
    signUp: {
      marginBottom: height * 0.03,
    },
    signUpText: {
      fontWeight: 'bold',
      fontSize: height * 0.016,
      color: 'grey',
    },
    googleLog: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      padding: height * 0.01,
      paddingLeft: height * 0.015,
      paddingRight: height * 0.015,
      borderRadius: height * 0.04,
      marginBottom: height * 0.02,
    },
    googleIcon: {
      height: height * 0.025,
      width: height * 0.025,
      marginRight: height * 0.006,
    },
    googleText: {
      fontWeight: 'bold',
      fontSize: height * 0.016,
      color: '#000',
    },
  });
  
  export default Login;