import React from 'react';
import {
  Container,
  Content,
  Text,
  Body,
  Button,
  Form,
  Label,
  Item,
  Input
 } from 'native-base';

import { Actions } from 'react-native-router-flux';

import { connect } from 'react-redux';
import { bindActionCreators } from "redux";

import ReduxActions from "../redux/actions";

import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import Session from '../services/Session';

import LogoutButton from '../components/LogoutButton';
import SpinnerLoader from '../components/SpinnerLoader';

class ProfileScreen extends React.Component {
  state = {
    currentUser: null
  }

  constructor(props) {
    super(props);
  }

  componentDidMount(){
    let {state} = this.props;
    this.setState({currentUser: state.currentUser.data})
  }

  render() {
    if(this.state.currentUser){
      return (
        <Container>
          <Content padder>
            <Form>
              <Item stackedLabel>
                <Label>Nome</Label>
                <Input value={this.state.currentUser.name} disabled={true}/>
              </Item>
              <Item stackedLabel>
                <Label>Email</Label>
                <Input value={this.state.currentUser.email} disabled={true} />
              </Item>
            </Form>
            <LogoutButton />
          </Content>
        </Container>
      );
    } else{
      return <SpinnerLoader />
    }
  }
}

function mapStateToProps(state) {
  return {
    state: {
      currentUser: state.currentUser
    }
  }
}

function mapDispatchToProps(dispatch, ownProps){
  return bindActionCreators(ReduxActions.userActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen)
