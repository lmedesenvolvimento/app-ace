import React from 'react';
import { Actions, ActionConst } from 'react-native-router-flux';
import {  Button, Text }  from 'native-base';

import Theme from '../constants/Theme';
import Layout from '../constants/Layout';
import Session from '../services/Session';

export default class LogoutButton extends React.Component {
  render(){
    return (
      <Button block onPress={ _=> this.destroySession() } style={Layout.marginVertical}>
        <Text>Sair</Text>
      </Button>
    );
  }

  destroySession(){
    Session.Credential.destroy()
    Actions.unauthorized({type: ActionConst.RESET})
  }
}
