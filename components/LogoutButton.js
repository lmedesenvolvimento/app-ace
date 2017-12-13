import React from 'react';
import { Actions, ActionConst } from 'react-native-router-flux';
import { Button }  from 'react-native-elements';

import Theme from '../constants/Theme';
import Session from '../services/Session';

import FireBaseApp from '../constants/FirebaseApp';

export default class LogoutButton extends React.Component {
  render(){
    return <Button buttonStyle={Theme.btnPrimary} raised title="Sair" onPress={ _=> this.destroySession() }/>;
  }

  destroySession(){
    Session.Credential.destroy()
    Actions.unauthorized({type: ActionConst.RESET})    
  }
}
