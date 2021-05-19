import React, { useState, useEffect, useCallback } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

const styles = (iconSize: number | null) =>
  EStyleSheet.create({
    container: {
      flexDirection: 'row',
      marginRight: 10,
    },
    iconWrapper: {
      padding: 3,
    },
    icon: {
      color: '#FFC107',
      width: iconSize,
      height: iconSize,
    },
  });

interface StarsRatingProps {
  size: number;
  value: number;
  isDisabled: boolean;
  count: number;
}

export const StarsRating: React.FC<StarsRatingProps> = ({
  size,
  value,
  isDisabled,
  count,
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
    },
    [count],
  );

  useEffect(() => {
    ratingHandler(value);
  }, [ratingHandler, value]);

  const renderStar = (star: { isActive: boolean }, index: number) => {
    const path = star.isActive
      ? require('../assets/filled_star.png')
      : require('../assets/unfilled_star.png');

    return (
      <TouchableOpacity
        style={styles(null).iconWrapper}
        key={index}
        onPress={isDisabled ? undefined : () => ratingHandler(index)}
        activeOpacity={isDisabled ? 1 : 0.2}>
        <Image style={styles(size).icon} source={path} />
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles(null).container}>
      {stars.map((star, index) => {
        return renderStar(star, index + 1);
      })}
    </View>
  );
};

export default StarsRating;
