import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Router, Scene } from 'react-native-router-flux';

import FireBaseApp from '../constants/FirebaseApp';
import Session from '../constants/Session';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';


class Navigator extends Component{
  constructor(props){
    super(props);
  }

  render(){
    return(
      <View style={styles.container}>
        <Router>
          <Scene key="root" hideNavBar>
            <Scene key="unauthorized" initial={!this.props.authorized}>
              <Scene key="login"
                component={LoginScreen}
                title="Login"
                />
              <Scene
                key="register"
                component={RegisterScreen}
                title="Register"
                />
            </Scene>
            <Scene key="authorized" type="replace" initial={this.props.authorized}>
              <Scene
                key="home"
                component={HomeScreen}
                type="replace"
                title="Home"
                />
            </Scene>
          </Scene>
        </Router>
      </View>
    );
  }
}

export default Navigator;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 24,
    backgroundColor: 'white'
  },
});
