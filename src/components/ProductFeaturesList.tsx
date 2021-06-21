import React from 'react';
import { FEATURE_TYPE_DATE, FEATURE_TYPE_CHECKBOX } from '../constants';
import { format } from 'date-fns';
import { bindActionCreators } from 'redux';
import { connect, RootStateOrAny } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import i18n from '../utils/i18n';

// Components
import Section from '../components/Section';
import SectionRow from '../components/SectionRow';

const styles = EStyleSheet.create({
  container: {
    padding: 20,
  },
});

export const ProductFeaturesList: React.FC = ({
  productFeatures,
  settings,
}) => {
  const renderFeatureItem = (feature, index, last) => {
    const { description, feature_type, value_int, value, variant } = feature;

    let newValue = null;
    switch (feature_type) {
      case FEATURE_TYPE_DATE:
        newValue = format(value_int * 1000, settings.dateFormat);
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

  const features = Object.keys(productFeatures).map((k) => productFeatures[k]);

  if (!features.length) {
    return null;
  }

  const lastElement = features.length - 1;

  return (
    <Section
      title={i18n.t('Features')}
      wrapperStyle={styles.wrapperStyle}
      topDivider>
      {features.map((item, index) =>
        renderFeatureItem(item, index, index === lastElement),
      )}
    </Section>
  );
};

export default connect(
  (state: RootStateOrAny) => ({
    productReviews: state.productReviews,
    settings: state.settings,
  }),
  (dispatch) => ({
    // productsActions: bindActionCreators(productsActions, dispatch),
  }),
)(ProductFeaturesList);
