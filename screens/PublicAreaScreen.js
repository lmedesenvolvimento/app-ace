import React from 'react';
import { View, Alert } from 'react-native';

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
import { bindActionCreators } from "redux";
import { Actions } from 'react-native-router-flux';

import ReduxActions from "../redux/actions";

import Theme from '../constants/Theme';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import Session from '../services/Session';

import LogoutButton from '../components/LogoutButton';

import * as _ from "lodash";

class FieldGroupScreen extends React.Component {
  state = {
    model: {},
    addresses: []
  }

  constructor(props) {
    super(props);
  }

  componentDidMount(){
    this.setState({ addresses: this._getPublicArea().addresses })
  }

  componentWillReceiveProps(){
    this.setState({ addresses: this._getPublicArea().addresses })
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
            <Title>{ this.props.publicarea.address || "Atualizando..." }</Title>
          </Body>
          <Right>
            { this.renderEditButton() }
            { this.renderRemoveButton() }
            <Button transparent onPress={()=> this.searchBar.show()}>
              <Icon android="md-search" ios="ios-search" />
            </Button>
          </Right>
          <SearchBar
            ref={(ref) => this.searchBar = ref}
            data={this.props.addresses}
            animate={false}
            placeholder="Pesquisar"
            handleSearch={(q)=> this._handleSearch(q)}
            onBack={ ()=> this._onSearchExit() } />
        </Header>
        { this.renderTabs() }
        <Fab
          direction="up"
          position="bottomRight"
          style={{ backgroundColor: Colors.accentColor }}
          onPress={() => {
            Actions.locationModal({ 
              publicarea: this.props.publicarea, 
              fieldgroup: this.props.fieldgroup
            });
          }}>
          <Icon android="md-add" ios="ios-add" size={24} />
        </Fab>
      </Container>
    );
  }

  renderTabs(){
    if(this.state.addresses && this.state.addresses.length){
      return (
        <Tabs>
          <Tab heading={ <TabHeading><Text>A VISITAR</Text></TabHeading>}>
            <Content padder>
              <List 
                dataArray={ _.chain(this.state.addresses).filter((obj, key, array) => !obj.visits.length ).orderBy(['number']).value()} 
                renderRow={this.renderItem.bind(this)} />
            </Content>
          </Tab>
          <Tab heading={ <TabHeading><Text>VISITADAS</Text></TabHeading>}>
            <Content padder>
              <List 
                dataArray={_.chain(this.state.addresses).filter((obj, key, array) => obj.visits.length).orderBy(['number']).value()} 
                renderRow={this.renderItem.bind(this)} />
            </Content>
          </Tab>
        </Tabs>
      );
    } else{
      return this.renderNotFoundItems()
    }
  }

  renderItem(address){
    address.visit = _.last(address.visits)
    return(
      <ListItem 
        icon 
        style={Layout.listHeight}
        onPress={()=> {
          Actions.locationModal({ 
            address: address,
            publicarea: this.props.publicarea,
            fieldgroup: this.props.fieldgroup
          });
        }} >
        <Left>
          <MaterialIcons name='location-on' size={28} color={Colors.iconColor} />
        </Left>
        <Body style={Layout.listItemBody}>
          <Text>Nº {address.number}</Text>
          <Text note>{address.complement}</Text>
        </Body>
      </ListItem>

    );
  }

  renderNotFoundItems(){
    return (
      <View style={styles.notfoundcontainer}>
        <Icon android="md-sad" ios="ios-sad-outline" style={styles.notfoundnoteicon}/>
        <Text style={styles.notfoundtitle}>Oh, não! Você não tem nehuma rua cadastrada.</Text>
        <Text note style={styles.notfoundnote}>Comece já a adicionar as localizações.</Text>
      </View>
    )
  }

  renderRemoveButton(){
    if(!this.props.publicarea.hasOwnProperty('id')){
      return(
        <Button transparent onPress={ () => this._removePublicArea()  }>
          <Icon android="md-trash" ios="ios-trash" />
        </Button>
      )
    }
  }

  renderEditButton(){
    if(!this.props.publicarea.hasOwnProperty('id')){
      return(
        <Button transparent onPress={() => {
          Actions.editStreetModal({
            hide: false,
            publicarea: this.props.publicarea,
            fieldgroup: this.props.parent,
          })
        }}>
          <Icon android="md-create" ios="ios-create" />
        </Button>
      )
    }
  }

  _removePublicArea(){
    Alert.alert(
    'Excluir Logradouro',
    'Você deseja realmente excluir este Logradouro?',
      [
        {text: 'Não', onPress: () => false, style: 'cancel'},
        {text: 'Sim', onPress: () => {
          this.props.removePublicArea(this.props.fieldgroup.$id, this.props.publicarea)
          Actions.pop()
        }},
      ],
      { cancelable: true }
    );
  }

  _onSearchExit(){
    this.setState({ addresses: this._getPublicArea().addresses});
    this.searchBar.hide()
  }

  _handleSearch(q){
    // Use Lodash regex for get match locations
    let result = _.filter(this._getPublicArea().addresses, (i)=> _.isMatch(i.number, q));
    this.setState({addresses:  result})
  }

  _getPublicArea(){
    let { fieldGroups, fieldgroup, publicarea } = this.props;
    let result = _.chain(fieldGroups.data)
      .find(['$id', fieldgroup.$id])
      .get("public_areas")
      .find(['$id', publicarea.$id]).value();

    return result || {}; // É nescessário como placeholder equanto as propriedades não está pronta
  }  
}

const styles = {
  notfoundcontainer: {
    margin: 48,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  notfoundtitle: {
    color: Colors.primaryColor,
    textAlign: 'center',
    ...Layout.marginVertical8
  },
  notfoundnote: {
    textAlign: 'center'
  },
  notfoundnoteicon: {
    fontSize: 124,
    color: "#ccc"
  }
}

function mapDispatchToProps(dispatch, ownProps){
  return bindActionCreators(ReduxActions.fieldGroupsActions, dispatch);
}

export default connect(({currentUser, fieldGroups}) => ({currentUser, fieldGroups}), mapDispatchToProps)(FieldGroupScreen);
