import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { View, Text, Image, ScrollView } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

// Import actions.
import * as vendorActions from '../actions/vendorActions';
import * as productsActions from '../actions/productsActions';

// Components
import Rating from '../components/Rating';
import Section from '../components/Section';
import SectionRow from '../components/SectionRow';
import DiscussionList from '../components/DiscussionList';
import i18n from '../utils/i18n';
import { stripTags } from '../utils';
import { iconsMap } from '../utils/navIcons';
import { Navigation } from 'react-native-navigation';
import * as nav from '../services/navigation';

// Styles
const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  logo: {
    height: 60,
    width: 100,
    resizeMode: 'contain',
  },
  vendorName: {
    fontSize: '1rem',
    fontWeight: 'bold',
    textAlign: 'left',
  },
  vendorDescription: {
    color: 'gray',
    fontSize: '0.9rem',
    marginTop: 10,
    textAlign: 'left',
  },
  address: {
    color: 'gray',
    fontSize: '0.9rem',
    textAlign: 'left',
  },
  logoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noPadding: {
    padding: 0,
    paddingTop: 6,
  },
});

export class VendorDetail extends Component {
  static propTypes = {
    discussion: PropTypes.shape({
      items: PropTypes.shape({}),
      fetching: PropTypes.bool,
    }),
    vendorId: PropTypes.string,
    auth: PropTypes.shape({
      logged: PropTypes.bool,
    }),
    vendors: PropTypes.shape({
      items: PropTypes.shape({}),
    }),
    vendorActions: PropTypes.shape({
      fetch: PropTypes.func,
    }),
    productsActions: PropTypes.shape({
      fetchDiscussion: PropTypes.func,
    }),
  };

  constructor(props) {
    super(props);

    this.requestSent = true;
    this.state = {
      vendor: {
        company_id: '',
      },
      discussion: {
        average_rating: 0,
        posts: [],
        search: {
          page: 1,
          total_items: 0,
        },
      },
    };

    Navigation.events().bindComponent(this);
  }

  componentWillMount() {
    const { vendorId, vendors, vendorActions, productsActions } = this.props;

    if (!vendors.items[vendorId] && !vendors.fetching) {
      vendorActions.fetch(vendorId);
    } else {
      this.setState({ vendor: vendors.items[vendorId] }, () => {
        productsActions.fetchDiscussion(
          this.state.vendor.company_id,
          { page: this.state.discussion.search.page },
          'M',
        );
      });
    }

    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        title: {
          text: i18n.t('Vendor Detail').toUpperCase(),
        },
        leftButtons: [
          {
            id: 'close',
            icon: iconsMap.close,
          },
        ],
      },
    });
  }

  componentWillReceiveProps(nextProps) {
    // Get active discussion.
    const id = get(this.state.vendor, 'company_id', '0');
    let activeDiscussion = nextProps.discussion.items[`m_${id}`];
    if (!activeDiscussion) {
      activeDiscussion = {
        average_rating: 0,
        posts: [],
        search: {
          page: 1,
          total_items: 0,
        },
      };
    }

    this.setState({
      vendor: nextProps.vendors.items[nextProps.vendorId],
      discussion: activeDiscussion,
    });
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'close') {
      Navigation.dismissModal(this.props.componentId);
    }
  }

  handleLoadMore() {
    const { discussion, vendor } = this.state;
    // eslint-disable-next-line eqeqeq
    const hasMore = discussion.search.total_items != discussion.posts.length;

    if (hasMore && !this.requestSent && !this.props.discussion.fetching) {
      this.requestSent = true;
      this.props.productsActions.fetchDiscussion(
        vendor.company_id,
        {
          page: discussion.search.page + 1,
        },
        'M',
      );
    }
  }

  renderLogo() {
    const { vendor } = this.state;
    return (
      <Section>
        <View style={styles.logoWrapper}>
          <Image source={{ uri: vendor.logo_url }} style={styles.logo} />
        </View>
      </Section>
    );
  }

  renderDesc() {
    const { vendor, discussion } = this.state;
    return (
      <Section>
        <View style={styles.vendorWrapper}>
          <Text style={styles.vendorName}>{vendor.company}</Text>
          <Rating
            value={discussion.average_rating}
            count={discussion.search.total_items}
          />
          <Text style={styles.vendorDescription}>
            {stripTags(vendor.description)}
          </Text>
        </View>
      </Section>
    );
  }

  renderContacts() {
    const { vendor } = this.state;
    return (
      <Section title={i18n.t('Contact Information')}>
        <SectionRow
          name={i18n.t('E-mail')}
          value={get(vendor.contact_information, 'email', '')}
        />
        <SectionRow
          name={i18n.t('Phone')}
          value={get(vendor.contact_information, 'phone', '')}
        />
        <SectionRow
          name={i18n.t('Fax')}
          value={get(vendor.contact_information, 'fax', '')}
        />
        <SectionRow
          name={i18n.t('Website')}
          value={get(vendor.contact_information, 'url', '')}
          last
        />
      </Section>
    );
  }

  renderShipping() {
    const { vendor } = this.state;
    return (
      <Section title={i18n.t('Shipping address')}>
        <Text style={styles.address}>{vendor.shipping_address.address},</Text>
        <Text style={styles.address}>
          {vendor.shipping_address.state} {vendor.shipping_address.zipcode},
        </Text>
        <Text style={styles.address}>{vendor.shipping_address.country}</Text>
      </Section>
    );
  }

  renderDiscussion() {
    const { discussion, vendor } = this.state;
    const { auth } = this.props;

    let title = i18n.t('Reviews');
    // eslint-disable-next-line eqeqeq
    if (discussion.search.total_items != 0) {
      title = i18n.t('Reviews ({{count}})', {
        count: discussion.search.total_items,
      });
    }

    return (
      <Section
        title={title}
        wrapperStyle={styles.noPadding}
        showRightButton={!discussion.disable_adding && auth.logged}
        rightButtonText={i18n.t('Write a Review')}
        onRightButtonPress={() => {
          nav.pushWriteReview(this.props.componentId, {
            activeDiscussion: discussion,
            discussionType: 'M',
            discussionId: vendor.company_id,
          });
        }}>
        <DiscussionList
          infinite
          items={discussion.posts}
          type={discussion.type}
          fetching={this.props.discussion.fetching}
          onEndReached={() => this.handleLoadMore()}
        />
      </Section>
    );
  }

  render() {
    const { vendor } = this.state;

    console.log(this.props, this.state);

    if (!vendor.shipping_address) {
      return null;
    }

    return (
      <ScrollView style={styles.container}>
        {this.renderLogo()}
        {this.renderDesc()}
        {this.renderContacts()}
        {this.renderShipping()}
        {this.renderDiscussion()}
      </ScrollView>
    );
  }
}

export default connect(
  (state) => ({
    auth: state.auth,
    vendors: state.vendors,
    discussion: state.discussion,
  }),
  (dispatch) => ({
    vendorActions: bindActionCreators(vendorActions, dispatch),
    productsActions: bindActionCreators(productsActions, dispatch),
  }),
)(VendorDetail);
