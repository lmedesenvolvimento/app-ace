import React from 'react';
import { StyleSheet, Text, ScrollView, View } from 'react-native';
import { Actions } from 'react-native-router-flux';

import { Button, FormInput, FormLabel } from 'react-native-elements';

import Theme from '../constants/Theme';
import Layout from '../constants/Layout';

import Session from '../constants/Session';
import FireBaseApp from '../constants/FirebaseApp';

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
            <Button buttonStyle={Theme.btn} raised title="Registrar-se" onPress={ _=> Actions.register() }></Button>
          </View>
        </ScrollView>
      </View>
    );
  }

  login() {
    FireBaseApp.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
      .then( data => UserCallbacks.signInWithEmailAndPasswordSuccess(data, this.state.password))
      .catch(UserCallbacks.signInWithEmailAndPasswordFail)
  }
}



const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
  }
};
