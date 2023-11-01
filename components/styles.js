import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 16,
    alignItems:'center',
    justifyContent:'center'
  },
  categoryContainer: {
    marginBottom: 30,
    backgroundColor: '#f0f0f0',
    padding: 24,
    borderRadius: 8,
    width:150, 
    alignItems:'center',
    justifyContent:'center' 
  },
  categoryImage: {
    width: 50, // Adjust the width to your design
    height: 50, // Adjust the height to your design
    marginVertical: 20, // Margin for spacing between the image and text
    // Add any other styles you want for your category images
  },
  categoryText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20
  },
  productDetails: {
    marginBottom: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
    alignItems:'center',
    justifyContent:'center' 
  },
  productImage: {
    width: 50,
    height: 50,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  productDetails: {
    marginBottom: 30,
    backgroundColor: '#f0f0f0',
    padding: 24,
    borderRadius: 8,
   
    
    alignItems:'center',
    justifyContent:'center' 
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical:10,
    
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    
    marginVertical:10,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    margin: 5,
  },
  quantityText: {
    fontSize: 16,
  },
});

export default styles;
