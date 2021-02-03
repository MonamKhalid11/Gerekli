import React from 'react';

// Components
import InputOption from './InputOption';
import RadiogroupOption from './SelectOption';
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
  const renderOptionItem = (item) => {
    const option = { ...item };
    // FIXME: Brainfuck code to convert object to array.
    option.variants = Object.keys(option.variants).map(
      (k) => option.variants[k],
    );
    const defaultValue = selectedOptions[option.option_id];

    switch (item.option_type) {
      case 'I':
      case 'T':
        return (
          <InputOption
            option={option}
            value={defaultValue}
            key={item.option_id}
            onChange={(val) => changeOptionHandler(option.option_id, val)}
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
          />
        );

      case 'C':
        return (
          <SwitchOption
            option={option}
            value={defaultValue}
            key={item.option_id}
            onChange={(val) => changeOptionHandler(option.option_id, val)}
          />
        );
      default:
        return null;
    }
  };

  return <>{options.map((option) => renderOptionItem(option))}</>;
};
