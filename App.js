import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import React, {useState, useEffect} from "react";

import Header  from "./src/components/Header/Header";
import Registration from './src/components/Registration/Registration';
import Login from './src/components/Login/Login';
import Dashboard from './src/components/DashBoard/Dashboard';
import ProductDisplay from './src/components/ProductDisplay/ProductDisplay';
import CartDisplay from './src/components/CartDisplay/CartDisplay';
import Inventory from "./src/components/Inventry/Inventry";
import Payment from './src/components/Payment/Payment';
import OrderStatus from "./src/components/Payment/OrderStatus";

import {CartProvider} from './src/context/CartContext'

const Stack = createStackNavigator();

export default () => {
    return(
        <CartProvider>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Login">
                    <Stack.Screen 
                        name = "Login"
                        component = {Login}
                        options = {
                            {
                                headerTitle: () => <Header name = "Login" showCartIcon={false} />,
                                headerStyle: {
                                    height: 90,
                                    borderBottomLeftRadius: 20,
                                    borderBottomRightRadius: 20,
                                    backgroundColor: '#00e4d0',
                                    shadowColor: '#000',
                                    elevation: 25
                                }
                            }
                        }
                    />

                    <Stack.Screen 
                        name = "Registration"
                        component = {Registration}
                        options = {
                            {
                                headerTitle: () => <Header name = "Registration" showCartIcon={false} />,
                                headerStyle: {
                                    height: 90,
                                    borderBottomLeftRadius: 20,
                                    borderBottomRightRadius: 20,
                                    backgroundColor: '#00e4d0',
                                    shadowColor: '#000',
                                    elevation: 25
                                }
                            }
                        }
                    />

                    <Stack.Screen 
                        name = "Dashboard"
                        component = {Dashboard}
                        options = {
                            {
                                headerLeft: () => null,
                                headerTitle: () => <Header name = "Dashboard" showCartIcon={true}/>,
                                headerStyle: {
                                    height: 90,
                                    borderBottomLeftRadius: 20,
                                    borderBottomRightRadius: 20,
                                    backgroundColor: '#00e4d0',
                                    shadowColor: '#000',
                                    elevation: 25
                                }
                            }
                        }
                    />

                    <Stack.Screen 
                        name = "ProductDisplay"
                        component = {ProductDisplay}
                        options = {
                            {
                                headerTitle: () => <Header name = "Products" showCartIcon={true} />,
                                headerStyle: {
                                    height: 90,
                                    borderBottomLeftRadius: 20,
                                    borderBottomRightRadius: 20,
                                    backgroundColor: '#00e4d0',
                                    shadowColor: '#000',
                                    elevation: 25
                                }
                            }
                        }
                    />
                    
                    <Stack.Screen 
                        name = "CartDisplay"
                        component = {CartDisplay}
                        options = {
                            {
                                headerTitle: () => <Header name = "Cart" showCartIcon={true} />,
                                headerStyle: {
                                    height: 90,
                                    borderBottomLeftRadius: 20,
                                    borderBottomRightRadius: 20,
                                    backgroundColor: '#00e4d0',
                                    shadowColor: '#000',
                                    elevation: 25
                                }
                            }
                        }
                    />
                    
                    <Stack.Screen 
                        name = "Inventory"
                        component = {Inventory}
                        options = {
                            {
                                headerTitle: () => <Header name = "Inventory" />,
                                headerStyle: {
                                    height: 90,
                                    borderBottomLeftRadius: 20,
                                    borderBottomRightRadius: 20,
                                    backgroundColor: '#00e4d0',
                                    shadowColor: '#000',
                                    elevation: 25
                                }
                            }
                        }
                    />

                    <Stack.Screen 
                        name = "Payment"
                        component = {Payment}
                        options = {
                            {
                                headerTitle: () => <Header name = "Payment" />,
                                headerStyle: {
                                    height: 90,
                                    borderBottomLeftRadius: 20,
                                    borderBottomRightRadius: 20,
                                    backgroundColor: '#00e4d0',
                                    shadowColor: '#000',
                                    elevation: 25
                                }
                            }
                        }
                    />
                    
                    <Stack.Screen 
                        name = "OrderStatus"
                        component = {OrderStatus}
                        options = {
                            {
                                headerLeft: () => null,
                                headerTitle: () => <Header name = "OrderStatus" />,
                                headerStyle: {
                                    height: 90,
                                    borderBottomLeftRadius: 20,
                                    borderBottomRightRadius: 20,
                                    backgroundColor: '#00e4d0',
                                    shadowColor: '#000',
                                    elevation: 25
                                }
                            }
                        }
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </CartProvider>
    )
}
