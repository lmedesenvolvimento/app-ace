import React from 'react';

import { 
  Ionicons, 
  MaterialIcons, 
  FontAwesome, 
  MaterialCommunityIcons 
} from '@expo/vector-icons';

import { AppLoading } from 'expo';

import * as Font from 'expo-font';

import { 
  StyleProvider, 
  getTheme, 
  Container, 
  Col, 
  Grid, 
  Row, 
  Spinner, 
  Text,
} from 'native-base';

import { StyleSheet } from 'react-native';

import Auth from './services/Auth';
import Session from './services/Session';
import { simpleToast } from './services/Toast';
import { getLocationAsync } from './services/Permissions';

import Theme from './constants/Theme';
import Colors from './constants/Colors';
import Store from './constants/Store';

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

  componentDidMount(){
    // Permissions
    getLocationAsync()
      .catch(error => {
      simpleToast(error.message);
    });
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
      return <AppLoading/>;
    }
  }

  async _cacheResourcesAsync(){
    // Start Network Observer
    watchConnection();

    // Remove this once Sentry is correctly setup.
    // Sentry.enableInExpoDevelopment = true;

    // Sentry.config('https://d372673b4ed44d82a8ab68bd308f54cf@sentry.io/1274743').install();

    await Font.loadAsync({
      'Arial': require('./assets/fonts/arial.ttf'),
      'Roboto': require('./assets/fonts/Roboto-Regular.ttf'),
      'Roboto_medium': require('./assets/fonts/Roboto-Medium.ttf'),
      ...Ionicons.font,
      ...MaterialIcons.font,
      ...FontAwesome.font,
      ...MaterialCommunityIcons.icon,
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
