import Expo from 'expo';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import FireBaseApp from './constants/FirebaseApp';
import Session from './constants/Session';

import Navigator from './navigation/Navigator';

class MainApplication extends React.Component {
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
    await Session.get().then((user) => {
      if(user)
        this.setState({isAuthorized: true})
    })
    this.setState({isReady: true})
  }
}

Expo.registerRootComponent(MainApplication);
