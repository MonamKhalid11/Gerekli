import React, { Component } from 'react';
import uniqueId from 'lodash/uniqueId';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { View, FlatList, InteractionManager } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

// Import actions.
import * as ordersActions from '../actions/ordersActions';

// Components
import Spinner from '../components/Spinner';
import EmptyList from '../components/EmptyList';
import OrderListItem from '../components/OrderListItem';
import * as nav from '../services/navigation';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

class Orders extends Component {
  static propTypes = {
    ordersActions: PropTypes.shape({
      login: PropTypes.func,
    }),
    orders: PropTypes.shape({
      fetching: PropTypes.bool,
      items: PropTypes.arrayOf(PropTypes.object),
    }),
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { ordersActions } = this.props;
    InteractionManager.runAfterInteractions(() => {
      ordersActions.fetch();
    });
  }

  renderList = () => {
    const { orders } = this.props;

    if (orders.fetching) {
      return null;
    }

    return (
      <FlatList
        keyExtractor={(item, index) => `order_${index}`}
        data={orders.items}
        ListEmptyComponent={<EmptyList />}
        renderItem={({ item }) => (
          <OrderListItem
            key={uniqueId('oreder-i')}
            item={item}
            onPress={() => {
              nav.pushOrderDetail(this.props.componentId, {
                orderId: item.order_id,
              });
            }}
          />
        )}
      />
    );
  };

  render() {
    const { orders } = this.props;
    if (orders.fetching) {
      return <Spinner visible />;
    }

    return <View style={styles.container}>{this.renderList()}</View>;
  }
}

export default connect(
  (state) => ({
    orders: state.orders,
  }),
  (dispatch) => ({
    ordersActions: bindActionCreators(ordersActions, dispatch),
  }),
)(Orders);
