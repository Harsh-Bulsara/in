import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Alert } from 'react-native';
import axios from 'axios';

const BillingScreen = ({ route, navigation }) => {
  const { items, onPurchaseComplete } = route.params; // Get the callback from route.params
  const [billItems, setBillItems] = useState([]);
  const [totalCost, setTotalCost] = useState(0);

  // Fetch details of each item by its ID and calculate the total cost
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const fetchedItems = await Promise.all(
          items.map(async (selectedItem) => {
            const response = await axios.get(`http://localhost:5000/items/${selectedItem.itemId}`);
            const itemData = response.data;
            return {
              ...itemData,
              selectedQuantity: selectedItem.quantity,
              totalItemPrice: itemData.price * selectedItem.quantity
            };
          })
        );
        setBillItems(fetchedItems);

        // Calculate total cost
        const total = fetchedItems.reduce((acc, item) => acc + item.totalItemPrice, 0);
        setTotalCost(total);
      } catch (error) {
        console.error('Error fetching item details:', error);
      }
    };

    fetchItems();
  }, [items]);

  const handleConfirmPurchase = async () => {
    try {
      // Update inventory for each selected item
      await Promise.all(
        items.map(async (selectedItem) => {
          await axios.post('http://localhost:5000/items/update', {
            itemId: selectedItem.itemId,
            quantity: selectedItem.quantity,  // Reduce this quantity from inventory
          });
        })
      );

      // Show a success message
      Alert.alert('Purchase confirmed!');
      navigation.goBack(); // Go back to the ItemsList screen after confirming the purchase
      
      await axios.post('http://localhost:5000/sales', {
        date: new Date(), 
        amount: totalCost, 
        items: billItems.map(item => ({
          itemId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.selectedQuantity,
          total: item.totalItemPrice
        }))
      });

    } catch (error) {
      Alert.alert('Error', 'Failed to confirm purchase. Please try again.');
      console.error('Error confirming purchase:', error);
    }
  };
  

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item.name}</Text>
      <Text style={styles.itemDetails}>Price per unit: ₹{item.price}</Text>
      <Text style={styles.itemDetails}>Selected Quantity: {item.selectedQuantity}</Text>
      <Text style={styles.itemDetails}>Total: ₹{item.totalItemPrice.toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={billItems}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total Cost: ₹{totalCost.toFixed(2)}</Text>
        <Button title="Confirm Purchase" onPress={handleConfirmPurchase} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  list: {
    paddingBottom: 20,
  },
  itemContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemDetails: {
    fontSize: 16,
    marginTop: 5,
  },
  totalContainer: {
    marginTop: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#007BFF',
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default BillingScreen;
