import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { View, ScrollView } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

import Section from '../../components/Section';
import BottomActions from '../../components/BottomActions';
import * as productsActions from '../../actions/vendorManage/productsActions';
import i18n from '../../utils/i18n';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$grayColor',
  },
  scrollContainer: {
    paddingBottom: 14,
  },
});

const t = require('tcomb-form-native');
const Form = t.form.Form;
const formFields = t.struct({
  weight: t.Number,
  free_shipping: t.Boolean,
});
const formOptions = {
  disableOrder: true,
  fields: {
    weight: {
      label: i18n.t('Weight (lbs)'),
    },
    free_shipping: {
      label: i18n.t('Free shipping'),
    },
  },
};

class ShippingProperties extends Component {
  static propTypes = {
    values: PropTypes.shape({}),
    productsActions: PropTypes.shape({}),
    product: PropTypes.shape({}),
  };

  constructor(props) {
    super(props);

    this.formRef = React.createRef();
  }

  handleSave = () => {
    const { product, productsActions } = this.props;
    const values = this.formRef.current.getValue();

    if (!values) {
      return;
    }

    productsActions.updateProduct(product.product_id, { ...values });
  };

  render() {
    const { product } = this.props;

    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Section>
            <Form
              ref={this.formRef}
              type={formFields}
              options={formOptions}
              value={product}
            />
          </Section>
        </ScrollView>
        <BottomActions onBtnPress={this.handleSave} />
      </View>
    );
  }
}

export default connect(
  (state) => ({
    product: state.vendorManageProducts.current,
  }),
  (dispatch) => ({
    productsActions: bindActionCreators(productsActions, dispatch),
  }),
)(ShippingProperties);
