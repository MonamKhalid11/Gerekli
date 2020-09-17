import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  View,
  Alert,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

// Import actions.
import * as cartActions from '../actions/cartActions';

// Components
import Spinner from '../components/Spinner';
import VendorsCartsList from '../components/VendorsCartsList';
import CartProductList from '../components/CartProductList';

// theme
import theme from '../config/theme';

// links
import { registerDrawerDeepLinks } from '../utils/deepLinks';
import i18n from '../utils/i18n';

import {
  iconsMap,
  iconsLoaded,
} from '../utils/navIcons';

// Styles
const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  topBtn: {
    padding: 10,
  },
  trashIcon: {
    height: 20,
    fontSize: 20,
  }
});

class Cart extends Component {
  static navigatorStyle = {
    navBarBackgroundColor: theme.$navBarBackgroundColor,
    navBarButtonColor: theme.$navBarButtonColor,
    navBarButtonFontSize: theme.$navBarButtonFontSize,
    navBarTextColor: theme.$navBarTextColor,
    screenBackgroundColor: theme.$screenBackgroundColor,
  };

  static propTypes = {
    navigator: PropTypes.shape({
      push: PropTypes.func,
      dismissModal: PropTypes.func,
      setOnNavigatorEvent: PropTypes.func,
    }),
    cartActions: PropTypes.shape({
      fetch: PropTypes.func,
      clear: PropTypes.func,
      remove: PropTypes.func,
      change: PropTypes.func,
      changeAmount: PropTypes.func,
    }),
    auth: PropTypes.shape({
      token: PropTypes.string,
    }),
    cart: PropTypes.shape({}),
    vendorCarts: PropTypes.shape({})
  };

  constructor(props) {
    super(props);

    this.state = {
      products: [],
      fetching: true,
      refreshing: false,
    };
    props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  componentWillMount() {
    const { navigator } = this.props;
    iconsLoaded.then(() => {
      navigator.setButtons({
        leftButtons: [
          {
            id: 'close',
            icon: iconsMap.close,
          },
        ],
        rightButtons: [
          {
            id: 'clearCart',
            icon: iconsMap.delete,
          },
        ],
      });
    });

    navigator.setTitle({
      title: i18n.t('Cart').toUpperCase(),
    });
  }

  componentDidMount() {
    const { cartActions, cart } = this.props;
    cartActions.fetch();

    if (cart.all_vendor_ids) {
      console.log('didMount: ', cart)
      cart.all_vendor_ids.map(el => cartActions.fetch(true, 'A', el));
    }
  }

  componentWillReceiveProps(nextProps) {
    const { cart } = nextProps;

    if (cart.fetching) {
      return;
    }

    const products = Object.keys(cart.products).map((key) => {
      const result = cart.products[key];
      result.cartId = key;
      return result;
    });

    this.setState({
      products,
      fetching: false,
      refreshing: false,
    });
  }

  onNavigatorEvent(event) {
    const { navigator, cartActions } = this.props;
    // handle a deep link
    registerDrawerDeepLinks(event, navigator);
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'close') {
        navigator.dismissModal();
      } else if (event.id === 'clearCart') {
        Alert.alert(
          i18n.t('Clear all cart ?'),
          '',
          [
            {
              text: i18n.t('Cancel'),
              onPress: () => {},
              style: 'cancel'
            },
            {
              text: i18n.t('Ok'),
              onPress: () => cartActions.clear(),
            },
          ],
          { cancelable: true }
        );
      }
    }
  }

  handleRefresh() {
    const { cartActions } = this.props;
    this.setState(
      { refreshing: true },
      () => cartActions.fetch(),
    );
  }

  renderList(products) {
    const { fetching, refreshing } = this.state;
    const {
      cartActions, cart, auth, navigator
    } = this.props;

    if (fetching) {
      return null;
    }

    return (
      <CartProductList
        cart={cart}
        products={products}
        fetching={fetching}
        auth={auth}
        navigator={navigator}
        handleRefresh={this.handleRefresh}
        refreshing={refreshing}
        cartActions={cartActions}
      />
    );
  }

  renderVendorsList = (products) => {
    const { fetching, refreshing } = this.state;
    const {
      cartActions, auth, navigator, cart
    } = this.props;

    console.log('vendorCarts', cart.vendorCarts)

    if (fetching || !cart.vendorCarts) {
      return null;
    }

    return (
      <VendorsCartsList
        vendorCarts={cart.vendorCarts}
        products={products}
        fetching={fetching}
        auth={auth}
        navigator={navigator}
        handleRefresh={this.handleRefresh}
        refreshing={refreshing}
        cartActions={cartActions}
      />
    );
  }

  renderSpinner = () => {
    const { refreshing } = this.state;
    const { cart } = this.props;

    if (refreshing) {
      return false;
    }

    return (
      <Spinner visible={cart.fetching} />
    );
  };

  render() {
    const { products } = this.state;

    return (
      <View style={styles.container}>
        {!true ? this.renderList(products) : this.renderVendorsList(products)}
        {this.renderSpinner()}
      </View>
    );
  }
}

export default connect(
  state => ({
    auth: state.auth,
    cart: state.cart,
  }),
  dispatch => ({
    cartActions: bindActionCreators(cartActions, dispatch),
  })
)(Cart);
