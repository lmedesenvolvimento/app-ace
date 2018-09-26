import Expo from 'expo';
import React from 'react';

// import Sentry from 'sentry-expo';

import { StyleSheet } from 'react-native';

import { StyleProvider, getTheme } from 'native-base';

import Theme from './constants/Theme';

import Auth    from './services/Auth';
import Session from './services/Session';
import { getLocationAsync } from './services/Permissions';
import { simpleToast } from './services/Toast';

import Navigator from './navigation/Navigator';

import { watchConnection } from './services/Network';

export default class App extends React.Component {  
  constructor(props){
    super(props);
    
    this.state = {
      isAuthorized: false,
      isReady: false
    }    
  }

  componentWillMount(){
    this._cacheResourcesAsync();
  }

  render() {
    if(this.state.isReady){
      return (
        <StyleProvider style={getTheme(Theme)}>
          <Navigator authorized={this.state.isAuthorized}></Navigator>
        </StyleProvider>
      );
    } else{
      return <Expo.AppLoading/>;
    }
  }

  async _cacheResourcesAsync(){
    // Start Network Observer
    watchConnection();

    // Remove this once Sentry is correctly setup.
    // Sentry.enableInExpoDevelopment = true;

    // Sentry.config('https://d372673b4ed44d82a8ab68bd308f54cf@sentry.io/1274743').install();

    let user;

    await Expo.Font.loadAsync({
      'Arial': require('./assets/fonts/arial.ttf'),
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
      'Ionicons': require("@expo/vector-icons/fonts/Ionicons.ttf"),
      'MaterialIcons': require("@expo/vector-icons/fonts/MaterialIcons.ttf")
    });
    
    // Permissions
    await getLocationAsync().catch(error => {
      simpleToast(error.message);
    });

    Session.Credential.get().then((user) => {
      if(user){
        try {
          Auth.configCredentials(user, () => {
            this.setState({isAuthorized: true, isReady: true});
          });
        } catch (e) {
          this.setState({isReady: true});
        }
      } else{
        this.setState({isReady: true})
      }
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
