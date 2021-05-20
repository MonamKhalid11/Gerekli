import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import i18n from '../utils/i18n';
import { iconsMap } from '../utils/navIcons';
import EStyleSheet from 'react-native-extended-stylesheet';
import StarsRating from '../components/StarsRating';

// Import actions.
import * as productsActions from '../actions/productsActions';

const styles = EStyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  ratingWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  ratingAndCommentWrapper: {
    width: '100%',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#B3B3B3',
    width: '100%',
    fontSize: 18,
    marginTop: 35,
    paddingBottom: 5,
  },
  sendReviewWrapper: {
    width: '100%',
    borderWidth: 1,
    height: 100,
  },
  sendButton: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '$primaryColor',
    paddingVertical: 10,
    borderRadius: '$borderRadius',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 22,
  },
});

export const WriteReviewNew = ({ componentId, productId, productsActions }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState({
    advantages: '',
    disadvantages: '',
    comment: '',
  });

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
          text: i18n.t('Write a review').toUpperCase(),
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

  const handleSendReview = () => {
    productsActions.sendReview({
      product_id: productId.toString(),
      rating_value: rating,
      ...comment,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.ratingAndCommentWrapper}>
        <StarsRating
          size={25}
          value={rating}
          isDisabled={false}
          count={5}
          onFinishRating={(value) => setRating(value)}
          containerStyle={styles.ratingWrapper}
        />

        <TextInput
          numberOfLines={3}
          multiline
          style={styles.input}
          value={comment.advantages}
          placeholder={'Advantages'}
          onChangeText={(value) => {
            setComment({ ...comment, advantages: value });
          }}
        />
        <TextInput
          numberOfLines={3}
          multiline
          style={styles.input}
          value={comment.input}
          placeholder={'Disadvantages'}
          onChangeText={(value) => {
            setComment({ ...comment, disadvantages: value });
          }}
        />
        <TextInput
          numberOfLines={3}
          multiline
          style={styles.input}
          value={comment.input}
          placeholder={'Comments*'}
          onChangeText={(value) => {
            setComment({ ...comment, comment: value });
          }}
        />
      </ScrollView>
      <TouchableOpacity
        style={styles.sendButton}
        onPress={() => handleSendReview()}>
        <Text style={styles.sendButtonText}>
          {i18n.t('send').toUpperCase()}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default connect(
  (state) => ({
    settings: state.settings,
    productDetail: state.productDetail,
    discussion: state.discussion,
    auth: state.auth,
    cart: state.cart,
    wishList: state.wishList,
  }),
  (dispatch) => ({
    productsActions: bindActionCreators(productsActions, dispatch),
  }),
)(WriteReviewNew);
