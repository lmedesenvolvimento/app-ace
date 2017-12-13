import Expo from 'expo';
import React from 'react';
import { AppState, StyleSheet, Text, View } from 'react-native';

import FireBaseApp from './constants/FirebaseApp';

import Auth from './services/Auth';
import Session from './services/Session';
import Network from './services/Network';

import Navigator from './navigation/Navigator';

export default class MainApplication extends React.Component {
  state = {
    appState: AppState.currentState,
    isAuthorized: false,
    isReady: false
  }

  componentWillMount(){
    this._cacheResourcesAsync();
  }

  componentDidMount(){
    AppState.addEventListener('change', (nextAppState)=> this._handleAppStateChange(nextAppState));
  }

  componentWillUnmount(){
    AppState.removeEventListener('change', (nextAppState)=> this._handleAppStateChange(nextAppState));
  }

  render(){
    if(this.state.isReady){
      return <Navigator authorized={this.state.isAuthorized}/>;
    } else{
      return <Expo.AppLoading/>;
    }
  }

  _handleAppStateChange(nextAppState){
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('Voltando do cochilo!')
    } else if(nextAppState.match(/inactive|background/)){
      console.log('Indo tirar um cochilo!')
    }
    this.setState({appState: nextAppState});
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
