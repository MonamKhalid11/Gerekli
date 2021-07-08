import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { View, Text, Image, ScrollView } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

// Import actions.
import * as vendorActions from '../actions/vendorActions';
import * as productsActions from '../actions/productsActions';

// Components
import Spinner from '../components/Spinner';
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

/**
 * Renders a modal window with vendor information.
 *
 * @reactProps {object} navigator - Navigator.
 * @reactProps {object} discussion - User comments about the vendor.
 * @reactProps {string} vendorId - Vendor id.
 * @reactProps {object} auth - Authorization information.
 * @reactProps {object} vendors - Vendors information.
 * @reactProps {object} vendorActions - Vendor actions.
 * @reactProps {object} productsActions - Products actions.
 */
export class VendorDetail extends Component {
  /**
   * @ignore
   */
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
      currentVendor: null,
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

  /**
   * Gets the vendor if it is not already there. Gets discussions.
   * Loads icons. Sets title.
   */
  componentWillMount() {
    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        title: {
          text: i18n.t('Vendor Detail').toUpperCase(),
        },
        rightButtons: [
          {
            id: 'close',
            icon: iconsMap.close,
          },
        ],
      },
    });
  }

  /**
   * Gets vendor data.
   */
  componentDidMount() {
    const { vendorId, vendorActions } = this.props;
    const { discussion } = this.state;

    vendorActions.fetch(vendorId, undefined, { page: discussion.search.page });
  }

  /**
   * Formats vendor comments.
   */
  componentDidUpdate() {
    const { vendors, discussion } = this.props;
    const { currentVendor } = this.state;

    if (vendors.currentVendor && Object.keys(discussion.items).length) {
      const activeDiscussion =
        discussion.items[`m_${vendors.currentVendor.company_id}`];
      if (currentVendor !== vendors.currentVendor && activeDiscussion) {
        this.setState({
          currentVendor: vendors.currentVendor,
          discussion: activeDiscussion,
        });
      }
    }
  }

  /**
   * Vendor detail modal navigation.
   *
   * @param {object} event - Information about the element on which the event occurred.
   */
  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'close') {
      Navigation.dismissModal(this.props.componentId);
    }
  }

  /**
   * Gets more discussions.
   */
  handleLoadMore() {
    const { discussion } = this.state;
    const { vendors } = this.props;
    const hasMore = discussion.search.total_items != discussion.posts.length; // eslint-disable-line

    if (hasMore && !this.requestSent && !this.props.discussion.fetching) {
      this.requestSent = true;
      this.props.productsActions.fetchDiscussion(
        vendors.currentVendor.company_id,
        {
          page: discussion.search.page + 1,
        },
        'M',
      );
    }
  }

  /**
   * Renders logo.
   *
   * @return {JSX.Element}
   */
  renderLogo() {
    const { vendors } = this.props;
    return (
      <Section>
        <View style={styles.logoWrapper}>
          <Image
            source={{ uri: vendors.currentVendor.logo_url }}
            style={styles.logo}
          />
        </View>
      </Section>
    );
  }

  /**
   * Renders description.
   *
   * @return {JSX.Element}
   */
  renderDesc() {
    const { discussion } = this.state;
    const { vendors } = this.props;
    return (
      <Section>
        <View style={styles.vendorWrapper}>
          <Text style={styles.vendorName}>{vendors.currentVendor.company}</Text>
          <Rating
            value={discussion.average_rating}
            count={discussion.search.total_items}
          />
          <Text style={styles.vendorDescription}>
            {stripTags(vendors.currentVendor.description)}
          </Text>
        </View>
      </Section>
    );
  }

  /**
   * Renders contacts.
   *
   * @return {JSX.Element}
   */
  renderContacts() {
    const { vendors } = this.props;
    return (
      // <Section title={i18n.t('Contact Information')}>
      //   <SectionRow
      //     name={i18n.t('E-mail')}
      //     value={vendors.currentVendor.contact_information.email}
      //   />
      //   <SectionRow
      //     name={i18n.t('Phone')}
      //     value={vendors.currentVendor.contact_information.phone}
      //   />
      //   <SectionRow
      //     name={i18n.t('Fax')}
      //     value={vendors.currentVendor.contact_information.fax}
      //   />
      //   <SectionRow
      //     name={i18n.t('Website')}
      //     value={vendors.currentVendor.contact_information.url}
      //     last
      //   />
      // </Section>
      <></>
    );
  }

  /**
   * Renders shipping information.
   *
   * @return {JSX.Element}
   */
  renderShipping() {
    const { vendors } = this.props;

    return (
      // <Section title={i18n.t('Shipping address')}>
      //   <Text style={styles.address}>
      //     {vendors.currentVendor.shipping_address.address},
      //   </Text>
      //   <Text style={styles.address}>
      //     {vendors.currentVendor.shipping_address.state}{' '}
      //     {vendors.currentVendor.shipping_address.zipcode},
      //   </Text>
      //   <Text style={styles.address}>
      //     {vendors.currentVendor.shipping_address.country}
      //   </Text>
      // </Section>
      <>
      </>
    );
  }

  /**
   * Renders discussions.
   *
   * @return {JSX.Element}
   */
  renderDiscussion() {
    const { discussion } = this.state;
    const { auth, vendors } = this.props;

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
            discussionId: vendors.currentVendor.company_id,
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

  /**
   * Renders component
   *
   * @return {JSX.Element}
   */
  render() {
    const { vendors } = this.props;

    if (!vendors.currentVendor && vendors.fetching) {
      return <Spinner visible />;
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