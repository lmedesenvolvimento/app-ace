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
    // Clear Credential
    Session.Credential.destroy()
    // Clear Storage
    Session.Storage.destroy(this.props.currentUser.email)
    Session.Storage.cache = null
    // Clear States
    this.props.setFieldGroups(new Array())
    // Return to login screen
    Actions.unauthorized({type: ActionConst.RESET})
  }
}


function mapDispatchToProps(dispatch, ownProps){
  return bindActionCreators(ReduxActions.fieldGroupsActions, dispatch);
}


export default connect(({currentUser}) => ({currentUser}), mapDispatchToProps)(LogoutButton)
