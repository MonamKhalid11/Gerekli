import React from 'react';

// Components
import InputOption from './InputOption';
import RadioGroupOption from './RadioGroupOption';
import CheckboxOption from './CheckboxOption';
import SelectBoxOption from './SelectBoxOption';

export const ProductDetailOptions = ({
  options,
  selectedOptions,
  changeOptionHandler,
}) => {
  /**
   * Renders different options.
   * "Memory capacity" for example.
   *
   * @param {object} item - Option information.
   *
   * @return {JSX.Element}
   */
  const renderOptionItem = (item, isLastOption) => {
    console.log('item: ', item)
    const option = { ...item };
    // FIXME: Brainfuck code to convert object to array.
    // option.variants = Object.keys(option.variants).map(
    //   (k) => option.variants[k],
    // );
    const defaultValue = selectedOptions[item.selectDefaultId];
    const style = {
      marginBottom: isLastOption ? 0 : 30,
    };

    switch (item.option_type) {
      case 'I':
      case 'T':
        return (
          <InputOption
            option={option}
            value={defaultValue}
            key={item.selectDefaultId}
            onChange={(val) => changeOptionHandler(option.selectDefaultId, val)}
            style={style}
          />
        );

      case 'S':
        return (
          <SelectBoxOption
            option={option}
            value={defaultValue}
            key={item.selectDefaultId}
            onChange={(val) => changeOptionHandler(option.selectDefaultId, val)}
            style={style}
          />
        );

      case 'R':
        return (
          <RadioGroupOption
            option={option}
            value={defaultValue}
            key={item.selectDefaultId}
            onChange={(val) => changeOptionHandler(option.selectDefaultId, val)}
            style={style}
          />
        );

      case 'C':
        return (
          <CheckboxOption
            option={option}
            value={defaultValue}
            key={item.selectDefaultId}
            onChange={(val) => changeOptionHandler(option.selectDefaultId, val)}
            style={style}
          />
        );
      default:
        return null;
    }
  };

  const lastOptionNumber = options.length - 1;

  return (
    <>
      {options.map((option, index) => {
        const isLastOption = index === lastOptionNumber;
        return renderOptionItem(option, isLastOption);
      })}
    </>
  );
};
