import React from 'react';
import { View, Text } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { format } from 'date-fns';
import { capitalizeFirstLetter } from '../utils/index';
import StarsRating from './StarsRating';

const styles = EStyleSheet.create({
  reviewContainer: {
    marginTop: 40,
  },
  reviewNameStarsDateWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reviewNameStarsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewName: {
    fontWeight: '500',
    marginRight: 5,
  },
  reviewDate: {
    color: '#8F8F8F',
  },
  reviewCountry: {
    color: '#8F8F8F',
  },
  reviewCommentTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 10,
  },
  reviewCommentText: {
    fontSize: 14,
    marginBottom: 20,
  },
  reviewLikesWrapper: {},
});

interface Review {
  user_data: {
    name: string;
  };
  product_review_timestamp: number;
  rating_value: string;
  country: string;
  message: {
    [key: string]: string;
  };
}

interface ProductReviewsProps {
  review: Review;
}

export const ProductReview: React.FC<ProductReviewsProps> = ({ review }) => {
  const reviewDate = format(
    new Date(review.product_review_timestamp * 1000),
    'dd.MM.yyyy',
  );

  return (
    <View style={styles.reviewContainer}>
      <View style={styles.reviewNameStarsDateWrapper}>
        <View style={styles.reviewNameStarsWrapper}>
          <Text style={styles.reviewName}>
            {review.user_data?.name || 'Stranger'}
          </Text>
          <StarsRating
            count={5}
            size={14}
            isDisabled
            value={Number(review.rating_value)}
          />
        </View>
        <Text style={styles.reviewDate}>{reviewDate}</Text>
      </View>
      <Text style={styles.reviewCountry}>{review.country}</Text>
      {Object.keys(review.message).map((el: string, index: number) => {
        return (
          <View key={index}>
            <Text style={styles.reviewCommentTitle}>
              {capitalizeFirstLetter(el)}
            </Text>
            <Text style={styles.reviewCommentText}>{review.message[el]}</Text>
          </View>
        );
      })}
      <View style={styles.reviewLikesWrapper}>
        <Text>Like/Dislike</Text>
      </View>
    </View>
  );
};

export default ProductReview;
