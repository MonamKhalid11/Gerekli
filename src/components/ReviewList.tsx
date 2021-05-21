import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import StarsRating from './StarsRating';
import * as nav from '../services/navigation';
import ProductReview from './ProductReview';

const styles = (
  filledRatingPercentage: number | null,
  unfilledRatingPercentage: number | null,
) =>
  EStyleSheet.create({
    starsContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'flex-end',
      marginBottom: 20,
    },
    starsRatingContainerStyle: {
      marginRight: 10,
    },
    averageRatingText: {
      fontSize: 25,
      marginRight: 10,
    },
    reviewCountText: {
      color: '#8F8F8F',
      fontSize: 14,
    },
    ratingBarContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 7,
    },
    ratingBarWrapper: {
      flexDirection: 'row',
      width: '50%',
      height: 22,
    },
    ratingNumberText: {
      width: 55,
      marginRight: 10,
      fontSize: 16,
    },
    filedPartRatingBar: {
      backgroundColor: '#FFC107',
      height: '100%',
      width: `${filledRatingPercentage}%`,
    },
    unfiledPartRatingBar: {
      backgroundColor: '#ECECEC',
      height: '100%',
      width: `${unfilledRatingPercentage}%`,
    },
    ratingPercentageText: {
      marginLeft: 10,
      fontSize: 16,
    },
    showAllReviewsButton: {
      marginTop: 10,
    },
    showAllReviewsText: {
      color: '#0000FF',
    },
    noReviewText: {
      color: '#8F8F8F',
    },
  });

interface ProductReviewsRatingStats {
  ratings: {
    [key: number]: {
      count: number;
      percentage: number;
    };
  };
}

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

interface ProductReviews {
  [key: string]: Review;
}

interface ReviewListProps {
  items: string;
  type: number;
  productReviews: ProductReviews;
  productReviewsCount: number;
  productReviewsRatingStats: ProductReviewsRatingStats;
  averageRating: string;
  reviewCount: string;
}

export const ReviewList: React.FC<ReviewListProps> = ({
  items,
  type,
  productReviews,
  productReviewsCount,
  productReviewsRatingStats,
  averageRating,
  reviewCount,
}) => {
  const renderStars = () => {
    return (
      <View style={styles(null, null).starsContainer}>
        <StarsRating
          size={25}
          value={Number(averageRating)}
          isDisabled
          count={5}
          containerStyle={styles(null, null).starsRatingContainerStyle}
        />
        <Text style={styles(null, null).averageRatingText}>
          {Number(averageRating).toFixed(1)}
        </Text>
        <Text style={styles(null, null).reviewCountText}>
          {reviewCount ? reviewCount : 0} reviews
        </Text>
      </View>
    );
  };

  const renderRatingBar = (
    percentage: number,
    ratingNumber: string,
    index: number,
  ) => {
    return (
      <View style={styles(null, null).ratingBarContainer} key={index}>
        <Text style={styles(null, null).ratingNumberText}>
          {ratingNumber} stars
        </Text>
        <View style={styles(null, null).ratingBarWrapper}>
          <View style={styles(percentage, null).filedPartRatingBar} />
          <View style={styles(null, 100 - percentage).unfiledPartRatingBar} />
        </View>
        <Text style={styles(null, null).ratingPercentageText}>
          {percentage}%
        </Text>
      </View>
    );
  };

  const renderRatingBarList = () => {
    if (!productReviewsRatingStats) {
      return null;
    }

    const ratingStatsNumbers: string[] = Object.keys(
      productReviewsRatingStats.ratings,
    );

    return ratingStatsNumbers.map((ratingNumber, index) => {
      return renderRatingBar(
        productReviewsRatingStats.ratings[Number(ratingNumber)].percentage,
        ratingNumber,
        index,
      );
    });
  };

  const renderReviewList = () => {
    if (!productReviews) {
      return null;
    }

    let firstReviews = Object.keys(productReviews);

    if (firstReviews.length > 2) {
      firstReviews = firstReviews.slice(0, 2);
    }

    return (
      <>
        {firstReviews.map((review: string, index) => {
          return <ProductReview review={productReviews[review]} key={index} />;
        })}
        <TouchableOpacity
          style={styles(null, null).showAllReviewsButton}
          onPress={() => nav.showModalAllProductReviews({ productReviews })}>
          <Text style={styles(null, null).showAllReviewsText}>
            Show all reviews
          </Text>
        </TouchableOpacity>
      </>
    );
  };

  const renderNoReview = () => {
    return (
      <View>
        <Text style={styles(null, null).noReviewText}>
          У этого товара пока нет отызвов.
        </Text>
      </View>
    );
  };

  if (!reviewCount) {
    return renderNoReview();
  }

  return (
    <>
      {renderStars()}
      {renderRatingBarList()}
      {renderReviewList()}
    </>
  );
};

export default ReviewList;
