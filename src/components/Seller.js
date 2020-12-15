import React from 'react';
import { View, Text } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Rating from './Rating';
import Icon from './Icon';
import { AddToCartButton } from './AddToCartButton';

const styles = (isStock, lastBlock, wishListActive) =>
  EStyleSheet.create({
    container: {
      paddingVertical: '1rem',
      paddingHorizontal: '1rem',
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
    place: {
      color: 'gray',
    },
    ratingWrapper: {},
    buttonsWrapper: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    stock: {
      textAlign: 'right',
      marginRight: 10,
      color: isStock ? '#149624' : '#961414',
    },
    priceText: {
      fontSize: '1rem',
    },
    favoriteIcon: {
      color: wishListActive ? '$primaryColor' : '$navBarButtonColor',
    },
    addTocCartBtn: {
      width: 130,
      marginLeft: 10,
    },
  });

export const Seller = () => {
  return (
    <View style={styles().container}>
      <View style={{ ...styles().containerBlock }}>
        <View>
          <Text style={styles().title}>Acme</Text>
          <Text style={styles().place}>Loas Angeles</Text>
        </View>
        <View style={styles().ratingWrapper}>
          <Rating value={4} />
          <Text style={styles(true).stock}>in stock</Text>
        </View>
      </View>
      <View style={styles(null, true).containerBlock}>
        <Text style={styles().priceText}>$90.00</Text>
        <View style={styles().buttonsWrapper}>
          <Icon name="favorite" style={styles(null, null, true).favoriteIcon} />
          <AddToCartButton
            buttonStyle={styles().addTocCartBtn}
            onPress={() => console.log('add to caty: ')}
          />
        </View>
      </View>
    </View>
  );
};
