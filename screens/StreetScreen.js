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
import { bindActionCreators } from "redux";
import { Actions } from 'react-native-router-flux';

import ReduxActions from "../redux/actions";

import Theme from '../constants/Theme';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import Session from '../services/Session';

import LogoutButton from '../components/LogoutButton';

import * as _ from "lodash";

class StreetScreen extends React.Component {
  state = {
    public_areas: []
  }
  constructor(props) {
    super(props);
  }

  componentDidMount(){
    this.setState({public_areas: this._getFieldGroup()});
  }

  componentWillReceiveProps(){
    setTimeout(() => {
      this.setState({public_areas: this._getFieldGroup()});
    }, 200)
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
            data={this.public_areas}
            animate={false}
            placeholder="Pesquisar"
            handleSearch={(q)=> this._handleSearch(q)}
            onBack={ ()=> this._onSearchExit() } />
        </Header>
        <Content padder>
          <List
            dataArray={ this.state.public_areas }
            renderRow={ (item, sectionID, rowID) => this.renderItem(item, sectionID, rowID) }
            style={Layout.listMargin} />
        </Content>
        <Fab
          direction="up"
          position="bottomRight"
          style={{ backgroundColor: Colors.accentColor }}
          onPress={() => Actions.newStreetModal({hide: false, zone: this.props.zone, zoneIndex: this.props.zoneIndex})}>
          <MaterialIcons name="location-on" size={24} />
        </Fab>
      </Container>
    );
  }

  renderItem(item, sectionID, rowID){
    return(
      <ListItem
        icon
        onPress={()=> Actions.location({street: item, title: item.address, streetIndex: rowID, parent: this.props })}
        style={Layout.listHeight}>
        <Left>
          <MaterialIcons name='location-on' size={28} color={Colors.iconColor} />
        </Left>
        <Body style={Layout.listItemBody}>
          <Text>{item.address}</Text>
        </Body>
        <View style={Layout.listItemChevron}>
          <MaterialIcons name="chevron-right" size={24} style={{ color: Theme.listBorderColor }} />
        </View>
      </ListItem>
    );
  }

  _onSearchExit(){
    this.setState({public_areas: this.props.public_areas});
    this.searchBar.hide()
  }

  _handleSearch(q){
    // Use Lodash regex for get match public_areas
    let result = _.filter( this._getFieldGroup() , (i)=> _.isMatch(i.address, q));
    this.setState({public_areas:  result})
  }

  _getFieldGroup(){
    let { fieldGroups, zoneIndex } = this.props;
    return _.orderBy(fieldGroups.data[zoneIndex].public_areas, ['address'])
  }
}

export default connect(({currentUser, fieldGroups}) => ({currentUser, fieldGroups}))(StreetScreen);
