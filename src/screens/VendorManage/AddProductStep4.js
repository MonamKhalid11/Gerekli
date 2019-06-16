import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as t from 'tcomb-form-native';
import {
  View,
  ScrollView,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

// Styles
import theme from '../../config/theme';

// Components
import Section from '../../components/Section';
import StepsLine from '../../components/StepsLine';

import i18n from '../../utils/i18n';
import { registerDrawerDeepLinks } from '../../utils/deepLinks';

import {
  iconsLoaded,
} from '../../utils/navIcons';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$grayColor',
  },
  scrollContainer: {
    paddingBottom: 14,
  },
});

const Form = t.form.Form;
const formFields = t.struct({
  price: t.String,
  list_price: t.String,
});
const formOptions = {
  disableOrder: true,
};

class AddProductStep4 extends Component {
  static propTypes = {
    stepsData: PropTypes.shape({}),
    navigator: PropTypes.shape({
      setTitle: PropTypes.func,
      setButtons: PropTypes.func,
      push: PropTypes.func,
      setOnNavigatorEvent: PropTypes.func,
    }),
  };

  constructor(props) {
    super(props);

    props.navigator.setTitle({
      title: i18n.gettext('Enter the price').toUpperCase(),
    });

    props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  componentWillMount() {
    const { navigator } = this.props;
    iconsLoaded.then(() => {
      navigator.setButtons({
        rightButtons: [
          {
            title: i18n.gettext('Next'),
            id: 'next',
            showAsAction: 'ifRoom',
            buttonColor: theme.$primaryColor,
            buttonFontSize: 16,
          },
        ],
      });
    });
  }

  onNavigatorEvent(event) {
    const { navigator } = this.props;
    registerDrawerDeepLinks(event, navigator);
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'next') {
        const value = this.refs.form.getValue();
        if (value) {
          navigator.push({
            screen: 'VendorManageAddProductStep5',
            backButtonTitle: '',
            passProps: {
              stepsData: {
                ...this.props.stepsData,
                price: value.price,
                list_price: value.list_price,
              },
            },
          });
        }
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <StepsLine step={4} total={5} />
          <Section>
            <Form
              ref="form"
              type={formFields}
              options={formOptions}
            />
          </Section>
        </ScrollView>
      </View>
    );
  }
}

export default connect(
  state => ({
    nav: state.nav,
  }),
)(AddProductStep4);
