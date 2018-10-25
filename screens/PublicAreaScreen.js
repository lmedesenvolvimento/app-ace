import React from 'react';
import { View, Alert, ListView } from 'react-native';

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
  Fab,
  Col
} from 'native-base';

import { MaterialIcons } from '@expo/vector-icons';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions } from 'react-native-router-flux';

import ReduxActions from '../redux/actions';

import Colors from '../constants/Colors';
import Layout from '../constants/Layout';

import { VisitType, VisitTranslante, VisitTypeLocation, VisitTypeLocationTranslate } from '../types/visit';

import { simpleToast } from '../services/Toast';

import _ from 'lodash';
import moment from '../services/Timestamp';

import { Grid } from 'react-native-easy-grid';

import TimerMixin from 'react-timer-mixin';

const INITIAL_LIST_SIZE = 10;

class FieldGroupScreen extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      model: {},
      addresses: [],
      queryVisited: '',
      queryNotVisited: ''
    };
  }

  componentDidMount(){
    this.setState({ addresses: this._getPublicArea().addresses });
  }

  componentWillReceiveProps(){
    this.setState({ addresses: this._getPublicArea().addresses });
  }

  render() {
    return (
      <Container>
        <Header hasTabs={true} style={{ zIndex: 9 }}>
          <Left>
            <Button transparent onPress={()=> Actions.pop()}>
              <Icon name='md-arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title>{ this.props.publicarea.address || 'Atualizando...' }</Title>
          </Body>
          <Right>
            { this.renderEditButton() }
            { this.renderRemoveButton() }
          </Right>          
        </Header>
        { this.renderTabs() }
        <Fab
          direction='up'
          position='bottomRight'
          style={{ backgroundColor: Colors.accentColor }}
          onPress={() => {
            Actions.locationModal({ 
              publicarea: this.props.publicarea, 
              fieldgroup: this.props.fieldgroup
            });
          }}>
          <Icon android='md-add' ios='ios-add' size={24} />
        </Fab>
      </Container>
    );
  }

  renderTabs(){
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    if(this.state.addresses && this.state.addresses.length){
      return (
        <Tabs locked={true} initialPage={this.props.activeTab || 0} page={this.props.activeTab}>
          <Tab heading={<TabHeading><Text>A VISITAR</Text></TabHeading>}>
            <Content>
              <List
                initialListSize={INITIAL_LIST_SIZE}
                dataSource={ ds.cloneWithRows(this._getAddressNotVisited())}
                renderRow={this.renderItem.bind(this)}
                renderLeftHiddenRow={this.renderLeftHiddenRow.bind(this)}
                renderRightHiddenRow={this.renderRightHiddenRow.bind(this)}
                enableEmptySections={true}
                onRowOpen={false}
                leftOpenValue={75}
                rightOpenValue={-75} />
            </Content>
          </Tab>
          <Tab heading={ <TabHeading><Text>VISITADAS</Text></TabHeading>}>
            <Content>
              <List
                initialListSize={INITIAL_LIST_SIZE}   
                dataSource={ ds.cloneWithRows( this._getAddressVisited() )}
                renderRow={this.renderItem.bind(this)}
                renderLeftHiddenRow={this.renderLeftHiddenRow.bind(this)}
                renderRightHiddenRow={this.renderRightHiddenRow.bind(this)}
                enableEmptySections={true}
                onRowOpen={false}
                leftOpenValue={75}
                rightOpenValue={-75} />
            </Content>
          </Tab>
        </Tabs>
      );
    } else{
      return this.renderNotFoundItems();
    }
  }
  
  // renderHeader(key){
  //   return (
  //     <Header searchBar rounded style={styles.listHeader}>
  //       <Item>
  //         <Icon name="ios-search" />
  //         <Input placeholder="Buscar rápida" onChangeText={this._handleSearch.bind(this, key)} />
  //       </Item>          
  //     </Header>
  //   );
  // }
  

  renderItem(address, secId, rowId, rowMap){
    address.visit = _.last(address.visits) || {};
    return(
      <ListItem 
        icon
        style={[Layout.listHeight, styles.listItem]}
        onLongPress={this._removeLocation.bind(this, address, secId, rowId, rowMap)}
        onPress={this._handleOnPressItem.bind(this, address)}>
        <Left>
          <MaterialIcons name={this.renderItemIcon(address.visit.type_location)} size={28} color={Colors.iconColor} />
        </Left>
        <Body style={Layout.listItemBody}>
          <Grid>
            <Col size={66} style={{ justifyContent: 'center'}}>
              <Text numberOfLines={1} ellipsizeMode='tail'>  Nº {address.number} 
                <Text note>{ address.complement ? ` - ${address.complement }` : '' }</Text>
              </Text>
              { this.renderAddressDescription(address) }
            </Col>
            { this.renderLastVisit(address) }
          </Grid>
        </Body>
      </ListItem>
    );
  }

  renderNotFoundItems(){
    return (
      <View style={styles.notfoundcontainer}>
        <Icon android='md-sad' ios='ios-sad-outline' style={styles.notfoundnoteicon}/>
        <Text style={styles.notfoundtitle}>Comece já a adicionar as residências e visitas.</Text>
      </View>
    );
  }

  renderItemIcon(type){
    switch (type) {
    case VisitTypeLocation.residential:        
      return 'business';
    case VisitTypeLocation.commerce:
      return 'store';
    case VisitTypeLocation.wasteland:
      return 'business';
    case VisitTypeLocation.strategic_point:
      return 'pin-drop';
    case VisitTypeLocation.others:
      return 'help-circle';
    default:
      return 'business';
    }
  }

  renderAddressDescription(address){
    let visit = _.last(address.visits);
    if(visit){
      return(
        <Text note>{`${VisitTypeLocationTranslate[address.visit.type_location]} - ${VisitTranslante[address.visit.type]}`}</Text>
      ) ;
    } else {
      return(
        <Text note>{`${VisitTranslante[address.visit.type]}`}</Text>
      );
    }
  }

  renderRightHiddenRow(data, secId, rowId, rowMap){
    if(data.hasOwnProperty('id')){
      return(
        <View></View>
      );
    } else{
      return (
        <Button danger onPress={ ()=> this._removeLocation(data, secId, rowId, rowMap) }>
          <Icon active name='trash' />
        </Button>
      );
    }
  }

  renderLeftHiddenRow(data){
    return (
      <Button full onPress={() => {
        Actions.censoModal({
          address: data,
          publicarea: this.props.publicarea,
          fieldgroup: this.props.fieldgroup
        });
      }}>
        <Icon active size={28} name = 'md-list-box' />
      </Button>
    );
  }

  renderLastVisit(address){
    let visit = _.last(address.visits);
    if(visit){
      return(
        <Col size={33} style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
          <Grid style={{alignItems: 'center'}}>
            <Col>
              <Text style={{ textAlign: 'right' }} note>{ moment(visit.check_in).format('DD/MM/YYYY') }</Text>
              <Text style={{ lineHeight: 14, textAlign: 'right' }} note>
                { address.id 
                  ? <MaterialIcons size={14} name="sync" /> 
                  : <MaterialIcons size={14} name="sync-disabled" /> 
                }
                { moment(visit.check_in).format('HH:mm') }
              </Text>
            </Col>
          </Grid>
        </Col>
      );
    } else{
      return(
        <Col size={33}></Col>
      );
    }
  }

  renderRemoveButton(){
    if(!this.props.publicarea.hasOwnProperty('id')){
      return(
        <Button transparent onPress={ () => this._removePublicArea()  }>
          <Icon android='md-trash' ios='ios-trash' />
        </Button>
      );
    }
  }

  renderEditButton(){
    if(!this.props.publicarea.hasOwnProperty('id')){
      return(
        <Button transparent onPress={() => {
          Actions.editStreetModal({
            hide: false,
            publicarea: this.props.publicarea,
            fieldgroup: this.props.fieldgroup,
          });
        }}>
          <Icon android='md-create' ios='ios-create' />
        </Button>
      );
    }
  }

  _handleOnPressItem(address){
    TimerMixin.requestAnimationFrame(() => {
      if( _.last(address.visits) && _.last(address.visits).hasOwnProperty('id') && this._SyncAddressHasVisit(address)){
        return false;
      }
      Actions.locationModal({ 
        address: _.clone(address),
        publicarea: this.props.publicarea,
        fieldgroup: this.props.fieldgroup
      });
    });
  }

  alertIfSyncAddress(){
    return simpleToast('Endereço já sincronizados.');
  }

  // DELETE ACTIONS

  _removePublicArea(){
    Alert.alert(
      'Excluir Logradouro',
      'Você deseja realmente excluir este Logradouro?',
      [
        {text: 'Não', onPress: () => false, style: 'cancel'},
        {text: 'Sim', onPress: () => {
          this.props.removePublicArea(this.props.fieldgroup.$id, this.props.publicarea);
          Actions.pop();
        }},
      ],
      { cancelable: true }
    );
  }

  _removeLocation(address, secId, rowId, rowMap){
    if(address.hasOwnProperty('id')){
      return this.alertIfSyncAddress();
    }

    Alert.alert(
      'Excluir Endereço',
      'Você deseja realmente excluir este endereço? Suas visitas serão apagadas.',
      [
        {text: 'Não', onPress: () => false, style: 'cancel'},
        {text: 'Sim', onPress: () => {
          // Force close animate Row
          rowMap[`${secId}${rowId}`].props.closeRow();          
          // Dispatch Action
          this.props.removeLocationInPublicArea(this.props.fieldgroup.$id, this.props.publicarea.$id, address);
        }},
      ],
      { cancelable: true }
    );
  }

  // SEARCH BAR

  _onSearchExit(){
    this.setState({ addresses: this._getPublicArea().addresses});
    this.searchBar.hide();
  }

  _handleSearch(key, q){
    let updates = {};
    updates[key] = q;
    this.setState(updates);
  }

  // Helpers Queries 

  _getPublicArea(){
    let { fieldGroups, fieldgroup, publicarea } = this.props;
    let result = _.chain(fieldGroups.data)
      .find(['$id', fieldgroup.$id])
      .get('field_group.public_areas')
      .find(['$id', publicarea.$id]).value();

    return result || {}; // É nescessário como placeholder equanto as propriedades não está pronta
  }

  _SyncAddressHasVisit(address){
    return !isVisitClosedOrRefused(address.visit.type);
  }

  _getAddressVisited(){
    let result = 
      _.chain(this.state.addresses).filter((obj) => {
        var lastVisit = _.chain(obj.visits).last().value();
        return lastVisit && !isVisitClosedOrRefused(lastVisit.type);
      }).sortBy(sortByNumber).value();
      

    if(!this.state.queryVisited.length) return result;

    result = _.filter( result, (address)=> {
      return _.isMatch(address.number.toLowerCase(), this.state.queryVisited.toLowerCase());
    });
      
    return result;
  }
    
  _getAddressNotVisited(){
    let result = 
      _.chain(this.state.addresses).filter((obj) => {
        var lastVisit = _.chain(obj.visits).last().value();
        return ( lastVisit && isVisitClosedOrRefused(lastVisit.type) ) || _.isUndefined(lastVisit);
      }).sortBy(sortByNumber).value();

    if(!this.state.queryNotVisited.length) return result;

    result = _.filter( result, (address)=> {
      return _.isMatch(address.number.toLowerCase(), this.state.queryNotVisited.toLowerCase());
    });

    return result;
  }
}

function sortByNumber(o){
  let number = parseInt(o.number);
  return _.isNaN(number) ? -1 : number;
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
    color: '#ccc'
  },
  listHeader: {
    backgroundColor: '#eeeeee'
  },
  listItem: {
    paddingHorizontal: 16,
  }
};

function isVisitClosedOrRefused(type){
  return [VisitType.closed, VisitType.refused].includes(type);
}

function mapDispatchToProps(dispatch){
  return bindActionCreators(ReduxActions.fieldGroupsActions, dispatch);
}

export default connect(({currentUser, fieldGroups}) => ({currentUser, fieldGroups}), mapDispatchToProps)(FieldGroupScreen);
