// InventoryManagementSystem/components/EditItem.js
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';

const EditItem = ({ route, navigation }) => {
  const { itemId, onUpdate } = route.params;
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:5000/items/${itemId}`)
      .then(response => {
        setName(response.data.name);
        setQuantity(response.data.quantity.toString());
        setPrice(response.data.price.toString());
      })
      .catch(error => console.error('Error fetching item details:', error));
  }, [itemId]);

  const handleUpdateItem = () => {
    axios.put(`http://localhost:5000/items/${itemId}`, {
      name,
      quantity: parseInt(quantity),
      price: parseFloat(price),
    })
      .then(response => {
        console.log('Item updated:', response.data);
        if (onUpdate) onUpdate(); // Trigger the update callback
        navigation.navigate('ItemsList'); // Navigate back to ItemsList
      })
      .catch(error => console.error('Error updating item:', error));
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Item Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantity"
        keyboardType="numeric"
        value={quantity}
        onChangeText={setQuantity}
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />
      <Button title="Update Item" onPress={handleUpdateItem} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderBottomWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8
  }
});

export default EditItem;
