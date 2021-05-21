import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { format } from 'date-fns';
import { capitalizeFirstLetter } from '../utils/index';
import StarsRating from './StarsRating';

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

  const renderReview = (review: Review, index: number) => {
    const reviewDate = format(
      new Date(review.product_review_timestamp * 1000),
      'dd.MM.yyyy',
    );

    return (
      <View style={styles(null, null).reviewContainer} key={index}>
        <View style={styles(null, null).reviewNameStarsDateWrapper}>
          <View style={styles(null, null).reviewNameStarsWrapper}>
            <Text style={styles(null, null).reviewName}>
              {review.user_data?.name || 'Stranger'}
            </Text>
            <StarsRating
              count={5}
              size={14}
              isDisabled
              value={Number(review.rating_value)}
            />
          </View>
          <Text style={styles(null, null).reviewDate}>{reviewDate}</Text>
        </View>
        <Text style={styles(null, null).reviewCountry}>{review.country}</Text>
        {Object.keys(review.message).map((el: string, index: number) => {
          return (
            <View key={index}>
              <Text style={styles(null, null).reviewCommentTitle}>
                {capitalizeFirstLetter(el)}
              </Text>
              <Text style={styles(null, null).reviewCommentText}>
                {review.message[el]}
              </Text>
            </View>
          );
        })}
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

    let firstReviews = Object.keys(productReviews);

    if (firstReviews.length > 2) {
      firstReviews = firstReviews.slice(0, 2);
    }

    return (
      <>
        {firstReviews.map((review: string, index) => {
          return renderReview(productReviews[review], index);
        })}
        <TouchableOpacity style={styles(null, null).showAllReviewsButton}>
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
