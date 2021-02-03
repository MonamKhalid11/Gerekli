import React from 'react';

// Components
import InputOption from './InputOption';
import RadiogroupOption from './RadiogroupOption';
import SwitchOption from './SwitchOption';

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
    const option = { ...item };
    // FIXME: Brainfuck code to convert object to array.
    option.variants = Object.keys(option.variants).map(
      (k) => option.variants[k],
    );
    const defaultValue = selectedOptions[option.option_id];
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
            key={item.option_id}
            onChange={(val) => changeOptionHandler(option.option_id, val)}
            style={style}
          />
        );

      case 'S':
      case 'R':
        return (
          <RadiogroupOption
            option={option}
            value={defaultValue}
            key={item.option_id}
            onChange={(val) => changeOptionHandler(option.option_id, val)}
            style={style}
          />
        );

      case 'C':
        return (
          <SwitchOption
            option={option}
            value={defaultValue}
            key={item.option_id}
            onChange={(val) => changeOptionHandler(option.option_id, val)}
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
