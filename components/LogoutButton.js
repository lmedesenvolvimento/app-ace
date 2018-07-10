import React from 'react';
import { Alert } from 'react-native';
import { Button, Text }  from 'native-base';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions, ActionConst } from 'react-native-router-flux';

import ReduxActions from '../redux/actions';

import Layout from '../constants/Layout';
import Session from '../services/Session';
import { simpleToast } from '../services/Toast';

class LogoutButton extends React.Component {
  render(){
    return (
      <Button danger disabled={!this.props.network.isConnected} onPress={this.onPressLogout.bind(this)} style={Layout.marginVertical}>
        <Text>Sair</Text>
      </Button>
    );
  }

  onPressLogout(){
    return Alert.alert(
      'Confirmação',
      'Você deseja realmente sair?',
      [
        {text: 'Não',  style: 'cancel'},
        {text: 'Sim', onPress: this.destroySession.bind(this) },
      ],
      { cancelable: false }
    );
  }

  destroySession(){
    let { network } = this.props;
    if (network.isConnected){
      let emptyArray = [];
      // Clear Credential
      Session.Credential.destroy();
      // Force Clear -- use in development
      // Session.Storage.destroy(this.props.currentUser.data.email);
      // Return to login screen
      Actions.unauthorized({type: ActionConst.RESET});
      // Clear States
      this.props.actions.setUser({});
      this.props.actions.setFieldGroups(emptyArray);
    } else{
      simpleToast('Para deslogar da sua conta é nescessário estar conectado a internet');
    }
  }
}


function mapDispatchToProps(dispatch){
  let { userActions, fieldGroupsActions } = ReduxActions;
  return {
    actions: bindActionCreators(Object.assign({}, userActions, fieldGroupsActions), dispatch)
  };
}


export default connect(({ currentUser, network }) => ({ currentUser, network}), mapDispatchToProps)(LogoutButton)
