import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { View, SafeAreaView } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

// Import actions.
import * as authActions from '../actions/authActions';
// Components
import i18n from '../utils/i18n';
import { iconsMap } from '../utils/navIcons';
import Spinner from '../components/Spinner';
import ProfileForm from '../components/ProfileForm';
import { Navigation } from 'react-native-navigation';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

class Registration extends Component {
  static propTypes = {
    authActions: PropTypes.shape({
      registration: PropTypes.func,
    }),
    showClose: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.state = {
      fetching: true,
      forms: [],
    };
    Navigation.events().bindComponent(this);
  }

  componentDidMount() {
    const { authActions } = this.props;
    authActions.profileFields().then((fields) => {
      this.setState({
        fetching: false,
        forms: fields,
      });
    });

    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        title: {
          text: i18n.t('Registration'),
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

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'close') {
      Navigation.dismissModal(this.props.componentId);
    }
  }

  handleRegister = (values) => {
    const { authActions } = this.props;
    if (values) {
      authActions.createProfile(values);
    }
  };

  render() {
    const { fetching, forms } = this.state;

    if (fetching) {
      return (
        <View style={styles.container}>
          <Spinner visible />
        </View>
      );
    }

    return (
      <SafeAreaView style={styles.container}>
        <ProfileForm
          showTitles={true}
          fields={forms}
          onSubmit={(values) => this.handleRegister(values)}
        />
      </SafeAreaView>
    );
  }
}

export default connect(
  (state) => ({
    auth: state.auth,
  }),
  (dispatch) => ({
    authActions: bindActionCreators(authActions, dispatch),
  }),
)(Registration);
