import React from 'react';
import { ScrollView } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect, RootStateOrAny } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import ProductReview from '../components/ProductReview';

// Import actions.
import * as productsActions from '../actions/productsActions';

const styles = EStyleSheet.create({
  container: {
    padding: 20,
  },
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
  helpfulness: {
    vote_up: number;
    vote_down: number;
  };
  product_review_id: number;
}

interface ProductReviewsRatingStats {
  ratings: {
    [key: number]: {
      count: number;
      percentage: number;
    };
  };
}

interface ProductReview {
  reviews: {
    [key: number]: Review;
  };
  count: number;
  ratingStats: ProductReviewsRatingStats;
  averageRating: string;
}

interface ProductReviews {
  [key: number]: ProductReview;
}

interface AllProductReviewsProps {
  productId: string;
  productReviews: ProductReviews;
}

export const AllProductReviews: React.FC<AllProductReviewsProps> = ({
  productId,
  productReviews,
}) => {
  const currentProductReviews = productReviews[parseInt(productId, 10)];
  return (
    <ScrollView style={styles.container}>
      {Object.keys(currentProductReviews.reviews).map((reviewNumber, index) => {
        return (
          <ProductReview
            review={currentProductReviews.reviews[parseInt(reviewNumber, 10)]}
            productId={parseInt(productId, 10)}
            key={index}
          />
        );
      })}
    </ScrollView>
  );
};

export default connect(
  (state: RootStateOrAny) => ({
    productReviews: state.productReviews,
  }),
  (dispatch) => ({
    productsActions: bindActionCreators(productsActions, dispatch),
  }),
)(AllProductReviews);
