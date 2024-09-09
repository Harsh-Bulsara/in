import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import axios from 'axios';

const ItemsList = () => {
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  // Fetch the list of items from the server
  const fetchItems = () => {
    axios.get('http://localhost:5000/items')
      .then(response => setItems(response.data))
      .catch(error => console.error('Error fetching items:', error));
  };

  // Refetch the items when the component is focused (after coming back from BillingScreen)
  useEffect(() => {
    if (isFocused) {
      fetchItems(); // Refetch items when ItemsList is focused
    }
  }, [isFocused]);
  

  // Toggle the selection of an item
  const handleSelectItem = (itemId) => {
    setSelectedItems(prev => {
      if (prev[itemId]) {
        const updatedItems = { ...prev };
        delete updatedItems[itemId];
        return updatedItems;
      }
      return { ...prev, [itemId]: { quantity: 1 } };
    });
  };

  // Change the quantity of the selected item
  const handleQuantityChange = (itemId, quantity) => {
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId], quantity: Number(quantity) }
    }));
  };

  // Navigate to the Billing screen with selected items
  const handleAddToBill = () => {
    const selected = Object.keys(selectedItems).map(itemId => ({
      itemId,
      quantity: selectedItems[itemId].quantity
    }));

    if (selected.length === 0) {
      alert('Please select at least one item.');
      return;
    }

    // Navigate to the Billing screen and pass the items and the refresh function
    navigation.navigate('Billing', { 
      items: selected,
      onPurchaseComplete: fetchItems  // Pass the fetchItems function to refresh the list
    });
  };

  // Navigate to the AddItem screen
  const handleAddItem = () => {
    navigation.navigate('AddItem', {
      addNewItem: (newItem) => {
        setItems(prevItems => [...prevItems, newItem]);
      },
    });
  };

  // Navigate to the ViewItem screen for details
  const handleViewItem = (itemId) => {
    navigation.navigate('ViewItem', { itemId });
  };

  // Navigate to the Insight screen
  const handleViewInsight = () => {
    navigation.navigate('Insight');
  };

  // Render each item in the list
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        style={[styles.item, selectedItems[item._id] ? styles.selectedItem : {}]}
        onPress={() => handleSelectItem(item._id)}
      >
        <Text style={styles.itemText}>{item.name}</Text>
        <Text style={styles.itemQuantity}>Quantity in stock: {item.quantity}</Text>
        <Text style={styles.itemPrice}>Price: ₹{item.price}</Text>
      </TouchableOpacity>

      {selectedItems[item._id] && (
        <View style={styles.quantityContainer}>
          <Text style={styles.quantityLabel}>Select Quantity:</Text>
          <TextInput
            style={styles.quantityInput}
            keyboardType="numeric"
            value={selectedItems[item._id].quantity.toString()}
            onChangeText={(quantity) => handleQuantityChange(item._id, quantity)}
          />
        </View>
      )}

      <Button title="View Item" onPress={() => handleViewItem(item._id)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        numColumns={4}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      />
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
          <Text style={styles.buttonText}>Add Item</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addToBillButton} onPress={handleAddToBill}>
          <Text style={styles.buttonText}>Add to Bill</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.viewInsightButton} onPress={handleViewInsight}>
          <Text style={styles.buttonText}>View Insight</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  grid: {
    justifyContent: 'center',
  },
  itemContainer: {
    flex: 1,
    margin: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  item: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  selectedItem: {
    backgroundColor: '#e0f7fa',
  },
  itemText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemQuantity: {
    fontSize: 14,
    marginTop: 5,
    color: '#666',
  },
  itemPrice: {
    fontSize: 14,
    color: '#007BFF',
    marginTop: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityLabel: {
    fontSize: 14,
    marginRight: 10,
    color: '#333',
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    width: 60,
    textAlign: 'center',
    borderRadius: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  addToBillButton: {
    backgroundColor: '#FF9800',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '32%',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '32%',
  },
  viewInsightButton: {
    backgroundColor: '#3F51B5',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '32%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ItemsList;
