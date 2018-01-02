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
  Icon,
  Fab
} from 'native-base';

import { MaterialIcons } from '@expo/vector-icons';

import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import Theme from '../constants/Theme';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import Session from '../services/Session';

import LogoutButton from '../components/LogoutButton';

class ZoneScreen extends React.Component {
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

    let items = ["Assunção", "Ana Bilhar", "Antônio Augusto", "Azevedo Bolão", "Beljamin Franklin", "Bezerra de Meneses"];

    return (
      <Container>
        <Header>
          <Body>
            <Title>Quadra 1</Title>
          </Body>
        </Header>
        <Content padder>
          <List dataArray={items} renderRow={this.renderItem} />
        </Content>
        <Fab
          direction="up"
          position="bottomRight"
          style={{ backgroundColor: Colors.accentColor }}
          onPress={() => Actions.newZoneModal({error: "Network failed...", hide: false})}>
          <MaterialIcons name="location-on" size={24} />
        </Fab>
      </Container>
    );
  }

  renderItem(item){
    return(
      <ListItem icon onPress={()=> false} style={Layout.listHeight}>
        <Left>
          <MaterialIcons name='location-on' size={28} color={Colors.iconColor} />
        </Left>
        <Body style={Layout.listItemBody}>
          <Text>{item}</Text>
        </Body>
        <View style={Layout.listItemChevron}>
          <MaterialIcons name="chevron-right" size={24} style={{ color: Theme.listBorderColor }} />
        </View>
      </ListItem>
    );
  }
}

export default connect(({network, currentUser}) => ({network, currentUser}))(ZoneScreen);
