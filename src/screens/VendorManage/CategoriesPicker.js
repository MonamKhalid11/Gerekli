import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

// Components
import Spinner from '../../components/Spinner';

// Action
import * as categoriesActions from '../../actions/vendorManage/categoriesActions';
import { getCategoriesList } from '../../services/vendors';

import i18n from '../../utils/i18n';
import * as nav from '../../services/navigation';

import { iconsMap } from '../../utils/navIcons';
import { Navigation } from 'react-native-navigation';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$grayColor',
  },
  scrollContainer: {
    paddingBottom: 14,
  },
  itemWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
  },
  itemText: {
    paddingLeft: 14,
  },
  selectedIcon: {
    color: '#fff',
    marginRight: 10,
  },
});

class CategoriesPicker extends Component {
  static propTypes = {
    parent: PropTypes.number,
    categoriesActions: PropTypes.shape({
      toggleCategory: PropTypes.func,
      clear: PropTypes.func,
    }),
    categories: PropTypes.arrayOf(PropTypes.shape({})),
  };

  static defaultProps = {
    categories: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      categories: [],
    };

    Navigation.events().bindComponent(this);
  }

  async componentDidMount() {
    const { categoriesActions, categories, parent } = this.props;

    if (parent === 0) {
      categoriesActions.clear();
      this.handleLoadCategories();
      return;
    }

    this.setState({
      loading: false,
      categories,
    });
  }

  componentWillReceiveProps() {
    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        title: {
          text: i18n.t('Categories'),
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

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'close') {
      Navigation.dismissModal(this.props.componentId);
    }
  }

  handleLoadCategories = async (parent_id = 0, page = 1) => {
    this.setState({ loading: true });
    try {
      const response = await getCategoriesList(parent_id, page);
      if (response.data.categories) {
        this.setState({
          loading: false,
          categories: response.data.categories,
        });
      }
    } catch (error) {
      this.setState({ loading: false });
    }
  };

  handleToggle = async (item) => {
    const { categoriesActions, onCategoryPress } = this.props;
    try {
      const response = await getCategoriesList(item.category_id);
      if (response.data.categories.length) {
        nav.pushVendorManageCategoriesPicker(this.props.componentId, {
          title: i18n.t(item.category),
          parent: item.category_id,
          categories: response.data.categories,
          onCategoryPress,
        });
        return;
      }

      categoriesActions.toggleCategory(item);

      if (onCategoryPress) {
        onCategoryPress(item);
        Navigation.dismissModal(this.props.componentId);
        return;
      }

      nav.pushVendorManageAddProductStep1(this.props.componentId, {
        category_ids: [item.category_id],
      });
    } catch (error) {
      this.setState({ loading: false });
    }
  };

  handleLoadMore = () => {};

  renderEmptyList = () => (
    <Text style={styles.emptyList}>{i18n.t('There are no categories')}</Text>
  );

  renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemWrapper}
      onPress={() => this.handleToggle(item)}>
      <Text style={styles.itemText}>{item.category}</Text>
    </TouchableOpacity>
  );

  render() {
    const { categories, loading } = this.state;

    if (loading) {
      return <Spinner visible />;
    }

    return (
      <View style={styles.container}>
        <FlatList
          contentContainerStyle={styles.scrollContainer}
          data={categories}
          keyExtractor={(item) => `${item.category_id}`}
          numColumns={1}
          renderItem={this.renderCategoryItem}
          onEndReachedThreshold={1}
          onEndReached={() => this.handleLoadMore()}
          ListEmptyComponent={() => this.renderEmptyList()}
        />
      </View>
    );
  }
}

export default connect(
  (state) => ({
    selected: state.vendorManageCategories.selected,
  }),
  (dispatch) => ({
    categoriesActions: bindActionCreators(categoriesActions, dispatch),
  }),
)(CategoriesPicker);
