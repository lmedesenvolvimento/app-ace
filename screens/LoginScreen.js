import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';

import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import {
  Container,
  Content,
  Button,
  Text,
  Form,
  Item,
  Input,
  Label
} from 'native-base';

import Theme from '../constants/Theme';
import Layout from '../constants/Layout';

import Auth from '../services/Auth';
import Session from '../services/Session';

import UserCallbacks from '../hooks/UserCallbacks';

class LoginScreen extends React.Component {
  state = {
    email: '',
    password: ''
  }
  render() {
    return (
      <Container>
        <Content padder>
          <Form>
            <Item floatingLabel>
              <Label>Email</Label>
              <Input autofocus onChangeText={ email => this.setState({email}) } />
            </Item>
            <Item floatingLabel>
              <Label>Password</Label>
              <Input secureTextEntry={true} onChangeText={ password => this.setState({password}) } />
            </Item>
          </Form>
          <Button block onPress={ _=> this.login() } style={Layout.marginVertical}>
            <Text>Login</Text>
          </Button>
        </Content>
      </Container>
    );
  }

  login() {
    Auth.sign_in(this.state.email, this.state.password).then(UserCallbacks.signInWithEmailAndPasswordSuccess, )
  }
}

const styles = {
  container: {
    flex: 1,
    paddingVertical: 86
  }
}

export default connect(({network}) => ({network}))(LoginScreen)
