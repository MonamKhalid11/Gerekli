import React from 'react';
import { View, Text } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Rating from './Rating';
import { AddToCartButton } from './AddToCartButton';

const styles = (isStock, lastBlock, lastVendor) =>
  EStyleSheet.create({
    container: {
      paddingVertical: '1rem',
      paddingHorizontal: '1rem',
      borderBottomWidth: lastVendor ? 0 : 1,
      borderColor: '$menuItemsBorderColor',
    },
    containerBlock: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: !lastBlock ? 20 : 0,
    },
    title: {
      fontSize: '0.9rem',
    },
    stock: {
      textAlign: 'right',
      marginRight: 10,
      color: isStock ? '#149624' : '#961414',
    },
    priceText: {
      fontSize: '1rem',
    },
    addTocCartBtn: {
      width: 130,
      marginLeft: 10,
    },
  });

export const Seller = ({ title, stock, price, lastVendor, onPress }) => {
  return (
    <View style={styles(null, null, lastVendor).container}>
      <View style={{ ...styles().containerBlock }}>
        <View>
          <Text style={styles().title}>{title}</Text>
        </View>
        <View>
          <Rating value={4} />
          <Text style={styles(stock).stock}>
            {stock ? 'In stock' : 'Out of stock'}
          </Text>
        </View>
      </View>
      <View style={styles(null, 'lastBlock').containerBlock}>
        <Text style={styles().priceText}>{price}</Text>
        <AddToCartButton
          buttonStyle={styles().addTocCartBtn}
          onPress={onPress}
        />
      </View>
    </View>
  );
};
