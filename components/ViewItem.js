import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import axios from 'axios';

const ViewItem = ({ route, navigation }) => {
  const { itemId } = route.params;
  const [item, setItem] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/items/${itemId}`)
      .then(response => setItem(response.data))
      .catch(error => console.error('Error fetching item:', error));
  }, [itemId]);

  const handleDeleteItem = () => {
    axios.delete(`http://localhost:5000/items/${itemId}`)
      .then(() => {
        console.log('Item deleted');
        navigation.goBack();
      })
      .catch(error => console.error('Error deleting item:', error));
  };

  if (!item) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Name: {item.name}</Text>
      <Text style={styles.text}>Quantity: {item.quantity}</Text>
      <Button title="Edit Item" onPress={() => navigation.navigate('EditItem', { itemId: item._id })} />
      <Button title="Delete Item" onPress={handleDeleteItem} color="red" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  text: {
    fontSize: 18,
    marginBottom: 10
  }
});

export default ViewItem;
