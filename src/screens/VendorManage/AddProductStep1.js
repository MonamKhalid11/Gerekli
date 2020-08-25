import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { uniqueId } from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import CheckoutSteps from '../../components/CheckoutSteps';
import Section from '../../components/Section';
import BottomActions from '../../components/BottomActions';
import * as imagePickerActions from '../../actions/imagePickerActions';
import { steps } from '../../services/vendors';
import * as nav from '../../services/navigation';
import i18n from '../../utils/i18n';
import { Navigation } from 'react-native-navigation';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$grayColor',
  },
  scrollContainer: {
    paddingBottom: 14,
  },
  emptyList: {
    textAlign: 'center',
  },
  header: {
    marginLeft: 14,
    marginTop: 14,
  },
  imageWrapper: {
    position: 'relative',
  },
  containerStyle: {
    marginTop: 0,
    marginBottom: 22,
  },
  sectionText: {
    color: '$primaryColor',
  },
});

const IMAGE_NUM_COLUMNS = 4;

class AddProductStep1 extends Component {
  static propTypes = {
    images: PropTypes.arrayOf(PropTypes.string),
    imagePickerActions: PropTypes.shape({
      clear: PropTypes.func,
    }),
  };

  componentDidMount() {
    // const { imagePickerActions } = this.props;
    // imagePickerActions.clear();
  }

  handleGoNext = () => {
    const { images, category_ids } = this.props;
    nav.pushVendorManageAddProductStep2(this.props.componentId, {
      stepsData: {
        images,
        category_ids,
      },
    });
  };

  handleRemoveImage = (imageIndex) => {
    const { imagePickerActions, images } = this.props;
    const newImages = [...images];
    newImages.splice(imageIndex, 1);
    imagePickerActions.toggle(newImages);
    Navigation.dismissModal(this.props.componentId);
  };

  renderHeader = () => {
    return (
      <View>
        <View style={styles.header}>
          <CheckoutSteps step={0} steps={steps} />
        </View>
        <Section containerStyle={styles.containerStyle}>
          <TouchableOpacity
            onPress={() => {
              nav.showImagePicker();
            }}>
            <Text style={styles.sectionText}>{i18n.t('Select image')}</Text>
          </TouchableOpacity>
        </Section>
      </View>
    );
  };

  renderEmptyList = () => (
    <Text style={styles.emptyList}>{i18n.t('There are no images')}</Text>
  );

  renderImage = (image) => {
    const IMAGE_WIDTH = Dimensions.get('window').width / IMAGE_NUM_COLUMNS;

    return (
      <TouchableOpacity
        style={styles.imageWrapper}
        key={uniqueId('image-')}
        onPress={() => {
          nav.showGallery({
            images: [image.item],
            activeIndex: 1,
            onRemove: () => this.handleRemoveImage(image.index),
          });
        }}>
        <Image
          style={{
            width: IMAGE_WIDTH,
            height: IMAGE_WIDTH,
          }}
          source={{ uri: image.item }}
        />
      </TouchableOpacity>
    );
  };

  render() {
    const { images } = this.props;
    return (
      <View style={styles.container}>
        <FlatList
          contentContainerStyle={styles.scrollContainer}
          data={images}
          keyExtractor={(item) => item}
          ListHeaderComponent={() => this.renderHeader()}
          numColumns={IMAGE_NUM_COLUMNS}
          renderItem={this.renderImage}
          ListEmptyComponent={() => this.renderEmptyList()}
        />
        <BottomActions
          onBtnPress={this.handleGoNext}
          btnText={i18n.t('Next')}
        />
      </View>
    );
  }
}

export default connect(
  (state) => ({
    images: state.imagePicker.selected,
  }),
  (dispatch) => ({
    imagePickerActions: bindActionCreators(imagePickerActions, dispatch),
  }),
)(AddProductStep1);
