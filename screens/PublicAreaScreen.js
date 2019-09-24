import React from 'react';
import { View, Alert, Dimensions, FlatList } from 'react-native';

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

import RBSheet from "react-native-raw-bottom-sheet";

import { MaterialIcons } from '@expo/vector-icons';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions } from 'react-native-router-flux';

import ReduxActions from '../redux/actions';

import Colors from '../constants/Colors';
import Layout from '../constants/Layout';

import { 
  VisitType, 
  VisitTranslante, 
  VisitTypeLocation, 
  VisitTypeLocationTranslate 
} from '../types/visit';

import { simpleToast } from '../services/Toast';

import _ from 'lodash';
import moment from '../services/Timestamp';

import { Grid } from 'react-native-easy-grid';

import TimerMixin from 'react-timer-mixin';
import { thisExpression } from '@babel/types';

const INITIAL_LIST_SIZE = 15;

class FieldGroupScreen extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      model: {},
      addresses: [],
      queryVisited: '',
      queryNotVisited: '',
      activePage: 0,
      selectedAddress: null
    };
  }

  componentDidMount(){
    this.setState({ addresses: this._getPublicArea().addresses });
  }

  componentWillReceiveProps(){
    this.setState({ addresses: this._getPublicArea().addresses });
  }

  render() {
    const { publicarea } = this.props;
    const RBSheetHeight = ( Dimensions.get("screen").height / 3 );
    const RBSheetOptions = this.RBSheetOptions;

    return (
      <Container>
        <Header hasTabs={true} style={{ zIndex: 9 }}>
          <Left>
            <Button transparent onPress={()=> Actions.pop()}>
              <Icon name='md-arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title>{ publicarea.public_area.address || 'Atualizando...' }</Title>
          </Body>
          <Right>
            { this.renderEditPublicAreaButton() }
            { this.renderRemovePublicAreaButton() }
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
              fieldgroup: this.props.fieldgroup,
              onSubmit: this._onSubmitLocationModal
            });
          }}>
          <Icon android='md-add' ios='ios-add' size={24} />
        </Fab>
        <RBSheet
          ref={ref => {
            this.RBSheet = ref;
          }}
          onClose={() => this.setState({ selectedAddress: null })}
          height={RBSheetHeight}
          duration={250}
        >
          <RBSheetOptions />
        </RBSheet>
      </Container>
    );
  }

  renderTabs(){
    const { state }  = this;
    if(state.addresses && state.addresses.length){
      return (
        <Tabs 
          initialPage={0} 
          page={state.activePage} 
          onChangeTab={({ i }) => this.setState({ activePage: i })}
        >
          <Tab heading={<TabHeading><Text>A VISITAR</Text></TabHeading>}>
            <FlatList
              keyExtractor={({ $id }) => $id}
              data={this._getAddressNotVisited()}
              renderItem={this.renderItem.bind(this)}
              extraData={state}
            />
          </Tab>
          <Tab heading={ <TabHeading><Text>VISITADAS</Text></TabHeading>}>
            <FlatList
              keyExtractor={({ $id }) => $id}
              data={this._getAddressVisited()}
              renderItem={this.renderItem.bind(this)}
              extraData={state}
            />            
          </Tab>
        </Tabs>
      );
    } else{
      return this.renderNotFoundItems();
    }
  }

  renderItem = ({ item }) => {
    const address = item;
    const { icon, iconType } = this.renderItemIcon(address.type);
    
    address.visit = _.last(address.visits) || {};

    return(
      <ListItem 
        icon
        style={[Layout.listHeight, styles.listItem]}
        onPress={() => this._handleOnPressItem(address)}
      >
        <Left>
          <Icon name={icon} type={iconType} size={28} color={Colors.iconColor} />
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
      return { icon: 'home', iconType: 'FontAwesome' };
    case VisitTypeLocation.commerce:
      return { icon: 'store', iconType: 'MaterialIcons' };
    case VisitTypeLocation.wasteland:
      return { icon: 'layers-off-outline', iconType: 'MaterialCommunityIcons' };
    case VisitTypeLocation.strategic_point:
      return { icon: 'pin-drop', iconType: 'MaterialIcons' };
    case VisitTypeLocation.others:
      return { icon: 'help', iconType: 'MaterialIcons' };
    default:
      return { icon: 'business', iconType: 'MaterialIcons' };
    }
  }

  renderAddressDescription(address){
    let visit = _.last(address.visits);
    if(visit){
      return(
        <Text note>{`${VisitTypeLocationTranslate[address.visit.type_location]} - ${VisitTranslante[address.visit.type]}`}</Text>
      );
    } else {
      return(
        <Text note>{`${VisitTypeLocationTranslate[address.type]}`}</Text>
      );
    }
  }

  RBSheetOptions = () => {
    const { props, state } = this;
    const isLocationPermitVisit = this.isLocationPermitVisit();
    return (
      <List>
        <ListItem itemHeader first noBorder>
          <Text>Opções</Text>
        </ListItem>
        
        {(() => {
          if (isLocationPermitVisit) {
            return (
              <ListItem icon onPress={this._handleLocationVisit} noBorder>
                <Left>
                  <Icon name="home" type="FontAwesome" />
                </Left>
                <Body>
                  <Text>Realizar / Atualizar Visita</Text>
                </Body>
                <Right />
              </ListItem>
            )
          }
        })()}

        <ListItem icon onPress={this._handleLocationCensus} noBorder>
          <Left>
            <Icon name="md-list-box" />
          </Left>
          <Body>
            <Text>Realizar Censo</Text>
          </Body>
          <Right />
        </ListItem>
        
        {(() => {
          if (!state.selectedAddress.hasOwnProperty('id')){
            return (
              <ListItem icon onPress={this._removeLocation} noBorder>
                <Left>
                  <Icon android='md-trash' ios='ios-trash'/>
                </Left>
                <Body>
                  <Text>Remover Endereço</Text>
                </Body>
                <Right />
              </ListItem>
            )
          }
        })()}
      </List>
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
              <Text style={{ lineHeight: 18, textAlign: 'right' }} note>
                {_.last(address.visits) && _.last(address.visits).id
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

  renderRemovePublicAreaButton(){
    if(!this.props.publicarea.hasOwnProperty('id')){
      return(
        <Button transparent onPress={ () => this._removePublicArea()  }>
          <Icon android='md-trash' ios='ios-trash' />
        </Button>
      );
    }
  }

  renderEditPublicAreaButton(){
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

  _handleOnPressItem = (selectedAddress) => {
    this.setState({ selectedAddress })
    this.RBSheet.open()
  }
  
  _handleLocationVisit = () => {
    const { selectedAddress } = this.state;
    const address = selectedAddress;
    const isLocationPermitVisit = this.isLocationPermitVisit();
    
    if (!isLocationPermitVisit){
      return false;
    }

    Actions.locationModal({ 
      address: _.clone(address),
      publicarea: this.props.publicarea,
      fieldgroup: this.props.fieldgroup,
      onSubmit: this._onSubmitLocationModal
    });

    this.RBSheet.close();
  }

  _handleLocationCensus = () => {
    const { props, state, RBSheet } = this;
    
    Actions.censoModal({
      address: Object.assign({}, state.selectedAddress),
      publicarea: props.publicarea,
      fieldgroup: props.fieldgroup
    });

    RBSheet.close()
  }

  _onSubmitLocationModal = (activePage) => {
    this.setState({ activePage })
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

  _removeLocation = () => {
    const { props, state, RBSheet } = this;
    const { removeLocationInPublicArea } = props;
    const { selectedAddress } = state;
    
    if (selectedAddress.hasOwnProperty('id')){
      return simpleToast('Endereço já sincronizados.');
    }

    Alert.alert(
      'Excluir Endereço',
      'Você deseja realmente excluir este endereço? Suas visitas serão apagadas.',
      [
        {text: 'Não', onPress: () => false, style: 'cancel'},
        {text: 'Sim', onPress: () => {          
          // Dispatch Action
          removeLocationInPublicArea(
            props.fieldgroup.$id, 
            props.publicarea.$id, selectedAddress
          );
          RBSheet.close();
        }},
      ],
      { cancelable: true }
    );
  }

  // Helpers Queries 

  _getPublicArea(){
    let { fieldGroups, fieldgroup, publicarea } = this.props;

    let result = _.chain(fieldGroups.data)
      .find(['$id', fieldgroup.$id])
      .get('field_group.field_group_public_areas')
      .find(['$id', publicarea.$id]).value();

    return result || {}; // É nescessário como placeholder equanto as propriedades não está pronta
  }

  _SyncAddressHasVisit(address){
    return !isVisitClosedOrRefused(address.visit.type);
  }

  _getAddressVisited(){
    let result = 
      _.chain(this.state.addresses)
      .filter((obj) => {
        var lastVisit = _.chain(obj.visits).last().value();
        return lastVisit && !isVisitClosedOrRefused(lastVisit.type);
      })
        .sortBy(sortByNumber)
        .value();
      

    if(!this.state.queryVisited.length) return result;

    result = _.filter( result, (address)=> {
      return _.isMatch(address.number.toLowerCase(), this.state.queryVisited.toLowerCase());
    });
      
    return result;
  }
    
  _getAddressNotVisited(){
    let result = 
      _.chain(this.state.addresses)
      .filter((obj) => {
        var lastVisit = _.chain(obj.visits).last().value();
        return ( lastVisit && isVisitClosedOrRefused(lastVisit.type) ) || _.isUndefined(lastVisit);
      })
        .sortBy(sortByNumber)
        .value();

    if(!this.state.queryNotVisited.length) return result;

    result = _.filter( result, (address)=> {
      return _.isMatch(address.number.toLowerCase(), this.state.queryNotVisited.toLowerCase());
    });

    return result;
  }
  isLocationPermitVisit = () => {
    const address = this.state.selectedAddress;
    const lastVisit = _.last(address.visits);
    if (lastVisit && lastVisit.hasOwnProperty('id') && this._SyncAddressHasVisit(address)) {
      return false;
    }
    return true;
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
