import React from 'react';
import { StyleSheet, Text, ScrollView, View } from 'react-native';
import { Actions } from 'react-native-router-flux';

import { Button, FormInput, FormLabel } from 'react-native-elements';

import Theme from '../constants/Theme';
import Layout from '../constants/Layout';
import Session from '../services/Session';

import Auth from '../services/Auth';

import UserCallbacks from '../hooks/UserCallbacks';

export default class LoginScreen extends React.Component {
  state = {
    email: '',
    password: ''
  }
  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={Layout.grid}>
          <View style={Layout.col}>
            <FormInput inputStyle={Theme.formInput} placeholder="your@email.com" onChangeText={ email => this.setState({email}) }></FormInput>
            <FormInput inputStyle={Theme.formInput} placeholder="Password" secureTextEntry={true} onChangeText={ password => this.setState({password}) }></FormInput>
            <Button buttonStyle={Theme.btnPrimary} raised title="Login" onPress={ _=> this.login() }></Button>
          </View>
        </ScrollView>
      </View>
    );
  }

  login() {
    Auth.sign_in(this.state.email, this.state.password).then(UserCallbacks.signInWithEmailAndPasswordSuccess, UserCallbacks.signInWithEmailAndPasswordFail)
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
  }
};
