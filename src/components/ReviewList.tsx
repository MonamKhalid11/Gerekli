import React from 'react';
import { View, Text } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { AirbnbRating } from 'react-native-ratings';

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
    airbnbRatingStyles: {
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
  });

interface ProductReviewsRatingStats {
  ratings: {
    [key: number]: {
      count: number;
      percentage: number;
    };
  };
}

interface ReviewListProps {
  items: string;
  type: number;
  productReviews: object;
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
  console.log(productReviews);

  const renderStars = () => {
    return (
      <View style={styles(null, null).starsContainer}>
        <AirbnbRating
          count={5}
          defaultRating={Number(averageRating)}
          size={25}
          showRating={false}
          isDisabled
          starContainerStyle={styles(null, null).airbnbRatingStyles}
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

  const renderRatingBar = (percentage: number, ratingNumber: string) => {
    return (
      <View style={styles(null, null).ratingBarContainer}>
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

    return ratingStatsNumbers.map((ratingNumber: string) => {
      return renderRatingBar(
        productReviewsRatingStats.ratings[Number(ratingNumber)].percentage,
        ratingNumber,
      );
    });
  };

  return (
    <View>
      {renderStars()}
      {renderRatingBarList()}
    </View>
  );
};

export default ReviewList;
