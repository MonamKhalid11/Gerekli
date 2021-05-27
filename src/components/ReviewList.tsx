import React, { useState, useEffect } from 'react';
import { Store } from 'redux';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import * as nav from '../services/navigation';
import i18n from '../utils/i18n';

// Components
import StarsRating from './StarsRating';
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
      color: '$primaryColor',
      fontSize: 14,
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
  helpfulness: {
    vote_up: number;
    vote_down: number;
  };
  product_review_id: number;
}

interface ProductReviews {
  [key: string]: Review;
}

interface ReviewListProps {
  // productReviews: {
  //   reviews: ProductReviews;
  //   count: number;
  //   ratingStats: ProductReviewsRatingStats;
  //   averageRating: string;
  // };
  productReviews: Store;
  componentId: string;
  productId: number;
}

export const ReviewList: React.FC<ReviewListProps> = ({
  productReviews,
  componentId,
  productId,
}) => {
  const [currentProductReviews, setCurrentProductReviews] = useState<Review>({});

  useEffect(() => {
    setCurrentProductReviews(productReviews[productId]);
  }, [productReviews, productId]);

  const renderStars = () => {
    return (
      <View style={styles(null, null).starsContainer}>
        <StarsRating
          size={25}
          value={Number(currentProductReviews.averageRating)}
          isDisabled
          count={5}
          containerStyle={styles(null, null).starsRatingContainerStyle}
        />
        <Text style={styles(null, null).averageRatingText}>
          {Number(currentProductReviews.averageRating).toFixed(1)}
        </Text>
        <Text style={styles(null, null).reviewCountText}>
          {currentProductReviews.count ? currentProductReviews.count : 0}{' '}
          reviews
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
    if (!currentProductReviews.ratingStats) {
      return null;
    }

    const ratingStatsNumbers: string[] = Object.keys(
      currentProductReviews.ratingStats.ratings,
    );

    return ratingStatsNumbers.map((ratingNumber, index) => {
      return renderRatingBar(
        currentProductReviews.ratingStats.ratings[Number(ratingNumber)]
          .percentage,
        ratingNumber,
        index,
      );
    });
  };

  const renderReviewList = () => {
    if (!currentProductReviews.reviews) {
      return null;
    }

    let firstReviews = Object.keys(currentProductReviews.reviews);

    if (firstReviews.length > 2) {
      firstReviews = firstReviews.slice(0, 2);
    }

    return (
      <>
        {firstReviews.map((review: string, index) => {
          return (
            <ProductReview
              review={currentProductReviews.reviews[review]}
              productId={productId}
              key={index}
            />
          );
        })}
        <TouchableOpacity
          style={styles(null, null).showAllReviewsButton}
          onPress={() =>
            nav.pushAllProductReviews(componentId, {
              productId,
            })
          }>
          <Text style={styles(null, null).showAllReviewsText}>
            {i18n.t('View All')}
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

  if (!currentProductReviews.count) {
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

export default connect((state) => ({
  productReviews: state.productReviews,
}))(ReviewList);
