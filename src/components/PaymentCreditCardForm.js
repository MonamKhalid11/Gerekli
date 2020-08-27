import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, I18nManager } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import * as t from 'tcomb-form-native';

import i18n from '../utils/i18n';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 14,
  },
});

// Validating length for card number
const cardNumber = t.refinement(t.String, cardNumber => cardNumber.length >= 16);

const { Form } = t.form;
const formFields = t.struct({
  cardNumber,
  expiryMonth: t.Number,
  expiryYear: t.Number,
  cardholderName: t.String,
  ccv: t.Number,
  notes: t.maybe(t.String),
});
const formOptions = {
  disableOrder: true,
  fields: {
    cardNumber: {
      label: i18n.t('Card Number'),
      clearButtonMode: 'while-editing',
      keyboardType: 'numeric',
      returnKeyType: 'done',
    },
    expiryMonth: {
      label: i18n.t('Valid thru (mm)'),
      clearButtonMode: 'while-editing',
      keyboardType: 'numeric',
      returnKeyType: 'done',
    },
    expiryYear: {
      label: i18n.t('Valid thru (yy)'),
      clearButtonMode: 'while-editing',
      keyboardType: 'numeric',
      returnKeyType: 'done',
    },
    cardholderName: {
      label: i18n.t('Cardholder\'s name'),
      clearButtonMode: 'while-editing',
      returnKeyType: 'done',
    },
    ccv: {
      label: i18n.t('CVV/CVC'),
      clearButtonMode: 'while-editing',
      keyboardType: 'numeric',
      returnKeyType: 'done',
    },
    notes: {
      label: i18n.t('Comment'),
      i18n: {
        optional: '',
        required: '',
      },
      help: `${i18n.t('(Optional)')}`,
      clearButtonMode: 'while-editing',
      multiline: true,
      blurOnSubmit: true,
      returnKeyType: 'done',
      stylesheet: {
        ...Form.stylesheet,
        controlLabel: {
          ...Form.stylesheet.controlLabel,
          normal: {
            ...Form.stylesheet.controlLabel.normal,
            textAlign: 'left',
          },
          error: {
            ...Form.stylesheet.controlLabel.error,
            textAlign: 'left',
          },
        },
        textbox: {
          ...Form.stylesheet.textbox,
          normal: {
            ...Form.stylesheet.textbox.normal,
            height: 150,
            textAlign: I18nManager.isRTL ? 'right' : 'left',
            writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
          },
          error: {
            ...Form.stylesheet.textbox.error,
            textAlign: I18nManager.isRTL ? 'right' : 'left',
            writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
          }
        }
      },
    },
  }
};

export default class PaymentCreditCardForm extends Component {
  static propTypes = {
    onInit: PropTypes.func,
  };

  componentDidMount() {
    this.props.onInit(this.refs.formRef);
  }

  render() {
    return (
      <View style={styles.container}>
        <Form
          ref={'formRef'}
          type={formFields}
          options={formOptions}
        />
      </View>
    );
  }
}
