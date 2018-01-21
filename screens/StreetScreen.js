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

import SearchBar from 'react-native-searchbar';

import { MaterialIcons } from '@expo/vector-icons';

import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import Theme from '../constants/Theme';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import Session from '../services/Session';

import LogoutButton from '../components/LogoutButton';

import * as _ from "lodash";

class StreetScreen extends React.Component {
  state = {
    items: []
  }

  // persistence
  items = ["Assunção", "Ana Bilhar", "Antônio Augusto", "Azevedo Bolão", "Benjamin Franklin", "Bezerra de Meneses"];

  constructor(props) {
    super(props);
  }

  componentDidMount(){
    this.setState({ items: this.items })
  }

  render() {
    let { currentUser } = this.props;

    return (
      <Container>
        <Header style={{ zIndex: 9 }}>
          <Left>
            <Button transparent onPress={()=> Actions.pop()}>
              <Icon name='md-arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title>{this.props.title}</Title>
          </Body>
          <Right>
            <Button transparent onPress={()=> this.searchBar.show()}>
              <Icon android="md-search" ios="ios-search" />
            </Button>
          </Right>
          <SearchBar
            ref={(ref) => this.searchBar = ref}
            data={this.items}
            animate={false}
            placeholder="Pesquisar"
            handleSearch={(q)=> this._handleSearch(q)}
            onBack={ ()=> this._onSearchExit() } />
        </Header>
        <Content padder>
          <List dataArray={this.state.items} renderRow={this.renderItem} />
        </Content>
        <Fab
          direction="up"
          position="bottomRight"
          style={{ backgroundColor: Colors.accentColor }}
          onPress={() => Actions.newZoneModal({hide: false})}>
          <MaterialIcons name="location-on" size={24} />
        </Fab>
      </Container>
    );
  }

  renderItem(item){
    return(
      <ListItem icon onPress={()=> Actions.location({location: item, title: item})} style={Layout.listHeight}>
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

  _onSearchExit(){
    this.setState({items: this.items});
    this.searchBar.hide()
  }

  _handleSearch(q){
    // Use Lodash regex for get match items
    let result = _.filter(this.items, (i)=> _.isMatch(i, q));
    this.setState({items:  result})
  }
}

export default connect(({currentUser}) => ({currentUser}))(StreetScreen);
