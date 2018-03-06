import React from 'react';
import {  Button, Text }  from 'native-base';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions, ActionConst } from 'react-native-router-flux';

import ReduxActions from "../redux/actions";

import Theme from '../constants/Theme';
import Layout from '../constants/Layout';
import Session from '../services/Session';

class LogoutButton extends React.Component {
  render(){
    return (
      <Button danger onPress={ _=> this.destroySession() } style={Layout.marginVertical}>
        <Text>Logout</Text>
      </Button>
    );
  }

  destroySession(){
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
  }
}


function mapDispatchToProps(dispatch, ownProps){
  let { userActions, fieldGroupsActions } = ReduxActions;
  return {
    actions: bindActionCreators(Object.assign({}, userActions, fieldGroupsActions), dispatch)
  };
}


export default connect(({currentUser}) => ({currentUser}), mapDispatchToProps)(LogoutButton)
