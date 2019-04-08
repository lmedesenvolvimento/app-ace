import Expo from 'expo';
import Constants from 'expo-constants';
import React from 'react';
import { View } from 'react-native';

import {
  Header,
  Container,
  Content,
  Text,
  Body,
  Button,
  List,
  ListItem
} from 'native-base';

import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import Theme from '../constants/Theme';
import Layout from '../constants/Layout';
import Session from '../services/Session';

import LogoutButton from '../components/LogoutButton';

class AboutScreen extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let { manifest } = Constants;
    return (
      <Container style={Layout.padding}>
        <View style={Layout.marginVertical8}>
          <Text>{manifest.name}</Text>
          <Text note>{manifest.version}</Text>
        </View>

        <View style={Layout.marginVertical8}>
          <Text>Descrição</Text>
          <Text note>{manifest.description || "Sem descrição"}</Text>
        </View>

        <View style={Layout.marginVertical8}>
          <Text>Autor</Text>
          <Text note>Laboratório de Mídias Educacional</Text>
        </View>
      </Container>
    );
  }
}

export default connect(({network}) => ({network}))(AboutScreen)
