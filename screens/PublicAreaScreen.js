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
            <Title>{ this.props.street.address || "Atualizando..." }</Title>
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
          onPress={() => Actions.locationModal() }>
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
              <List dataArray={_.filter(this.state.addresses, (obj, key, array) => !obj.visits.length )} renderRow={this.renderItem} />
            </Content>
          </Tab>
          <Tab heading={ <TabHeading><Text>VISITADAS</Text></TabHeading>}>
            <Content padder>
              <List dataArray={_.filter(this.state.addresses, (obj, key, array) => obj.visits.length)} renderRow={this.renderItem} />
            </Content>
          </Tab>
        </Tabs>
      );
    } else{
      return this.renderNotFoundItems()
    }
  }

  renderItem(address){
    return(
      <ListItem icon onPress={()=> false} style={Layout.listHeight}>
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
    if(!this.props.street.hasOwnProperty('id')){
      return(
        <Button transparent onPress={ () => this._removePublicArea()  }>
          <Icon android="md-trash" ios="ios-trash" />
        </Button>
      )
    }
  }

  renderEditButton(){
    if(!this.props.street.hasOwnProperty('id')){
      return(
        <Button transparent onPress={() => {
          Actions.editStreetModal({
            hide: false,
            street: this.props.street,
            streetIndex: this.props.streetIndex,
            zone: this.props.parent.zone,
            zoneIndex: this.props.parent.zoneIndex})
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
          this.props.removePublicArea(this.props.parent.zoneIndex, this.props.street)
          Actions.pop()
        }},
      ],
      { cancelable: true }
    );
  }

  _onSearchExit(){
    this.setState({addresses: this.props.addresses});
    this.searchBar.hide()
  }

  _handleSearch(q){
    // Use Lodash regex for get match locations
    let result = _.filter(this.props.addresses, (i)=> _.isMatch(i.number, q));
    this.setState({addresses:  result})
  }

  _getPublicArea(){
    let { fieldGroups, parent, streetIndex } = this.props;
    let { public_areas } = fieldGroups.data[parent.zoneIndex];
    return _.find(public_areas, (street) => street == this.props.street ) || {} // É nescessário como placeholder equanto as propriedades não está pronta
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
