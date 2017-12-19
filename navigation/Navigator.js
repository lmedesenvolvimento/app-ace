import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { connect, Provider } from 'react-redux';

import {
  Actions,
  Drawer,
  Router,
  Scene,
  Stack
} from 'react-native-router-flux';

import Colors from '../constants/Colors';
import Store, { configureStore } from '../constants/Store';

import Session from '../services/Session';

import MainMenu from './layout/MainMenu';
import MenuButton from './layout/MenuButton';

import LoginScreen from '../screens/LoginScreen';
import AboutScreen from '../screens/AboutScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';

const RouterWithRedux = connect()(Router);

Store.instance = configureStore()

class Navigator extends Component {

  scenes = Actions.create(
    <Scene key="root" hideNavBar>
      <Scene key="unauthorized" type="replace" initial={!this.props.authorized} hideNavBar>
        <Stack>
          <Scene key="login"
            component={LoginScreen}
            title="Login"
            />
        </Stack>
      </Scene>
      <Scene key="authorized" type="replace" initial={this.props.authorized} hideNavBar>
        <Drawer
          key="drawer"
          hideNavBar
          contentComponent={MainMenu}
          drawerWidth={300}
          navigationBarStyle={styles.navigationBarStyle}
          titleStyle={styles.navTitleStyle}
          renderLeftButton={() => <MenuButton /> }>
            <Scene
              key="home"
              component={HomeScreen}
              type="replace"
              title="Home" />
            <Scene
              key="about"
              component={AboutScreen}
              title="About" />
            <Scene
              key="profile"
              component={ProfileScreen}
              title="Perfil" />
        </Drawer>
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
  navigationBarStyle: {
    backgroundColor: Colors.primaryColor,
  },
  navTitleStyle: {
    color: 'white'
  }
});
