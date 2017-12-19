import Expo from 'expo';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { StyleProvider, Button, Text, getTheme } from 'native-base';


import Theme from './constants/Theme';
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

  // render() {
  //   if(this.state.isReady){
  //     return (
  //       <StyleProvider style={getTheme(Theme)}>
  //         <Navigator authorized={this.state.isAuthorized}></Navigator>
  //       </StyleProvider>
  //     );
  //   } else{
  //     return <Expo.AppLoading/>;
  //   }
  // }

  render() {
    return(
      <Text>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Text>
    );
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
