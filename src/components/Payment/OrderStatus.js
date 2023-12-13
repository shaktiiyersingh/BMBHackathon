import React, { useEffect, useRef } from 'react';
import { Text, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import ConfettiCannon from 'react-native-confetti-cannon';

const OrderStatus = ({ route }) => {
  const { success } = route.params; 
  console.log(success);
  const navigation = useNavigation();

  // Animation configurations
  const scaleValue = new Animated.Value(0);
  const opacityValue = new Animated.Value(0);
  const springValue = new Animated.Value(0);

  const confettiRef = useRef(null);

  useEffect(() => {
    // Sequence of animations
    const sequence = [
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(opacityValue, {
        toValue: 1,
        duration: 100,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.spring(springValue, {
        toValue: 1,
        friction: 2,
        tension: 40,
        useNativeDriver: true,
      }),
    ];

    Animated.sequence(sequence).start(() => {
      if (success) {
        // Start confetti animation for 1.5 seconds after the other animations
        confettiRef.current.start();
        setTimeout(() => {
          confettiRef.current.stop();
        }, 3500);
      }
    });
  }, [scaleValue, opacityValue, springValue, success]);

  return (
    <Animated.View style={{ ...styles.container, transform: [{ scale: scaleValue }], opacity: opacityValue }}>
      {success ? (
        <>
          <ConfettiCannon
            count={200}
            origin={{ x: -10, y: 0 }}
            autoStart={false}
            ref={confettiRef}
          />
          <FontAwesome name="check-circle" size={150} color="green" style={styles.icon} />
          <Text style={styles.successText}>Payment Successful!</Text>
          <Animated.View
            style={{
              transform: [{ scale: springValue }],
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate('Dashboard')}
              style={styles.successButton}
            >
              <Text style={styles.buttonText}>Go to Dashboard</Text>
            </TouchableOpacity>
          </Animated.View>
        </>
      ) : (
        <>
          <FontAwesome name="times-circle" size={150} color="red" style={styles.icon} />
          <Text style={styles.failureText}>Payment Failed!</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Dashboard')}
            style={styles.failureButton}
          >
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginBottom: 16,
  },
  successText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'green',
  },
  failureText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'red',
  },
  successButton: {
    backgroundColor: 'blue',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  failureButton: {
    backgroundColor: 'red',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default OrderStatus;