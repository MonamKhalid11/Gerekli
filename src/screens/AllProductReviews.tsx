import React from 'react';
import { ScrollView } from 'react-native';
import { bindActionCreators, Store } from 'redux';
import { connect } from 'react-redux';
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

interface ProductReviews {
  [key: string]: Review;
}

interface AllProductReviewsProps {
  productId: string;
  productReviews: Store;
}

export const AllProductReviews: React.FC<AllProductReviewsProps> = ({
  productId,
  productReviews,
}) => {
  const currentProductReviews = productReviews[productId];
  return (
    <ScrollView style={styles.container}>
      {Object.keys(currentProductReviews.reviews).map((reviewNumber) => {
        return (
          <ProductReview
            review={currentProductReviews.reviews[reviewNumber]}
            productId={productId}
          />
        );
      })}
    </ScrollView>
  );
};

export default connect(
  (state) => ({
    productReviews: state.productReviews,
  }),
  (dispatch) => ({
    productsActions: bindActionCreators(productsActions, dispatch),
  }),
)(AllProductReviews);
