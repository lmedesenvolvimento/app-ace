import React from 'react';
import { StyleSheet, View, Image } from 'react-native';

import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import {
  Container,
  Content,
  Button,
  Text,
  Title,
  Left,
  Right,
  Body,
  Form,
  Item,
  Input,
  Label,
  Icon,
  Spinner
} from 'native-base';

import Theme from '../constants/Theme';
import Layout from '../constants/Layout';
import Colors from '../constants/Colors';
import Store from '../constants/Store';

import Auth from '../services/Auth';
import Session from '../services/Session';

import UserCallbacks from '../hooks/UserCallbacks';

import * as AuthActions from '../redux/actions/auth_actions';

class LoginScreen extends React.Component {
  state = {
    email: '',
    emailValid: true,
    password: '',
    passwordValid: true
  }

  render() {
    let { auth } = this.props;

    return (
      <Container>
        <Content padder>
          <View style={[Layout.padding, styles.imgContainer]}>
            <Image source={require('../assets/images/aedes_em_foco.png')} style={styles.img} />
          </View>
          <Form style={{ flex: 1 }}>
            <Item inlineLabel error={!this.state.emailValid}>
              <Label>Email</Label>
              <Input autofocus onChangeText={ email => this.setState({email}) } keyboardType='email-address' disabled={auth.waiting} />
              { !this.state.emailValid ? <Icon name='close-circle' /> : null }
            </Item>
            <Item inlineLabel error={!this.state.passwordValid}>
              <Label>Password</Label>
              <Input secureTextEntry={true} onChangeText={ password => this.setState({password}) } disabled={auth.waiting} />
              { !this.state.passwordValid ? <Icon name='close-circle' /> : null }
            </Item>
          </Form>
        </Content>
        <Button iconLeft block onPress={ _=> this.login() } disabled={auth.waiting}>
          <Left>
            { auth.waiting ? <Spinner color="#fff" style={styles.spinner}/> : null }
          </Left>
          <Text>Login</Text>
          <Right/>
        </Button>
      </Container>
    );
  }

  login() {
    // Validate Form
    let emailIsValid    = this.state.email.length === 0 ? false : true;
    let passwordIsValid = this.state.password.length === 0 ? false : true;

    this.setState({ emailValid: emailIsValid, passwordValid: passwordIsValid });

    if(!emailIsValid || !passwordIsValid){
      return false;
    }
    // Submit Authentication
    Store.instance.dispatch(AuthActions.toWaiting());
    Auth.sign_in(this.state.email, this.state.password).then(UserCallbacks.signInWithEmailAndPasswordSuccess, UserCallbacks.signInWithEmailAndPasswordFail)
  }
}

const styles = {
  container: {
    flex: 1,
    paddingVertical: 86
  },
  imgContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxHeight: 256,
  },
  img: {
    width: 256,
    height: 256,
    resizeMode: Image.resizeMode.contain
  },
  buttonTitle: {
    textTransform: 'uppercase'
  },
  spinner: {
    marginLeft: 8
  }
}

export default connect(({auth}) => ({auth}))(LoginScreen)
