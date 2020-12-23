import React from 'react';
import { View, Text } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Rating from './Rating';
import { AddToCartButton } from './AddToCartButton';
import i18n from '../utils/i18n';

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
    place: {
      color: 'gray',
    },
    ratingText: {
      textAlign: 'right',
      marginRight: 10,
      color: 'gray',
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

export const Seller = ({ seller, lastVendor, onPress }) => {
  const isStock = parseInt(seller.amount, 10);
  console.log('seller: ', seller);
  return (
    <View style={styles(null, null, lastVendor).container}>
      <View style={{ ...styles().containerBlock }}>
        <View>
          <Text style={styles().title}>{seller.company_name}</Text>
          {seller.company.city && seller.company.country && (
            <Text style={styles().place}>
              {seller.company.country}, {seller.company.city}
            </Text>
          )}
        </View>
        <View>
          {seller.company.average_rating ? (
            <Rating value={seller.company.average_rating} />
          ) : (
            <Text style={styles().ratingText}>Нет отзывов</Text>
          )}
          <Text style={styles(isStock).stock}>
            {isStock ? i18n.t('In stock') : i18n.t('Out of stock')}
          </Text>
        </View>
      </View>
      <View style={styles(null, 'lastBlock').containerBlock}>
        <Text style={styles().priceText}>
          {seller.base_price_formatted.price}
        </Text>
        <AddToCartButton
          buttonStyle={styles().addTocCartBtn}
          onPress={onPress}
        />
      </View>
    </View>
  );
};
