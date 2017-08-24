import React from 'react';
import { StyleSheet, Text, ScrollView, View } from 'react-native';
import { Actions } from 'react-native-router-flux';

import { Button, FormInput, FormLabel } from 'react-native-elements';

import Layout from "../constants/Layout";
import Theme from "../constants/Theme";

import Session from "../constants/Session";

import FireBaseApp from '../constants/FirebaseApp';

export default class RegisterScreen extends React.Component {
  state = {
    email: '',
    password: ''
  }
  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={Layout.grid}>
          <View style={Layout.col}>
            <FormLabel>Email</FormLabel>
            <FormInput inputStyle={Theme.formInput} placeholder="your@email.com" onChangeText={ email => this.setState({email}) }></FormInput>
            <FormLabel>Password</FormLabel>
            <FormInput inputStyle={Theme.formInput} placeholder="Password" secureTextEntry={true} onChangeText={ password => this.setState({password}) }></FormInput>
            <Button buttonStyle={Theme.btnPrimary} raised title="Enviar" onPress={ _=> this.register() }></Button>
          </View>
        </ScrollView>
      </View>
    );
  }

  register() {
    FireBaseApp.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then( user => this._createUserWithEmailAndPasswordSuccess(user) )
      .catch(this._createUserWithEmailAndPasswordFail)
  }

  _createUserWithEmailAndPasswordSuccess(user){
    Session.create(user, this.state.password)
    Actions.home({user})
  }

  _createUserWithEmailAndPasswordFail(error){
    let errorCode = error.code;
    let errorMessage = error.message;
    if (errorCode == 'auth/weak-password') {
      alert('The password is too weak.');
    } else {
      alert(errorMessage);
    }
    console.log(error);
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
