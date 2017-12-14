import Expo from 'expo';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Provider } from 'react-redux';

import Store, { configureStore } from './constants/Store';
import FireBaseApp from './constants/FirebaseApp';

import Auth from './services/Auth';
import Session from './services/Session';
import Network from './services/Network';

import Navigator from './navigation/Navigator';

export default class MainApplication extends React.Component {
  state = {
    isAuthorized: false,
    isReady: false
  }

  componentWillMount(){
    this._cacheResourcesAsync();
  }

  render(){
    if(this.state.isReady){
      return <Navigator authorized={this.state.isAuthorized}/>;
    } else{
      return <Expo.AppLoading/>;
    }
  }

  async _cacheResourcesAsync(){
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

Expo.registerRootComponent(MainApplication);
