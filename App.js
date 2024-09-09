import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './components/LoginScreen';
import RegistrationScreen from './components/RegistrationScreen';
import ItemsList from './components/ItemsList';
import AddItem from './components/AddItem';
import EditItem from './components/EditItem';
import ViewItem from './components/ViewItem';
import BillingScreen from './components/BillingScreen';
import Insight from './components/Insight';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Registration" component={RegistrationScreen} />
        <Stack.Screen name="ItemsList" component={ItemsList} options={{ title: 'Inventory' }} />
        <Stack.Screen name="AddItem" component={AddItem} options={{ title: 'Add Item' }} />
        <Stack.Screen name="EditItem" component={EditItem} options={{ title: 'Edit Item' }} />
        <Stack.Screen name="ViewItem" component={ViewItem} options={{ title: 'View Item' }} />
        <Stack.Screen name="Billing" component={BillingScreen} options={{ title: 'Bill' }} />
        <Stack.Screen name="Insight" component={Insight} options={{ title: 'Insight' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
