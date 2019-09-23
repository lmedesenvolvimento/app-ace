import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';

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
  Switch,
  List,
  ListItem,
  Icon,
  Fab,
  Row,
  Col,
} from 'native-base';

import SearchBar from 'react-native-searchbar';

import { MaterialIcons } from '@expo/vector-icons';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions } from 'react-native-router-flux';

import ReduxActions from '../redux/actions';

import Theme from '../constants/Theme';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';

import { PublicAreaTypesTranslate } from '../types/publicarea';
import { MappingStatus } from '../types/mapping';

import _ from 'lodash';

import TimerMixin from 'react-timer-mixin';

class PublicAreaScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      public_areas: [],
      status: MappingStatus.not_finished
    };
  }

  componentDidMount(){
    this.setState({public_areas: this._getPublicAreas()});
  }

  componentWillReceiveProps(){
    this.setState({public_areas: this._getPublicAreas()});
  }

  render() {
    const mapping = _.find(this.props.fieldGroups.data, { $id: this.props.fieldgroup.$id });
    
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
            dataSource={this.state.public_areas}
            animate={false}
            placeholder="Pesquisar"
            handleSearch={(q)=> this._handleSearch(q)}
            onBack={ ()=> this._onSearchExit() } />
        </Header>
        <Content padder>
          <Row style={{ maxHeight: 48, paddingLeft: 24, paddingRight: 8 }}>
            <Col>
              <Text note style={{ lineHeight: 48, marginRight: 8 }}>Quarteirão finalizado?</Text>
            </Col>
            <Switch value={ mapping.status ? true : false } onValueChange={() => this.props.toggleMappingStatus(mapping.$id)}  />
          </Row>
          <List style={Layout.listMargin}>
            <FlatList
              keyExtractor={({ $id }) => $id}
              data={this.state.public_areas}
              extraData={this.state}
              renderItem={this.renderItem.bind(this) }/>
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

  renderItem = ({ item }) => {
    return(
      <ListItem
        icon
        onPress={this._handleItemPress.bind(this, item)}
        style={Layout.listHeight}>
        <Left>
          <View style={[Layout.listHeight, styles.rect]}>
            <Text style={styles.rectLabel}>{item.position}</Text>
          </View>
        </Left>
        <Body style={Layout.listItemBody}>
          <Text>{item.public_area.address}</Text>
          <Text note>{PublicAreaTypesTranslate[item.public_area.type] }</Text>
        </Body>
        <View style={Layout.listItemChevron}>
          <MaterialIcons name="chevron-right" size={24} style={{ color: Theme.listBorderColor }} />
        </View>
      </ListItem>
    );
  }

  _handleItemPress(item){
    TimerMixin.requestAnimationFrame(() => {
      Actions.publicarea({ publicarea: _.omit(item, ['addresses']), title: item.public_area.address, fieldgroup: this.props.fieldgroup });
    });
  }

  _onSearchExit(){
    this.setState({ public_areas: this._getPublicAreas() });
    this.searchBar.hide();
  }

  _handleSearch(q){
    // Use Lodash regex for get match public_areas
    let field_group_public_areas = this._getPublicAreas();

    let public_areas = _.filter(field_group_public_areas, ({ public_area })=> {
      return _.includes(public_area.address.toLowerCase(), q.toLowerCase());
    });

    this.setState({ public_areas });
  }

  _getPublicAreas(){
    let { fieldGroups, fieldgroup } = this.props;
    if(fieldgroup){
      let result = _.find(fieldGroups.data,['$id', fieldgroup.$id]);
      return _.orderBy(
        result.field_group.field_group_public_areas,
        fpa => fpa.position
      );
    } else{
      return [];
    }
  }  
}

const styles = StyleSheet.create({
  rect: {
    backgroundColor: '#666666',
    alignContent: 'center',
    justifyContent: 'center',
    borderRadius: 4,    
    width: 42,
    height: 42,
    margin: 8,
  },
  rectLabel: {
    color: '#FFFFFF',
    fontSize: 16
  }
});

function mapDispatchToProps(dispatch){
  return bindActionCreators(ReduxActions.fieldGroupsActions, dispatch);
}

export default connect(({currentUser, fieldGroups}) => ({currentUser, fieldGroups}), mapDispatchToProps)(PublicAreaScreen);
