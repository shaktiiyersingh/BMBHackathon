import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CategoriesScreen from './components/categoryscreen';
import ProductScreen from './components/productscreen';
import MyScrollView from './components/scrol';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Categories">
        <Stack.Screen name="Categories" component={CategoriesScreen} />
        <Stack.Screen name="Products" component={ProductScreen} />
        <Stack.Screen name="Scroll" component={MyScrollView} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
