import React from 'react';
import { Header, Container, Content, Text, Button } from 'native-base';

import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import Theme from '../constants/Theme';
import Layout from '../constants/Layout';
import Session from '../services/Session';

import LogoutButton from '../components/LogoutButton';

class HomeScreen extends React.Component {
  state = {
    currentUser: null
  }

  constructor(props) {
    super(props);
  }

  componentDidMount(){
    this.setState({ currentUser: Session.currentUser })
  }

  render() {
    return (
      <Container>
        <Content padder>
          <Text> Is Connected: {this.props.network.isConnected}</Text>
          <LogoutButton />
        </Content>
      </Container>
    );
  }
}

export default connect(({network}) => ({network}))(HomeScreen)
