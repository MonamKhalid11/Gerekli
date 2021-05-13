import React from 'react';
import { View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

const styles = (ratingPercentage: number | null) =>
  EStyleSheet.create({
    ratingBarWrapper: {
      width: '50%',
      height: 22,
      borderWidth: 1,
    },
    filedPartRatingBar: {
      backgroundColor: '$primaryColor',
      height: '100%',
      width: `${ratingPercentage}%`,
    },
    unfiledPartRatingBar: {},
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
}

export const ReviewList: React.FC<ReviewListProps> = ({
  items,
  type,
  productReviews,
  productReviewsCount,
  productReviewsRatingStats,
}) => {
  const ratingBar = (percentage: number) => {
    return (
      <View style={styles(null).ratingBarWrapper}>
        <View style={styles(percentage).filedPartRatingBar} />
        <View style={styles(null).unfiledPartRatingBar} />
      </View>
    );
  };

  const ratingBarList = (
    productReviewsRatingStats: ProductReviewsRatingStats,
  ) => {
    const ratingStatsNumbers: string[] = Object.keys(
      productReviewsRatingStats.ratings,
    );

    return ratingStatsNumbers.map((ratingNumber: string) => {
      return ratingBar(
        productReviewsRatingStats.ratings[Number(ratingNumber)].percentage,
      );
    });
  };

  return <View>{ratingBarList(productReviewsRatingStats)}</View>;
};

export default ReviewList;
