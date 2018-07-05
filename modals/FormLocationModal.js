import React from 'react';
import { ActivityIndicator, View, Picker, Platform } from 'react-native';

import {
  Header,
  Container,
  Content,
  H1,
  Text,
  Title,
  Left,
  Right,
  Footer,
  Form,
  Label,
  Input,
  Body,
  Button,
  Spinner
} from 'native-base';

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

import { VisitType, VisitTypeLocation } from '../types/visit';

export class FormLocationModal extends React.Component {
  state = {
    isReady: false,
    number: null,
    complement: null,
    visit: {
      type: null,
      type_location: null,
      check_in: null,
      observation: null,
      samples: [],
      inspect: {},
      treatment: {},
    },
    census: {}
  }
  
  constructor(props) {
    super(props);
  }  

  componentDidMount(){
    // Melhora a peformace do Swiper
    setTimeout( () => this.setState({ isReady: true }), 200 )
  }

  render() {
    if(this.state.isReady){
      return (
        <Swiper
          ref={ (component) => this.swiper = component }
          loop={false}
          style={styles.wrapper}
          scrollEnabled={false}
          showsPagination={false}
          showsButtons={false}>
          <View style={styles.slide}>
            <LocationForm {...this.props } scrollBy={this.scrollBy} onCancel={this.onCancel} onSubmit={this.onLocationFormSubmit} />
          </View>
          <View style={styles.slide}>
            <InspectionForm {...this.props } scrollBy={this.scrollBy} onSubmit={this.onInspectionFormSubmit} />
          </View>
          <View style={styles.slide}>
            <SamplesForm {...this.props} scrollBy={this.scrollBy} onSubmit={this.onSamplesFormSubmit} />
          </View>
          <View style={styles.slide}>
            <TratamentForm {...this.props } scrollBy={this.scrollBy} onSubmit={this.onTratamentFormSubmit} />
          </View>
          <View style={styles.slide}>
            <ObservationForm {...this.props } visit={this.state.visit} scrollBy={this.scrollBy} onCancel={this.onCancel} onSubmit={this.onObservationFormSubmit} />
          </View>
        </Swiper>
      );
    } else{
      return (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size={Platform.OS == 'ios' ? 1 : 64} color={Colors.accentColor} />
        </View>
      )
    }
  }

  okModal(targetTab){
    Actions.pop();
    setTimeout(() => Actions.refresh({ activeTab: targetTab }), 200);
  }

  dismissModal(){
    Actions.pop();
  }

  scrollBy = (index) => {
    this.swiper.scrollBy(index)
  }

  onCancel = () => {
    this.dismissModal()
  }

  // step-step responses
  onLocationFormSubmit = (data) => {
    let updates = {
      number: data.number,
      complement: data.complement,
      visit: this.state.visit
    }

    updates.visit.type = data.type
    updates.visit.check_in = data.check_in
    updates.visit.type_location = data.type_location

    this.setState(updates);

    // Save Current Geo Location
    getLocationAsync().then((data) => {
      if(data) {
        let { latitude, longitude } = data.coords;
        this.setState({ latitude, longitude });
      }
    })
  }
  
  onInspectionFormSubmit = (data) => {
    let updates = {
      visit: this.state.visit
    }
    
    updates.visit.inspect = _.omit(data, ['start_number', 'end_number'])      
    
    this.setState(updates);
  }

  onSamplesFormSubmit = (data) => {
    let updates = {
      visit: this.state.visit
    }

    updates.visit.samples = data

    this.setState(updates);
  }
  
  onTratamentFormSubmit = (data) => {
    let updates = {
      visit: this.state.visit
    }
    
    updates.visit.treatment = data    
    
    this.setState(updates);
  }
  
  onObservationFormSubmit = (data) => {
    let { address } = this.props;    
    let updates = {
      visit: this.state.visit
    };

    updates.visit.observation = data.observation

    this.setState(updates)

    let newData = _.omit(this.state, ['isReady'])

    if(address){
      this.props.updateLocationInPublicArea(this.props.fieldgroup.$id, this.props.publicarea.$id, this.props.address, newData)
      simpleToast("Endereço foi atualizado!");
    } else{
      this.props.addLocationInPublicArea(this.props.fieldgroup.$id, this.props.publicarea.$id, newData)
      simpleToast("Endereço adicionado com sucesso!");
    }

    let targetTab = isVisitClosedOrRefused(this.state.visit.type) ? 0 : 1
    
    this.okModal(targetTab)
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
  }
}

function isVisitClosedOrRefused(type) {
  return [VisitType.closed, VisitType.refused].includes(type)
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

export default connect(mapStateToProps, mapDispatchToProps)(FormLocationModal);
