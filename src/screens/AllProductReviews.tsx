import React, { useEffect } from 'react';
import { ScrollView } from 'react-native';
import { Navigation } from 'react-native-navigation';
import i18n from '../utils/i18n';
import { iconsMap } from '../utils/navIcons';
import EStyleSheet from 'react-native-extended-stylesheet';
import ProductReview from '../components/ProductReview';

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
}

interface ProductReviews {
  [key: string]: Review;
}

interface AllProductReviewsProps {
  productReviews: ProductReviews;
  componentId: string;
}

export const AllProductReviews: React.FC<AllProductReviewsProps> = ({
  productReviews,
  componentId,
}) => {
  const listener = {
    navigationButtonPressed: ({ buttonId }) => {
      if (buttonId === 'close') {
        Navigation.dismissModal(componentId);
      }
    },
  };

  useEffect(() => {
    Navigation.mergeOptions(componentId, {
      topBar: {
        title: {
          text: i18n.t('All reviews').toUpperCase(),
        },
        rightButtons: [
          {
            id: 'close',
            icon: iconsMap.close,
          },
        ],
      },
    });

    const listeners = Navigation.events().registerComponentListener(
      listener,
      componentId,
    );

    return () => {
      listeners.remove();
    };
  });

  return (
    <ScrollView style={styles.container}>
      {Object.keys(productReviews).map((reviewNumber) => {
        return <ProductReview review={productReviews[reviewNumber]} />;
      })}
    </ScrollView>
  );
};

export default AllProductReviews;
