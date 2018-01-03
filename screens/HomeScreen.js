import React from 'react';
import { View } from 'react-native';

import {
  Header,
  Container,
  Content,
  Text,
  Title,
  Left,
  Right,
  Body,
  Button,
  List,
  ListItem,
  Icon
} from 'native-base';

import { MaterialIcons } from '@expo/vector-icons';

import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import Theme from '../constants/Theme';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import Session from '../services/Session';

import LogoutButton from '../components/LogoutButton';

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { currentUser } = this.props;

    let items = ["Quadra 1", "Quadra 2", "Quadra 3"];

    return (
      <Container>
        <Header>
          <Left>
            <Title>Quadras</Title>
          </Left>
        </Header>
        <Content padder>
          <List dataArray={items} renderRow={this.renderItem} />
        </Content>
      </Container>
    );
  }

  renderItem(item){
    return(
      <ListItem icon onPress={()=> Actions.zone({zone: item, title: item})} style={Layout.listHeight}>
        <Left>
          <Icon name='map' size={36} />
        </Left>
        <Body style={Layout.listItemBody}>
          <Text>{item}</Text>
          <Text note>Município</Text>
        </Body>
        <View style={Layout.listItemChevron}>
          <MaterialIcons name="chevron-right" size={24} style={{ color: Theme.listBorderColor }} />
        </View>
      </ListItem>
    );
  }
}

export default connect(({network, currentUser}) => ({network, currentUser}))(HomeScreen)
