import React from 'react';

import { ActivityIndicator, View, Picker, Platform } from 'react-native';

import {
  Header,
  Container,
  Content,
  H1,
  H2,
  Text,
  Title,
  Left,
  Right,
  Footer,
  Form,
  Item,
  Label,
  Input,
  Body,
  Button,
  Spinner
} from 'native-base';

import { Grid, Row, Col } from 'react-native-easy-grid';

import Swiper from 'react-native-swiper';

import Colors from '../constants/Layout';
import Layout from '../constants/Layout';

import { simpleToast } from '../services/Toast';
import { getLocationAsync } from '../services/Permissions';

import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { Actions } from 'react-native-router-flux';

import ReduxActions from "../redux/actions";

import { LocationForm } from './forms/location';
import { InspectionForm } from './forms/location/inspection';
import { SamplesForm } from './forms/location/samples';
import { TratamentForm } from './forms/location/tratament';
import { ObservationForm } from './forms/location/observation';

import { CensoType } from '../types/censo';

import * as _ from 'lodash';
import numeral from 'numeral';

export class CensoModal extends React.Component {
  state = {
    inhabitants: 0,
    tank: 0,
    drum: 0,
    tina: 0,
    filter: 0,
    pot: 0,
    plant_pot: 0,
    cistern: 0,
    waterhole: 0,
    water_box: 0
  }
  
  constructor(props) {
    super(props);
  }  

  componentDidMount(){
    this.setCensus();
    // remove preloading
    setTimeout( () => this.setState({ isReady: true }), 200 );
  }

  render() {
    if(this.state.isReady){
      return (
        <Container>
          <H2 style={Layout.padding}>Registrar Censo</H2>
          <Content padder>
            <View style={{paddingBottom: 48}}>
              <Item>
                <Label>{CensoType.inhabitants}</Label>
                <Input 
                  keyboardType='numeric' 
                  value={this.state.inhabitants.toString()}
                  onChangeText={inhabitants => this.setState({inhabitants})}
                  onBlur={this.onBlurNumeralState.bind(this, 'inhabitants')} 
                />
              </Item>
              <Item>
                <Label>{CensoType.tank}</Label>
                <Input 
                  keyboardType='numeric' 
                  value={this.state.tank.toString()}
                  onChangeText={tank => this.setState({tank})}
                  onBlur={this.onBlurNumeralState.bind(this, 'tank')}
                 />
              </Item>
              <Item>
                <Label>{CensoType.tina}</Label>
                <Input
                  keyboardType='numeric' 
                  value={this.state.tina.toString()}
                  onChangeText={tina => this.setState({tina})}
                  onBlur={this.onBlurNumeralState.bind(this, 'tina')}
                />
              </Item>
              <Item>
                <Label>{CensoType.drum}</Label>
                <Input
                  keyboardType='numeric' 
                  value={this.state.drum.toString()}
                  onChangeText={drum => this.setState({drum})}
                  onBlur={this.onBlurNumeralState.bind(this, 'drum')}
                />
              </Item>
              <Item>
                <Label>{CensoType.pot}</Label>
                <Input
                  keyboardType='numeric' 
                  value={this.state.pot.toString()}
                  onChangeText={pot => this.setState({pot})}
                  onBlur={this.onBlurNumeralState.bind(this, 'pot')}
                />
              </Item>
              <Item>
                <Label>{CensoType.plant_pot}</Label>
                <Input
                  keyboardType='numeric' 
                  value={this.state.plant_pot.toString()}
                  onChangeText={plant_pot => this.setState({plant_pot})}
                  onBlur={this.onBlurNumeralState.bind(this, 'plant_pot')}
                />
              </Item>
              <Item>
                <Label>{CensoType.cistern}</Label>
                <Input
                  keyboardType='numeric' 
                  value={this.state.cistern.toString()}
                  onChangeText={cistern => this.setState({cistern})}
                  onBlur={this.onBlurNumeralState.bind(this, 'cistern')}
                />
              </Item>
              <Item>
                <Label>{CensoType.waterhole}</Label>
                <Input
                  keyboardType='numeric' 
                  value={this.state.waterhole.toString()}
                  onChangeText={waterhole => this.setState({waterhole})}
                  onBlur={this.onBlurNumeralState.bind(this, 'waterhole')}
                />
              </Item>
              <Item>
                <Label>{CensoType.water_box}</Label>
                <Input
                  keyboardType='numeric' 
                  value={this.state.water_box.toString()}
                  onChangeText={water_box => this.setState({water_box}) }
                  onBlur={this.onBlurNumeralState.bind(this, 'water_box')}
                />
              </Item>
            </View>
          </Content>
          <Footer style={{backgroundColor:"white"}} padder>
            <Grid>
              <Row style={{alignItems: 'center'}}>
                <Col>
                  <Button full transparent onPress={this.dismissModal.bind(this)}>
                    <Text>Voltar</Text>
                  </Button>
                </Col>
                <Col style={styles.colLeftBorder}>
                  <Button full transparent onPress={this.okModal.bind(this)}>
                    <Text>Atualizar</Text>
                  </Button>
                </Col>
              </Row>
            </Grid>
          </Footer>
        </Container>
      );
    } else{
      return (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size={Platform.OS == 'ios' ? 1 : 64} color={Colors.accentColor} />
        </View>
      )
    }
  }

  onBlurNumeralState(key) {
    let number = numeral(this.state[key]).value()
    let updates = {}

    updates[key] = Math.abs(number)

    this.setState(updates)
  }

  okModal(){
    let updates = _.clone(this.props.address);
    // set census to updates
    if (_.isEmpty(updates.census)) {
      updates.census[0] = _.chain(this.state).omit(['isReady']).value();
    } else{
      if(updates.census[0].id){
        var data = _.chain(this.state).omit(['isReady']).value();
        data.updated = true;
        updates.census[0] = data;
      }
    }
    // dispath action
    this.props.updateLocationInPublicArea(this.props.fieldgroup.$id, this.props.publicarea.$id, this.props.address, updates);
    // feedback user
    simpleToast('Censo atualizado com successo!');
    // close modal
    Actions.pop();
  }

  dismissModal(){
    Actions.pop();
  }

  scrollBy = (index) => {
    this.swiper.scrollBy(index)
  }

  setCensus(){
    let census = _.first(this.props.address.census);

    if (_.isEmpty(census)) {
      return false;
    }

    // update component state
    let updates = { ...census
    };
    this.setState(updates)
  }

  onCancel = () => {
    this.dismissModal()
  }
}

const styles = {
  wrapper: {},
  slide: {
    flex: 1
  },
  spinnerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 8
  },
  footerBorder:{
    borderTopWidth: 1,
    borderTopColor: "#eee"
  },
  colLeftBorder: {
    borderLeftWidth: 1,
    borderLeftColor: "#eee"
  }
}

function mapStateToProps(state) {
  return {
    state: {
      currentUser: state.currentUser,
      fieldGroups: state.fieldGroups
    }
  }
}

function mapDispatchToProps(dispatch, ownProps){
  return bindActionCreators(ReduxActions.fieldGroupsActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CensoModal);
