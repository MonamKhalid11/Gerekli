import React from 'react';
import Section from './Section';
import { FEATURE_TYPE_DATE, FEATURE_TYPE_CHECKBOX } from '../constants';
import SectionRow from './SectionRow';
import i18n from '../utils/i18n';
import { formatDate } from '../utils';

export const ProductDetailFeatures = ({ product }) => {
  const renderFeatureItem = (feature, index, last) => {
    const { description, feature_type, value_int, value, variant } = feature;

    let newValue = null;
    switch (feature_type) {
      case FEATURE_TYPE_DATE:
        newValue = formatDate(value_int * 1000);
        break;
      case FEATURE_TYPE_CHECKBOX:
        newValue = feature.value === 'Y' ? i18n.t('Yes') : i18n.t('No');
        break;
      default:
        newValue = value || variant;
    }

    return (
      <SectionRow name={description} value={newValue} last={last} key={index} />
    );
  };

  const features = Object.keys(product.product_features).map(
    (k) => product.product_features[k],
  );

  if (!features.length) {
    return null;
  }

  const lastElement = features.length - 1;

  return (
    <Section title={i18n.t('Features')}>
      {features.map((item, index) =>
        renderFeatureItem(item, index, index === lastElement),
      )}
    </Section>
  );
};
