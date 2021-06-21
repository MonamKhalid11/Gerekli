import React from 'react';
import { bindActionCreators } from 'redux';
import { connect, RootStateOrAny } from 'react-redux';
import { View, ScrollView, Text } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import i18n from '../../utils/i18n';

// Components
import BottomActions from '../../components/BottomActions';

// Actions
import * as productsActions from '../../actions/vendorManage/productsActions';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$grayColor',
  },
  scrollContainer: {
    paddingBottom: 14,
  },
});

/**
 * Renders pricing inventory screen.
 *
 * @reactProps {object} stepsData - Data from previous steps of create product flow.
 * @reactProps {object} productsActions - Products actions.
 * @reactProps {object} product - Product information.
 */
export const Features: React.FC = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text>we</Text>
      </ScrollView>
      <BottomActions onBtnPress={() => console.log('im here')} />
    </View>
  );
};

export default connect(
  (state: RootStateOrAny) => ({
    product: state.vendorManageProducts.current,
  }),
  (dispatch) => ({
    productsActions: bindActionCreators(productsActions, dispatch),
  }),
)(Features);
