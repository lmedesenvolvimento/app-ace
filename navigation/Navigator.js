import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { connect, Provider } from 'react-redux';
import { Actions, Router, Scene } from 'react-native-router-flux';

import Store, { configureStore } from '../constants/Store';

import Session from '../services/Session';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';

const RouterWithRedux = connect()(Router);

Store.instance = configureStore()

class Navigator extends Component {

  scenes = Actions.create(
    <Scene key="root" hideNavBar>
      <Scene key="unauthorized" initial={!this.props.authorized}>
        <Scene key="login"
          component={LoginScreen}
          title="Login"
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
  );


  constructor(props){
    super(props);
  }

  render(){
    return(
      <View style={styles.container}>
        <Provider store={Store.instance}>
          <RouterWithRedux scenes={this.scenes}></RouterWithRedux>
        </Provider>
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
