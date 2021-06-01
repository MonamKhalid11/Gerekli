import React, { useState, useEffect, useCallback } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

const styles = (iconSize: number | null) =>
  EStyleSheet.create({
    container: {
      flexDirection: 'row',
    },
    iconWrapper: {
      paddingVertical: 3,
      marginRight: 5,
    },
    icon: {
      tintColor: '#FFC107',
      width: iconSize,
      height: iconSize,
    },
  });

interface StarsRatingProps {
  size: number;
  value: number;
  ratingSelectionDisabled: boolean;
  count?: number;
  onFinishRating?: Function;
  containerStyle?: object;
  isEmpty?: boolean;
}

export const StarsRating: React.FC<StarsRatingProps> = ({
  size,
  value,
  ratingSelectionDisabled,
  count = 5,
  onFinishRating,
  containerStyle,
  isEmpty,
}) => {
  const [stars, setStars] = useState([{ isActive: true }]);

  const ratingHandler = useCallback(
    (index: number) => {
      const newValue = [];
      for (let i = 0; i < count; i++) {
        const starObject = { isActive: i < index };
        newValue.push(starObject);
      }
      setStars(newValue);
      if (onFinishRating) {
        return onFinishRating(index);
      }
    },
    [count, onFinishRating],
  );

  useEffect(() => {
    ratingHandler(Math.floor(value));
  }, [ratingHandler, value]);

  const renderStar = (star: { isActive: boolean }, index: number) => {
    const path = star.isActive
      ? require('../assets/filled_star.png')
      : require('../assets/unfilled_star.png');

    return (
      <TouchableOpacity
        style={styles(null).iconWrapper}
        key={index}
        onPress={
          ratingSelectionDisabled ? undefined : () => ratingHandler(index)
        }
        activeOpacity={ratingSelectionDisabled ? 1 : 0.2}>
        <Image style={styles(size).icon} source={path} />
      </TouchableOpacity>
    );
  };

  if (!value && !isEmpty) {
    return null;
  }

  return (
    <View style={{ ...styles(null).container, ...containerStyle }}>
      {stars.map((star, index) => {
        return renderStar(star, index + 1);
      })}
    </View>
  );
};

export default StarsRating;
