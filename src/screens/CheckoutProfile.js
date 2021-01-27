import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { View, SafeAreaView } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Navigation } from 'react-native-navigation';

// Import components
import ArrowSteps from '../components/ArrowSteps';
import Spinner from '../components/Spinner';

// Import actions.
import * as authActions from '../actions/authActions';
import * as cartActions from '../actions/cartActions';
import * as stepsActions from '../actions/stepsActions';

import i18n from '../utils/i18n';
import { formatPrice } from '../utils';
import ProfileForm from '../components/ProfileForm';
import { iconsMap } from '../utils/navIcons';
import * as nav from '../services/navigation';
import { objectFilter } from '../utils/index';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  contentContainer: {
    paddingTop: 14,
    paddingBottom: 0,
    paddingLeft: 14,
    paddingRight: 14,
  },
});

/**
 * Checkout. Delivery screen.
 *
 * @reactProps {object} cart - Cart information.
 * @reactProps {object} authActions - Auth actions.
 */
export class CheckoutProfile extends Component {
  /**
   * @ignore
   */
  static propTypes = {
    cart: PropTypes.shape(),
    cartActions: PropTypes.shape(),
    authActions: PropTypes.shape(),
  };

  constructor(props) {
    super(props);
    this.state = {
      fieldsFetching: true,
    };
    Navigation.events().bindComponent(this);
  }

  /**
   * Gets fields and puts them in the state.
   */
  componentDidMount() {
    const { authActions } = this.props;
    const { fieldsFetching } = this.state;

    if (fieldsFetching) {
      authActions
        .profileFields({
          location: 'checkout',
          action: 'update',
        })
        .then(({ fields }) => {
          // eslint-disable-next-line no-param-reassign
          delete fields.E;

          this.setState({
            fields,
            fieldsFetching: false,
          });
        });
    }

    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        rightButtons: [
          {
            id: 'close',
            icon: iconsMap.close,
          },
        ],
      },
    });
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'close') {
      Navigation.dismissModal(this.props.componentId);
    }
  }

  /**
   * Saves user data, redirects to next screen.
   *
   * @param {object} values - Form data.
   */
  handleNextPress(values) {
    const { cart, cartActions, stateSteps, stepsActions } = this.props;

    cartActions.saveUserData({
      ...cart.user_data,
      ...values,
    });

    // Define next step
    const nextStep =
      stateSteps.flowSteps[
        Object.keys(stateSteps.flowSteps)[stateSteps.currentStepNumber + 1]
      ];
    stepsActions.setNextStep(nextStep);

    Navigation.push(this.props.componentId, {
      component: {
        name: nextStep.screenName,
        passProps: { cart, total: cart.subtotal },
      },
    });
  }

  fieldsFilter = (cart, fields) => {
    let isShipping = false;
    cart.product_groups.forEach((el) => {
      if (
        el.all_edp_free_shipping ||
        el.shipping_no_required ||
        el.free_shipping ||
        !el.shippings.length
      ) {
        isShipping = true;
      }
    });

    if (isShipping) {
      fields = objectFilter(
        fields,
        (fields) => fields.description !== 'Shipping address',
      );
    }

    return fields;
  };

  /**
   * Renders component
   *
   * @return {JSX.Element}
   */
  render() {
    const { cart } = this.props;
    const { fieldsFetching, fields } = this.state;

    if (fieldsFetching) {
      return (
        <View style={styles.container}>
          <Spinner visible />
        </View>
      );
    }

    const filteredFields = this.fieldsFilter(cart, fields);

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
          <ArrowSteps />
        </View>

        <ProfileForm
          fields={filteredFields}
          cartFooterEnabled
          showTitles
          totalPrice={formatPrice(cart.total_formatted.price)}
          btnText={i18n.t('Next').toUpperCase()}
          onBtnPress={(values, validateCb) => {
            validateCb();
          }}
          onSubmit={(values) => {
            this.handleNextPress(values);
          }}
        />
      </SafeAreaView>
    );
  }
}

export default connect(
  (state) => ({
    auth: state.auth,
    stateSteps: state.steps,
    state,
  }),
  (dispatch) => ({
    authActions: bindActionCreators(authActions, dispatch),
    cartActions: bindActionCreators(cartActions, dispatch),
    stepsActions: bindActionCreators(stepsActions, dispatch),
  }),
)(CheckoutProfile);
