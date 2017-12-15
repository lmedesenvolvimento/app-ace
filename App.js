import Expo from 'expo';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'native-base';

import Store, { configureStore } from './constants/Store';

import Auth from './services/Auth';
import Session from './services/Session';
import Network from './services/Network';

import Navigator from './navigation/Navigator';

export default class App extends React.Component {
  state = {
    isAuthorized: false,
    isReady: false
  }

  componentWillMount(){
    this._cacheResourcesAsync();
  }

  render() {
    if(this.state.isReady){
      return <Navigator authorized={this.state.isAuthorized} />;
    } else{
      return <Expo.AppLoading/>;
    }
  }

  async _cacheResourcesAsync(){
    await Expo.Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
      'Ionicons': require("@expo/vector-icons/fonts/Ionicons.ttf")
    });

    await Session.Credential.get().then((user) => {
      if(user){
        try {
          Auth.configCredentials(user)
          this.setState({isAuthorized: true, isReady: true});
        } catch (e) {
          this.setState({isReady: true});
        }
      } else{
        this.setState({isReady: true})
      };
    });
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
