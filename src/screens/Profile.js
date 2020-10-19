import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

import * as authActions from '../actions/authActions';
import i18n from '../utils/i18n';
import theme from '../config/theme';
import config from '../config';
import * as nav from '../services/navigation';
import { registerDrawerDeepLinks } from '../utils/deepLinks';
import * as pagesActions from '../actions/pagesActions';
import Icon from '../components/Icon';

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
    paddingBottom: 10,
  },
  signInSectionContainer: {
    backgroundColor: theme.$grayColor,
    width: '100%',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#e3e3e3',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signInSectionText: {
    color: '#9c9c9c',
    fontWeight: 'bold',
    fontSize: '0.8rem',
  },
  signInBtnContainer: {
    width: '100%',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '$menuItemsBorderColor',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signInBtnText: {
    color: '#424040',
  },
  btn: {
    borderRadius: '$borderRadius',
    height: 38,
    marginBottom: 10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#424040',
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
  IconNameWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIcon: {
    fontSize: '1.2rem',
    color: '$menuItemsBorderColor',
    marginRight: 5,
  },
  rightArrowIcon: {
    fontSize: '1rem',
    color: '$menuItemsBorderColor',
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

  renderAddVendorFields() {
    const { profile } = this.props;

    if (profile.user_type !== 'V') {
      return null;
    }

    return (
      <>
        <TouchableOpacity
          onPress={() => nav.pushVendorManageOrders(this.props.componentId)}
          style={styles.signInBtnContainer}>
          <View style={styles.IconNameWrapper}>
            <Icon name="archive" style={styles.menuItemIcon} />
            <Text style={styles.signInBtnText}>{i18n.t('Vendor Orders')}</Text>
          </View>
          <Icon name="chevron-right" style={styles.rightArrowIcon} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => nav.pushVendorManageProducts(this.props.componentId)}
          style={styles.signInBtnContainer}>
          <View style={styles.IconNameWrapper}>
            <Icon name="pages" style={styles.menuItemIcon} />
            <Text style={styles.signInBtnText}>{i18n.t('Vendor Products')}</Text>
          </View>
          <Icon name="chevron-right" style={styles.rightArrowIcon} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => nav.showVendorManageCategoriesPicker({ parent: 0 })}
          style={styles.signInBtnContainer}>
          <View style={styles.IconNameWrapper}>
            <Icon name="add-circle" style={styles.menuItemIcon} />
            <Text style={styles.signInBtnText}>{i18n.t('Add Products')}</Text>
          </View>
          <Icon name="chevron-right" style={styles.rightArrowIcon} />
        </TouchableOpacity>
      </>
    );
  }

  renderPages = () => {
    const { pages } = this.props;

    return (
      <View>
        <View style={styles.signInSectionContainer}>
          <Text style={styles.signInSectionText}>
            {i18n.t('Seller').toUpperCase()}
          </Text>
        </View>
        {this.renderAddVendorFields()}
        {pages.items.map((page) => {
          return (
            <TouchableOpacity
              style={styles.signInBtnContainer}
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
              <Icon name="chevron-right" style={styles.rightArrowIcon} />
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
              style={{ ...styles.btn, backgroundColor: '#4fbe31' }}>
              <Text style={{ ...styles.btnText, color: '#fff' }}>
                {i18n.t('Login')}
              </Text>
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

  renderSignedInMenu = () => {
    const { authActions, auth } = this.props;

    if (!auth.logged) {
      return null;
    }

    return (
      <>
        <View style={styles.signInSectionContainer}>
          <Text style={styles.signInSectionText}>
            {i18n.t('Buyer').toUpperCase()}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => nav.pushProfileEdit(this.props.componentId)}
          style={styles.signInBtnContainer}>
          <View style={styles.IconNameWrapper}>
            <Icon name="person" style={styles.menuItemIcon} />
            <Text style={styles.signInBtnText}>{i18n.t('Profile')}</Text>
          </View>
          <Icon name="chevron-right" style={styles.rightArrowIcon} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => nav.pushOrders(this.props.componentId)}
          style={styles.signInBtnContainer}>
          <View style={styles.IconNameWrapper}>
            <Icon name="receipt" style={styles.menuItemIcon} />
            <Text style={styles.signInBtnText}>{i18n.t('Orders')}</Text>
          </View>
          <Icon name="chevron-right" style={styles.rightArrowIcon} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => authActions.logout()}
          style={styles.signInBtnContainer}>
          <View style={styles.IconNameWrapper}>
            <Icon name="exit-to-app" style={styles.menuItemIcon} />
            <Text style={styles.signInBtnText}>{i18n.t('Logout')}</Text>
          </View>
          <Icon name="chevron-right" style={styles.rightArrowIcon} />
        </TouchableOpacity>
      </>
    );
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        {this.renderSignedIn()}

        {this.renderSignedInMenu()}

        {this.renderPages()}
      </ScrollView>
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
