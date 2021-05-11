import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Navigation } from 'react-native-navigation';
import i18n from '../utils/i18n';
import { iconsMap } from '../utils/navIcons';
import { AirbnbRating, Rating } from 'react-native-ratings';

export const WriteReviewNew = ({ componentId }) => {
  const [rating, setRating] = useState(0);

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

  return (
    <View>
      <AirbnbRating
        count={5}
        defaultRating={rating}
        size={40}
        showRating={false}
        onFinishRating={(value) => setRating(value)}
      />
    </View>
  );
};

export default WriteReviewNew;
