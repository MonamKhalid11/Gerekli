import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { View, FlatList } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Navigation } from 'react-native-navigation';

import { PRODUCT_NUM_COLUMNS } from '../utils';

// Import actions.
import * as vendorActions from '../actions/vendorActions';
import * as productsActions from '../actions/productsActions';

// Components
import Spinner from '../components/Spinner';
import VendorInfo from '../components/VendorInfo';
import CategoryBlock from '../components/CategoryBlock';
import ProductListView from '../components/ProductListView';
import SortProducts from '../components/SortProducts';
import { iconsMap } from '../utils/navIcons';
import * as nav from '../services/navigation';

// Styles
const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },
});

class Vendor extends Component {
  static propTypes = {
    vendors: PropTypes.shape({}),
    vendorCategories: PropTypes.shape({}),
    products: PropTypes.shape({}),
    vendorActions: PropTypes.shape({
      categories: PropTypes.func,
      products: PropTypes.func,
      fetch: PropTypes.func,
    }),
    productsActions: PropTypes.shape({
      fetchDiscussion: PropTypes.func,
    }),
    companyId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  };

  constructor(props) {
    super(props);
    this.isFirstLoad = true;

    this.state = {
      filters: '',
      products: [],
      vendor: {
        logo_url: null,
      },
      discussion: {
        search: {
          page: 1,
        },
      },
    };
    Navigation.events().bindComponent(this);
  }

  componentWillMount() {
    const { vendors, companyId, vendorActions, productsActions } = this.props;

    vendorActions.categories(companyId);
    this.handleLoad();

    if (!vendors.items[companyId] && !vendors.fetching) {
      vendorActions.fetch(companyId);
    } else {
      this.setState(
        {
          vendor: vendors.items[companyId],
        },
        () => {
          productsActions.fetchDiscussion(
            this.state.vendor.company_id,
            { page: this.state.discussion.search.page },
            'M',
          );
        },
      );
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

  componentWillReceiveProps(nextProps) {
    const { products, vendors, companyId } = nextProps;
    const vendorProducts = products.items[companyId];
    if (vendorProducts) {
      this.setState(
        {
          products: vendorProducts,
        },
        () => {
          this.isFirstLoad = false;
        },
      );
    }

    if (vendors.items[companyId]) {
      this.setState({ vendor: vendors.items[companyId] });
    }
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'close') {
      Navigation.dismissModal(this.props.componentId);
    }
  }

  handleLoad = (page = 1) => {
    const { companyId, vendorActions, products } = this.props;
    const { filters } = this.state;
    return vendorActions.products(companyId, page, {
      ...products.sortParams,
      features_hash: filters,
    });
  };

  handleLoadMore() {
    const { products } = this.props;
    if (products.hasMore && !products.fetching && !this.isFirstLoad) {
      this.handleLoad(products.params.page + 1);
    }
  }

  renderHeader() {
    const {
      vendorCategories,
      companyId,
      products,
      productsActions,
    } = this.props;
    const { vendor } = this.state;

    if (!vendor.logo_url) {
      return null;
    }

    const productHeader = (
      <SortProducts
        sortParams={products.sortParams}
        filters={products.filters}
        onChange={(sort) => {
          productsActions.changeSort(sort);
          this.handleLoad();
        }}
        onChangeFilter={(filters) => {
          this.setState({ filters }, this.handleLoad);
        }}
      />
    );

    return (
      <View>
        <VendorInfo
          onViewDetailPress={() =>
            nav.showModalVendorDetail({ vendorId: companyId })
          }
          logoUrl={vendor.logo_url}
          productsCount={vendor.products_count}
        />
        <CategoryBlock
          items={vendorCategories.items}
          onPress={(category) => {
            nav.pushCategory(this.props.componentId, {
              category,
              companyId,
            });
          }}
        />
        {productHeader}
      </View>
    );
  }

  render() {
    const { vendorCategories, vendors } = this.props;
    const { products } = this.state;

    if (vendorCategories.fetching || vendors.fetching) {
      return <Spinner visible />;
    }

    return (
      <View style={styles.container}>
        <FlatList
          data={products}
          keyExtractor={(item) => +item.product_id}
          removeClippedSubviews
          initialNumToRender={20}
          ListHeaderComponent={() => this.renderHeader()}
          numColumns={PRODUCT_NUM_COLUMNS}
          renderItem={(item) => (
            <ProductListView
              product={item}
              onPress={(product) =>
                nav.pushProductDetail(this.props.componentId, {
                  pid: product.product_id,
                })
              }
            />
          )}
          onEndReached={() => this.handleLoadMore()}
        />
      </View>
    );
  }
}

export default connect(
  (state) => ({
    vendorCategories: state.vendorCategories,
    products: state.products,
    vendors: state.vendors,
  }),
  (dispatch) => ({
    vendorActions: bindActionCreators(vendorActions, dispatch),
    productsActions: bindActionCreators(productsActions, dispatch),
  }),
)(Vendor);
