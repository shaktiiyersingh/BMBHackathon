import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  categoryContainer: {
    marginBottom: 30,
    backgroundColor: '#f0f0f0',
    padding: 24,
    borderRadius: 8,
   
    
  },
  categoryImage: {
    width: 50, // Adjust the width to your design
    height: 50, // Adjust the height to your design
    marginRight: 10, // Margin for spacing between the image and text
    // Add any other styles you want for your category images
  },
  categoryText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  productContainer: {
    marginBottom: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  productDetails: {
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 14,
    color: '#007bff',
  },
});

export default styles;
