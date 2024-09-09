import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator } from 'react-native';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

// Register the components required for the chart
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend);

const Insight = ({ navigation }) => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/sales'); 
        const sales = response.data;

        const months = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const salesByMonth = new Array(12).fill(0); 
        // Iterate through sales data and group by month
        sales.forEach(sale => {
          const saleDate = new Date(sale.date);
          const monthIndex = saleDate.getMonth(); 
          salesByMonth[monthIndex] += sale.amount; 
        });

        // Prepare the chart data object
        setChartData({
          labels: months,
          datasets: [
            {
              label: 'Monthly Sales',
              data: salesByMonth,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
              fill: true, 
            },
          ],
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching sales data:', error);
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sales Insights</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={styles.chartContainer}>
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false, // Allows specifying height and width
              plugins: {
                legend: {
                  display: true,
                  position: 'top',
                },
                tooltip: {
                  callbacks: {
                    label: function (tooltipItem) {
                      return tooltipItem.label + ': ₹' + tooltipItem.raw;
                    }
                  }
                }
              },
            }}
            height={200} 
            width={300}  
          />
        </View>
      )}

      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  chartContainer: {
    width: '100%',
    height: 300, // Adjust the height of the chart container
  },
});

export default Insight;
