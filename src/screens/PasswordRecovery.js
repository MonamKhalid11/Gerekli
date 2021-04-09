import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Navigation } from 'react-native-navigation';
import i18n from '../utils/i18n';
import { iconsMap } from '../utils/navIcons';

// Import actions.
import * as authActions from '../actions/authActions';

const styles = EStyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  input: {
    padding: 5,
    borderWidth: 1,
    borderColor: '$mediumGrayColor',
    borderRadius: '$borderRadius',
    width: '100%',
    height: 40,
    fontSize: '1rem',
  },
  button: {
    marginTop: 20,
    borderRadius: '$borderRadius',
    width: 150,
    paddingVertical: 7,
    backgroundColor: '#4fbe31',
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: '1rem',
  },
  email: {
    fontWeight: 'bold',
  },
  helpText: {
    marginTop: 10,
    color: '#0000FF',
  },
  tryAgainWrapper: {
    width: '100%',
  },
  tryAgainText: {
    fontSize: '1rem',
    textAlign: 'left',
    marginBottom: 10,
  },
});

const PasswordRecovery = ({ componentId, authActions }) => {
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
  const [screen, setScreen] = useState('recovery');
  const [codeDidntCome, setCodeDidntCome] = useState(false);

  const resetPasswordHandler = async () => {
    const status = await authActions.resetPassword({ email });
    if (status) {
      setScreen('login');
    }
  };

  const loginWithOneTimePasswordHandler = () => {
    authActions.loginWithOneTimePassword({ email, oneTimePassword });
  };

  const codeDidntComeHandler = () => {
    setScreen('recovery');
    setCodeDidntCome(true);
  };

  return (
    <View style={styles.container}>
      {screen === 'recovery' ? (
        <>
          {codeDidntCome && (
            <View style={styles.tryAgainWrapper}>
              <Text style={styles.tryAgainText}>Try again:</Text>
            </View>
          )}
          <TextInput
            value={email}
            placeholder={'Email'}
            style={styles.input}
            onChangeText={(value) => {
              setEmail(value);
            }}
          />
          <TouchableOpacity
            onPress={resetPasswordHandler}
            style={styles.button}>
            <Text style={styles.buttonText}>{i18n.t('Recovery')}</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput
            value={oneTimePassword}
            placeholder={'Code'}
            style={styles.input}
            onChangeText={(value) => setOneTimePassword(value)}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={loginWithOneTimePasswordHandler}>
            <Text style={styles.buttonText}>{i18n.t('Login')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={codeDidntComeHandler}>
            <Text style={styles.helpText}>
              {i18n.t(`Didn't receive the code?`)}
            </Text>
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
