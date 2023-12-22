import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { CartProvider } from "./src/context/CartContext";

import Header from "./src/components/Header/Header";
import Login from "./src/components/Login/Login";
import Registration from "./src/components/Registration/Registration";
import Dashboard from "./src/components/DashBoard/Dashboard";
import ProductDisplay from "./src/components/ProductDisplay/ProductDisplay";
import CartDisplay from "./src/components/CartDisplay/CartDisplay";
import Address from "./src/components/Address/Address";
import AddAddress from "./src/components/Address/AddAddress";
import Inventory from "./src/components/Inventry/Inventry";
import Payment from "./src/components/Payment/Payment";
import OrderStatus from "./src/components/Payment/OrderStatus";

const Stack = createStackNavigator();

const screens = [
  { name: "Login", component: Login, title: "Login", showCartIcon: false },
  { name: "Registration", component: Registration, title: "Registration", showCartIcon: false },
  { name: "Dashboard", component: Dashboard, title: "Dashboard", showCartIcon: true },
  { name: "ProductDisplay", component: ProductDisplay, title: "Products", showCartIcon: true },
  { name: "CartDisplay", component: CartDisplay, title: "Cart", showCartIcon: true },
  { name: "Address", component: Address, title: "Address", showCartIcon: true },
  { name: "AddAddress", component: AddAddress, title: "AddAddress", showCartIcon: true },
  { name: "Inventory", component: Inventory, title: "Inventory", showCartIcon: true },
  { name: "Payment", component: Payment, title: "Payment", showCartIcon: false },
  { name: "OrderStatus", component: OrderStatus, title: "OrderStatus", showCartIcon: false },
];

const App = () => (
  <CartProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {screens.map(({ name, component, title, showCartIcon }) => (
          <Stack.Screen
            key={name}
            name={name}
            component={component}
            options={{
              headerTitle: () => <Header name={title} showCartIcon={showCartIcon} />,
              headerStyle: {
                height: 90,
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
                backgroundColor: "#00e4d0",
                shadowColor: "#000",
                elevation: 25,
              },
            }}
          />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  </CartProvider>
);

export default () => (
  <App />
);