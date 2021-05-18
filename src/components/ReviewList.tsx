import React from 'react';
import { View, Text } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { AirbnbRating } from 'react-native-ratings';
import { format } from 'date-fns';
import { capitalizeFirstLetter } from '../utils/index';

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
    reviewContainer: {
      marginTop: 20,
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
    reviewCommentsWrapper: {
      marginTop: 10,
    },
    reviewCommentWrapper: {
      marginBottom: 10,
    },
    reviewLikesWrapper: {},
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

  const renderReview = (review) => {
    const reviewDate = format(
      new Date(review.product_review_timestamp * 1000),
      'dd.MM.yyyy',
    );

    return (
      <View style={styles(null, null).reviewContainer}>
        <View style={styles(null, null).reviewNameStarsDateWrapper}>
          <View style={styles(null, null).reviewNameStarsWrapper}>
            <Text style={styles(null, null).reviewName}>John Const</Text>
            <AirbnbRating
              count={5}
              defaultRating={Number(review.rating_value)}
              size={14}
              showRating={false}
              isDisabled
            />
          </View>
          <Text style={styles(null, null).reviewDate}>{reviewDate}</Text>
        </View>
        <Text style={styles(null, null).reviewCountry}>
          {review.country || 'USA'}
        </Text>
        <View style={styles(null, null).reviewCommentsWrapper}>
          {Object.keys(review.message).map((el) => {
            return (
              <View style={styles(null, null).reviewCommentWrapper}>
                <Text>{capitalizeFirstLetter(el)}</Text>
                <Text>{review.message[el]}</Text>
              </View>
            );
          })}
        </View>
        <View style={styles(null, null).reviewLikesWrapper}>
          <Text>Like/Dislike</Text>
        </View>
      </View>
    );
  };

  const renderReviewList = () => {
    if (!productReviews) {
      return null;
    }

    return Object.keys(productReviews).map((review) => {
      return renderReview(productReviews[review]);
    });
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
