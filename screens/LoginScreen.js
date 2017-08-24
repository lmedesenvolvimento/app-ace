import React from 'react';
import { StyleSheet, Text, ScrollView, View } from 'react-native';
import { Actions } from 'react-native-router-flux';

import { Button, FormInput, FormLabel } from 'react-native-elements';

import Theme from '../constants/Theme';
import Layout from '../constants/Layout';

import Session from '../constants/Session';
import FireBaseApp from '../constants/FirebaseApp';

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
      .then( data => this._signInWithEmailAndPasswordSuccess(data))
      .catch(this._signInWithEmailAndPasswordFail)
  }

  _signInWithEmailAndPasswordSuccess(user){
    Session.create(user, this.state.password)
    Actions.authorized({user})
  }

  _signInWithEmailAndPasswordFail(error){
    let errorCode = error.code;
    let errorMessage = error.message;
    console.warn(error);
  }
}



const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
  }
};
