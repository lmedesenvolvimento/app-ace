import React from 'react';
import { View, TouchableHighlight } from 'react-native';

import {
  Header,
  Container,
  Content,
  Text,
  Title,
  Left,
  Right,
  Footer,
  Body,
  Button,
} from 'native-base';


import Layout from '../constants/Layout';
import BaseLightbox from "../components/BaseLightbox";
import Lightbox from 'react-native-lightbox';

import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

class NewZoneModal extends React.Component {
  constructor(props) {
    super(props);
  }

  dismissModal(){
    Actions.pop()
  }

  render() {
    return (
      <Container>
        <Content padder>
          <Text>Demo Lightbox</Text>
          <Text>Allows transparency for background</Text>
        </Content>
        <Footer style={{backgroundColor:"white"}} padder>
          <Left>
            <Button transparent onPress={this.dismissModal}>
              <Text>Cancelar</Text>
            </Button>
          </Left>
          <Right>
            <Button transparent onPress={this.dismissModal}>
              <Text>Novo Logradouro</Text>
            </Button>
          </Right>
        </Footer>
      </Container>
    );
  }
}

export default connect(({currentUser}) => ({network, currentUser}))(NewZoneModal);
