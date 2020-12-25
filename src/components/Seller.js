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

export const Seller = ({ productOffer, lastVendor, onPress }) => {
  const isStock = !!parseInt(productOffer.amount, 10);
  return (
    <View style={styles(null, null, lastVendor).container}>
      <View style={{ ...styles().containerBlock }}>
        <View>
          <Text style={styles().title}>{productOffer.company_name}</Text>
          {productOffer.company.city && productOffer.company.country && (
            <Text style={styles().place}>
              {productOffer.company.country}, {productOffer.company.city}
            </Text>
          )}
        </View>
        <View>
          {productOffer.company.average_rating && (
            <Rating value={productOffer.company.average_rating} />
          )}
          <Text style={styles(isStock).stock}>
            {isStock ? i18n.t('In stock') : i18n.t('Out of stock')}
          </Text>
        </View>
      </View>
      <View style={styles(null, 'lastBlock').containerBlock}>
        <Text style={styles().priceText}>
          {productOffer.base_price_formatted.price}
        </Text>
        {isStock && (
          <AddToCartButton
            buttonStyle={styles().addTocCartBtn}
            onPress={onPress}
          />
        )}
      </View>
    </View>
  );
};
