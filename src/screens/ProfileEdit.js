import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import omit from 'lodash/omit';

// Import actions.
import * as authActions from '../actions/authActions';

// Components
import Spinner from '../components/Spinner';
import ProfileForm from '../components/ProfileForm';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

/**
 * Renders profile edit screen.
 *
 * @reactProps {object} authActions - Auth actions.
 */
export class ProfileEdit extends Component {
  /**
   * @ignore
   */
  static propTypes = {
    authActions: PropTypes.shape({
      registration: PropTypes.func,
    }),
  };

  /**
   * @ignore
   */
  constructor(props) {
    super(props);

    this.state = {
      fetching: true,
      profile: {},
      forms: [],
    };
  }

  /**
   * Gets user profile, sets it to state.
   */
  componentDidMount() {
    const { authActions } = this.props;

    authActions.fetchProfile().then((profile) => {
      this.setState({
        profile,
        fetching: false,
        forms: profile.fields,
      });
    });
  }

  /**
   * Saves update user profile data.
   *
   * @param {object} values - Updated user profile data.
   */
  handleSave = (values) => {
    const { profile } = this.state;
    const { authActions, componentId, settings } = this.props;
    if (values) {
      authActions.updateProfile(
        profile.user_id,
        values,
        componentId,
        settings.dateFormat,
      );
    }
  };

  /**
   * Renders component
   *
   * @return {JSX.Element}
   */
  render() {
    const { fetching, forms } = this.state;
    const { settings } = this.props;

    if (fetching) {
      return (
        <View style={styles.container}>
          <Spinner visible />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <ProfileForm
          fields={omit(forms, 'B')}
          isEdit
          onSubmit={(values) => this.handleSave(values)}
          dateFormat={settings.dateFormat}
        />
      </View>
    );
  }
}

export default connect(
  (state) => ({
    auth: state.auth,
    settings: state.settings,
  }),
  (dispatch) => ({
    authActions: bindActionCreators(authActions, dispatch),
  }),
)(ProfileEdit);
