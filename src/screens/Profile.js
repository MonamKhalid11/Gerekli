import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

import * as authActions from '../actions/authActions';
import i18n from '../utils/i18n';
import theme from '../config/theme';
import config from '../config';
import * as nav from '../services/navigation';
import { registerDrawerDeepLinks } from '../utils/deepLinks';
import * as pagesActions from '../actions/pagesActions';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },
  logo: {
    resizeMode: 'contain',
    width: '100%',
    height: 130,
  },
  signInWrapper: {
    backgroundColor: '#e5efff',
    paddingLeft: 14,
    paddingRight: 14,
    paddingTop: 10,
  },
  signInButtons: {
    flex: 1,
    flexDirection: 'row',
    paddingBottom: 70,
  },
  btn: {
    backgroundColor: '#005bff',
    height: 38,
    borderRadius: 6,
    marginRight: 12,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    padding: 20,
    color: '#fff',
    fontSize: '1rem',
  },
  signInInfo: {
    paddingBottom: 30,
  },
  signOut: {
    paddingBottom: 30,
  },
  userNameText: {
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  userMailText: {
    fontSize: '1rem',
  },
});

class ProfileEdit extends Component {
  static propTypes = {
    authActions: PropTypes.shape({
      registration: PropTypes.func,
    }),
  };

  static options = {
    topBar: {
      title: {
        text: i18n.t('Profile').toUpperCase(),
      },
    },
  };

  componentDidMount() {
    const { pagesActions } = this.props;
    pagesActions.fetch(config.layoutId);
  }

  renderPages = () => {
    const { pages } = this.props;

    return (
      <View>
        {pages.items.map((page) => {
          return (
            <TouchableOpacity
              onPress={() =>
                registerDrawerDeepLinks(
                  {
                    link: `dispatch=pages.view&page_id=${page.page_id}`,
                    payload: {
                      title: page.page,
                    },
                  },
                  this.props.componentId,
                )
              }>
              <Text style={styles.signInBtnText}>{page.page}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  renderSignedIn = () => {
    const { auth, cart } = this.props;
    return (
      <View style={styles.signInWrapper}>
        <View>
          {theme.$logoUrl !== '' && (
            <Image source={{ uri: theme.$logoUrl }} style={styles.logo} />
          )}
        </View>
        {!auth.logged ? (
          <View style={styles.signInButtons}>
            <TouchableOpacity
              onPress={() => nav.showLogin()}
              style={styles.btn}>
              <Text style={styles.btnText}>{i18n.t('Login')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => nav.showRegistration()}
              style={styles.btn}>
              <Text style={styles.btnText}>{i18n.t('Registration')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.signInInfo}>
              <Text style={styles.userNameText} numberOfLines={2}>
                {cart.user_data.b_firstname} {cart.user_data.b_lastname}
              </Text>
              <Text style={styles.userMailText}>{cart.user_data.email}</Text>
            </View>
          </>
        )}
      </View>
    );
  };

  render() {
    const { authActions } = this.props;

    return (
      <View style={styles.container}>
        {this.renderSignedIn()}

        {/* <TouchableOpacity onPress={() => nav.showLogin()}>
          <Text style={styles.signInBtnText}>{i18n.t('Login')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => nav.showRegistration()}>
          <Text style={styles.signInBtnText}>{i18n.t('Registration')}</Text>
        </TouchableOpacity> */}

        <TouchableOpacity
          onPress={() => nav.pushProfileEdit(this.props.componentId)}>
          <Text style={styles.signInBtnText}>{i18n.t('Profile')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => nav.pushOrders(this.props.componentId)}>
          <Text style={styles.signInBtnText}>{i18n.t('Orders')}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => authActions.logout()}>
          <Text style={styles.signInBtnText}>{i18n.t('Logout')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => nav.pushVendorManageOrders(this.props.componentId)}>
          <Text style={styles.signInBtnText}>{i18n.t('Vendor Orders')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => nav.pushVendorManageProducts(this.props.componentId)}>
          <Text style={styles.signInBtnText}>{i18n.t('Vendor Products')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => nav.showVendorManageCategoriesPicker({ parent: 0 })}>
          <Text style={styles.signInBtnText}>{i18n.t('Add Products')}</Text>
        </TouchableOpacity>

        {this.renderPages()}
      </View>
    );
  }
}

export default connect(
  (state) => ({
    auth: state.auth,
    pages: state.pages,
    cart: state.cart,
    profile: state.profile,
  }),
  (dispatch) => ({
    authActions: bindActionCreators(authActions, dispatch),
    pagesActions: bindActionCreators(pagesActions, dispatch),
  }),
)(ProfileEdit);
