import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';

const AddItem = ({ navigation, route }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');

  const { addNewItem } = route.params; // To update the items list after adding the item

  const handleAddItem = () => {
    if (!name || !quantity || !price) {
      alert('Please fill out all fields.');
      return;
    }

    // Create the new item object
    const newItem = {
      name,
      quantity: Number(quantity),
      price: Number(price),
    };

    // Send the POST request to the backend to add the new item to MongoDB
    axios.post('http://localhost:5000/items', newItem)
      .then(response => {
        // Add the new item to the item list using the passed function
        addNewItem(response.data);

        // Navigate back to the items list
        navigation.goBack();
      })
      .catch(error => {
        console.error('Error adding item:', error);
        alert('Error adding item. Please try again.');
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Item Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter item name"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Quantity:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter quantity"
        keyboardType="numeric"
        value={quantity}
        onChangeText={setQuantity}
      />

      <Text style={styles.label}>Price:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter price"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      <Button title="Add Item" onPress={handleAddItem} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
});

export default AddItem;
