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
      <ListItem icon onPress={()=> false} style={styles.listHeight}>
        <Left>
          <Icon name='map' size={36} />
        </Left>
        <Body style={styles.itemBody}>
          <Text>{item}</Text>
          <Text note>Município</Text>
        </Body>
        <View style={styles.itemChevron}>
          <MaterialIcons name="chevron-right" size={24} style={{ color: Theme.listBorderColor }} />
        </View>
      </ListItem>
    );
  }
}

const styles = {
  listHeight:{
    height: 64,
  },
  itemBody: {
    height: 51,
    paddingBottom: 16
  },
  itemChevron:{
    height: 51,
    borderBottomWidth: Theme.borderWidth,
    borderBottomColor: Theme.listBorderColor,
    paddingHorizontal: 8,
    alignItems: 'flex-end',
    justifyContent: 'center',
  }
}

export default connect(({network, currentUser}) => ({network, currentUser}))(HomeScreen)
