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
  Tab,
  Tabs,
  TabHeading,
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

class LocationScreen extends React.Component {
  state = {
    locations: []
  }

  // persistence
  locations = [
    { name: "33", checked: false },
    { name: "34", checked: false },
    { name: "35", checked: false },
    { name: "36", checked: false },
    { name: "37", checked: false },
    { name: "38", checked: true },
    { name: "39", checked: true }
  ];

  constructor(props) {
    super(props);
  }

  componentDidMount(){
    this.setState({ locations: this.locations })
  }

  render() {
    let { currentUser } = this.props;

    return (
      <Container>
        <Header hasTabs={true} style={{ zIndex: 9 }}>
          <Left>
            <Button transparent onPress={()=> Actions.pop()}>
              <Icon name='md-arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title>{ this.props.title }</Title>
          </Body>
          <Right>
            <Button transparent onPress={()=> this.searchBar.show()}>
              <Icon android="md-search" ios="ios-search" />
            </Button>
          </Right>
          <SearchBar
            ref={(ref) => this.searchBar = ref}
            data={this.locations}
            animate={false}
            placeholder="Pesquisar"
            handleSearch={(q)=> this._handleSearch(q)}
            onBack={ ()=> this._onSearchExit() } />
        </Header>
        <Tabs>
          <Tab heading={ <TabHeading><Text>A VISITAR</Text></TabHeading>}>
            <Content padder>
              <List dataArray={_.filter(this.state.locations, { checked: false })} renderRow={this.renderItem} />
            </Content>
          </Tab>
          <Tab heading={ <TabHeading><Text>VISITADAS</Text></TabHeading>}>
            <Content padder>
              <List dataArray={_.filter(this.state.locations, { checked: true })} renderRow={this.renderItem} />
            </Content>
          </Tab>
        </Tabs>
      </Container>
    );
  }

  renderItem(location){
    return(
      <ListItem icon onPress={()=> false} style={Layout.listHeight}>
        <Left>
          <MaterialIcons name='location-on' size={28} color={Colors.iconColor} />
        </Left>
        <Body style={Layout.listItemBody}>
          <Text>Nº {location.name}</Text>
          <Text note>Localização</Text>
        </Body>
      </ListItem>
    );
  }

  _onSearchExit(){
    this.setState({locations: this.locations});
    this.searchBar.hide()
  }

  _handleSearch(q){
    // Use Lodash regex for get match locations
    let result = _.filter(this.locations, (i)=> _.isMatch(i.name, q));
    this.setState({locations:  result})
  }
}

export default connect(({currentUser}) => ({currentUser}))(LocationScreen);
