import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Navigation } from 'react-native-navigation';
import i18n from '../utils/i18n';
import { iconsMap } from '../utils/navIcons';

// Import actions.
import * as authActions from '../actions/authActions';

const PasswordRecovery = ({ componentId, authActions, auth }) => {
  useEffect(() => {
    Navigation.mergeOptions(componentId, {
      topBar: {
        title: {
          text: i18n.t('Password recovery'),
        },
        rightButtons: [
          {
            id: 'close',
            icon: iconsMap.close,
          },
        ],
      },
    });

    const navigationButtonEventListener = Navigation.events().registerNavigationButtonPressedListener(
      ({ buttonId }) => {
        if (buttonId === 'close') {
          Navigation.dismissModal(componentId);
        }
      },
    );

    return () => {
      navigationButtonEventListener.remove();
    };
  }, [componentId]);

  const [email, setEmail] = useState('');
  const [oneTimePassword, setOneTimePassword] = useState('');

  const resetPasswordHandler = () => {
    authActions.resetPassword({ email });
  };

  const loginWithOneTimePasswordHandler = () => {
    authActions.loginWithOneTimePassword({ email, oneTimePassword });
  };

  return (
    <View>
      <TextInput
        onChangeText={(value) => {
          setEmail(value);
        }}
      />
      <TouchableOpacity onPress={resetPasswordHandler}>
        <Text>{i18n.t('Send code')}</Text>
      </TouchableOpacity>
      {auth?.resetPasswordStatus === 'completed' && (
        <>
          <TextInput onChangeText={(value) => setOneTimePassword(value)} />
          <TouchableOpacity onPress={loginWithOneTimePasswordHandler}>
            <Text>{i18n.t('Entry')}</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default connect(
  (state) => ({
    auth: state.auth,
  }),
  (dispatch) => ({
    authActions: bindActionCreators(authActions, dispatch),
  }),
)(PasswordRecovery);
