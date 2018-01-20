import React, { Component } from 'react';
import { BackHandler, StyleSheet, View, Platform } from 'react-native';
import { connect, Provider } from 'react-redux';

import {
  Actions,
  Drawer,
  Router,
  Scene,
  Stack,
  Modal,
  Lightbox
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

// Location Flux
import StreetScreen from '../screens/StreetScreen';
import NewStreetModal from '../modals/NewStreetModal';
import LocationScreen from '../screens/LocationScreen';

const RouterWithRedux = connect()(Router);

Store.instance = configureStore()

class Navigator extends Component {
  whitelistExitApp = ["_home", "login"]

  constructor(props){
    super(props);
  }

  onBackPress(){
    // Prevent app exit
    if (this.whitelistExitApp.includes(Actions.currentScene) && Actions.state.index === 0) {
      return false;
    }
    Actions.pop();
    return true;
  }

  render(){
    return(
      <View style={styles.container}>
        <Provider store={Store.instance}>
          <RouterWithRedux sceneStyle={styles.sceneStyle} backAndroidHandler={ () => this.onBackPress() }>
            <Modal key="root">
              <Scene key="unauthorized" type="replace" initial={!this.props.authorized} hideNavBar>
                <Stack>
                  <Scene key="login"
                    component={LoginScreen}
                    title="Login"
                    hideNavBar />
                </Stack>
              </Scene>
              <Scene key="authorized" type="replace" initial={this.props.authorized} hideNavBar>
                <Drawer
                  key="drawer"
                  contentComponent={MainMenu}
                  navigationBarStyle={styles.navigationBarStyle}
                  titleStyle={styles.navTitleStyle}
                  drawerOpenRoute='DrawerOpen'
                	drawerCloseRoute='DrawerClose'
                	drawerToggleRoute='DrawerToggle'
                  renderLeftButton={() => <MenuButton /> }>
                  <Scene
                    key="home"
                    component={HomeScreen}
                    title="AEDES em foco">
                  </Scene>
                  <Scene
                    key="about"
                    component={AboutScreen}
                    title="About" />
                  <Scene
                    key="profile"
                    component={ProfileScreen}
                    title="Perfil" />
                </Drawer>

                {/* LOCATIONS SCENES */}
                <Scene
                  key="zone"
                  component={StreetScreen}
                  type="push"
                  hideNavBar />
                <Scene
                  key="location"
                  component={LocationScreen}
                  type="push"
                  hideNavBar />
                {/* END LOCATIONS SCENES */}
              </Scene>

              {/* MODALS*/}
              <Scene key="newZoneModal" component={NewStreetModal} modal title="Novo Logradouro" hideNavBar />
              {/* END MODALS*/}
            </Modal>
          </RouterWithRedux>
        </Provider>
      </View>
    );
  }
}

export default Navigator;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
    backgroundColor: Colors.primaryColor
  },
  navigationBarStyle: {
    backgroundColor: Colors.primaryColor,
  },
  navTitleStyle: {
    color: 'white'
  },
  sceneStyle: {
    backgroundColor: 'white'
  }
});
