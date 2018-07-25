import React from 'react';
import { View, ListView } from 'react-native';

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
  Fab,
} from 'native-base';

import SearchBar from 'react-native-searchbar';

import { MaterialIcons } from '@expo/vector-icons';

import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';


import Theme from '../constants/Theme';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';

import { PublicAreaTypesTranslate } from '../types/publicarea';

import _ from 'lodash';

import TimerMixin from 'react-timer-mixin';

class PublicAreaScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      public_areas: []
    };
  }

  componentDidMount(){
    this.setState({public_areas: this._getPublicAreas()});
  }

  componentWillReceiveProps(){
    this.setState({public_areas: this._getPublicAreas()});
  }

  render() {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

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
            dataSource={this.public_areas}
            animate={false}
            placeholder="Pesquisar"
            handleSearch={(q)=> this._handleSearch(q)}
            onBack={ ()=> this._onSearchExit() } />
        </Header>
        <Content padder>
          <List style={Layout.listMargin}>
            <ListView
              dataSource={ ds.cloneWithRows(this.state.public_areas)}
              enableEmptySections={true}
              renderRow={this.renderItem.bind(this) }/>
          </List>
        </Content>
        <Fab
          direction="up"
          position="bottomRight"
          style={{ backgroundColor: Colors.accentColor }}
          onPress={() => Actions.newStreetModal({ hide: false, fieldgroup: this.props.fieldgroup })}>
          <Icon android="md-add" ios="ios-add" size={24} />
        </Fab>
      </Container>
    );
  }

  renderItem(item){
    return(
      <ListItem
        icon
        onPress={this._handleItemPress.bind(this, item)}
        style={Layout.listHeight}>
        <Left>
          <MaterialIcons name='location-on' size={28} color={Colors.iconColor} />
        </Left>
        <Body style={Layout.listItemBody}>
          <Text>{item.address}</Text>
          <Text note>{ PublicAreaTypesTranslate[item.type] }</Text>
        </Body>
        <View style={Layout.listItemChevron}>
          <MaterialIcons name="chevron-right" size={24} style={{ color: Theme.listBorderColor }} />
        </View>
      </ListItem>
    );
  }

  _handleItemPress(item){
    TimerMixin.requestAnimationFrame(() => {
      Actions.publicarea({ publicarea: item, title: item.address, fieldgroup: this.props.fieldgroup });
    });
  }

  _onSearchExit(){
    this.setState({public_areas: this.props.public_areas});
    this.searchBar.hide();
  }

  _handleSearch(q){
    // Use Lodash regex for get match public_areas
    let result = _.filter( this._getPublicAreas() , (i)=> _.isMatch(i.address, q));
    this.setState({public_areas:  result});
  }

  _getPublicAreas(){    
    let { fieldGroups, fieldgroup } = this.props;
    let result = _.find(fieldGroups.data,['$id', fieldgroup.$id]);
    return _.orderBy(result.field_group.public_areas, ['address']);
  }  
}

export default connect(({currentUser, fieldGroups}) => ({currentUser, fieldGroups}))(PublicAreaScreen);
