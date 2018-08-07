import React from 'react';
import { View, Image } from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ReduxActions from '../redux/actions';

import {
  Container,
  Content,
  Button,
  Text,
  Left,
  Right,
  Form,
  Item,
  Input,
  Label,
  Icon,
  Spinner
} from 'native-base';

import Layout from '../constants/Layout';
import Store from '../constants/Store';

import Auth from '../services/Auth';

import UserCallbacks from '../hooks/UserCallbacks';

import * as AuthActions from '../redux/actions/auth_actions';

class LoginScreen extends React.Component {
  constructor(props){
    super(props);
    
    this.state = {
      email: '',
      emailValid: true,
      password: '',
      passwordValid: true
    };
  }
  
  render() {
    let { auth } = this.props.state;

    return (
      <Container>
        <Content padder>
          <View style={[Layout.padding, styles.imgContainer]}>
            <Image source={ require('../assets/images/aedes_em_foco.png') } style={styles.img} />
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
    Auth
      .sign_in(this.state.email, this.state.password)
      .then(
        UserCallbacks.signInWithEmailAndPasswordSuccess, 
        UserCallbacks.signInWithEmailAndPasswordFail
      );
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
};

function mapStateToProps(state) {
  return {
    state: {
      auth: state.auth,
    }
  };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators(ReduxActions.fieldGroupsActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
