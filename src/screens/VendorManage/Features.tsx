import React, { useEffect, useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect, RootStateOrAny } from 'react-redux';
import { View, ScrollView } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import i18n from '../../utils/i18n';

// Components
import BottomActions from '../../components/BottomActions';
import { ProductFeaturesList } from '../../components/ProductFeaturesList';

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

export const Features: React.FC = ({ productsActions, productId }) => {
  const [productFeatures, setProductFeatures] = useState(null);

  useEffect(() => {
    const getProductFeatures = async () => {
      const result = await productsActions.fetchProductFeatures(productId);
      console.log(result);
      
      // setProductFeatures(result);
    };
    getProductFeatures();
  }, []);

  if (!productFeatures) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ProductFeaturesList productFeatures={productFeatures} />
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
