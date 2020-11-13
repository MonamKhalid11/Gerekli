import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, ScrollView } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

// Components
import Section from '../../components/Section';
import CheckoutSteps from '../../components/CheckoutSteps';
import BottomActions from '../../components/BottomActions';
import { steps } from '../../services/vendors';

import i18n from '../../utils/i18n';
import * as nav from '../../services/navigation';
import { Navigation } from 'react-native-navigation';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$grayColor',
  },
  header: {
    marginLeft: 14,
    marginTop: 14,
  },
  scrollContainer: {
    paddingBottom: 14,
  },
});

const t = require('tcomb-form-native');
const Form = t.form.Form;
const formFields = t.struct({
  name: t.String,
  description: t.maybe(t.String),
});
const formOptions = {
  disableOrder: true,
  fields: {
    description: {
      label: i18n.t('Description'),
      clearButtonMode: 'while-editing',
      multiline: true,
      returnKeyType: 'done',
      blurOnSubmit: true,
      stylesheet: {
        ...Form.stylesheet,
        textbox: {
          ...Form.stylesheet.textbox,
          normal: {
            ...Form.stylesheet.textbox.normal,
            height: 150,
          },
        },
      },
    },
  },
};

class AddProductStep2 extends Component {
  static propTypes = {
    stepsData: PropTypes.shape({}),
  };

  constructor(props) {
    super(props);
    this.formRef = React.createRef();

    Navigation.events().bindComponent(this);
  }

  handleGoNext = () => {
    const { stepsData } = this.props;

    const value = this.formRef.current.getValue();
    if (value) {
      nav.pushVendorManageAddProductStep3(this.props.componentId, {
        stepsData: {
          ...stepsData,
          name: value.name,
          description: value.description,
        },
      });
    }
  };

  renderHeader = () => (
    <View style={styles.header}>
      <CheckoutSteps step={1} steps={steps} />
    </View>
  );

  render() {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {this.renderHeader()}
          <Section>
            <Form ref={this.formRef} type={formFields} options={formOptions} />
          </Section>
        </ScrollView>
        <BottomActions
          onBtnPress={this.handleGoNext}
          btnText={i18n.t('Next')}
        />
      </View>
    );
  }
}

export default connect(() => ({}))(AddProductStep2);
