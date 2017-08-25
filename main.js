import Expo from 'expo';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import FireBaseApp from './constants/FirebaseApp';
import Session from './constants/Session';

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
    // siginWithCredential
    await Session.get().then((user) => {
      if(user){
        try {
          FireBaseApp.auth().signInWithEmailAndPassword(user.email, user.pass).then( data => {
            this.setState({isAuthorized: true, isReady: true});
          });
        } catch (e) {
          this.setState({isReady: true});
        }
      } else{
        this.setState({isReady: true})
      };
    }) ;
  }
}

Expo.registerRootComponent(MainApplication);
