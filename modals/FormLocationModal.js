import React from 'react';
import { ActivityIndicator, View, Platform } from 'react-native';

import Swiper from 'react-native-swiper';

import Colors from '../constants/Layout';

import { simpleToast } from '../services/Toast';
import { getLocationAsync } from '../services/Permissions';

import { captureException } from '../hooks/CustomError';

import moment from '../services/Timestamp';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions } from 'react-native-router-flux';

import ReduxActions from '../redux/actions';

import LocationForm from './forms/location';
import { InspectionForm } from './forms/location/inspection';
import { SamplesForm } from './forms/location/samples';
import { TratamentForm } from './forms/location/tratament';
import { ObservationForm } from './forms/location/observation';

import { VisitType } from '../types/visit';

import TimerMixin from 'react-timer-mixin';

import { omit, clone } from 'lodash';

export class FormLocationModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
      isTransitionEnd: false,
      number: null,
      complement: null,
      visit: {
        type: null,
        type_location: null,
        check_in: null,
        observation: null,
        registred_at: null,
        latitude: null,
        longitude: null,
        samples: [],
        inspect: {},
        treatment: {}
      }
    };
  }  

  componentWillMount(){
    if(this.props.address){
      let updates = clone(this.props.address);
      
      if(this.props.address.hasOwnProperty('latitude')){
        updates.visit.latitude = this.props.address.latitude;
        updates.visit.longitude = this.props.address.longitude;
        updates.visit.registred_at = 
          this.props.address.visit ? this.props.address.visit.registred_at : moment();
      } 

      this.setState(updates);
    }
    // Melhora a peformace do Swiper
    TimerMixin.setTimeout(() => this.setState({ isReady: true }), 200 );
  }

  render() {
    if(this.state.isReady){
      return (
        <Swiper
          ref={ (component) => this.swiper = component }
          loop={false}          
          style={styles.wrapper}
          loadMinimal={true}
          loadMinimalSize={1}
          scrollEnabled={false}
          showsPagination={false}
          showsButtons={false}>
          <View style={styles.slide}>
            <LocationForm 
              payload={this.state}
              fieldgroup={this.props.fieldgroup}
              publicarea={this.props.publicarea}
              scrollBy={this.scrollBy.bind(this)} 
              onCancel={this.onCancel.bind(this)} 
              onSubmit={this.onLocationFormSubmit.bind(this)} 
              isReady={this.state.isTransitionEnd} />
          </View>
          <View style={styles.slide}>
            <InspectionForm
              payload={this.state}
              fieldgroup={this.props.fieldgroup}
              publicarea={this.props.publicarea}
              scrollBy={this.scrollBy.bind(this)} 
              onSubmit={this.onInspectionFormSubmit.bind(this)}
              isReady={this.state.isTransitionEnd} />
          </View>
          <View style={styles.slide}>
            <SamplesForm
              payload={this.state} 
              fieldgroup={this.props.fieldgroup}
              publicarea={this.props.publicarea}
              scrollBy={this.scrollBy.bind(this)} 
              onSubmit={this.onSamplesFormSubmit.bind(this)} 
              isReady={this.state.isTransitionEnd} />
          </View>
          <View style={styles.slide}>
            <TratamentForm
              payload={this.state} 
              fieldgroup={this.props.fieldgroup}
              publicarea={this.props.publicarea}
              scrollBy={this.scrollBy.bind(this)} 
              onSubmit={this.onTratamentFormSubmit.bind(this)} 
              isReady={this.state.isTransitionEnd} />
          </View>
          <View style={styles.slide}>
            <ObservationForm
              payload={this.state} 
              fieldgroup={this.props.fieldgroup}
              publicarea={this.props.publicarea}
              visit={this.state.visit} 
              scrollBy={this.scrollBy.bind(this)} 
              onCancel={this.onCancel.bind(this)} 
              onSubmit={this.onObservationFormSubmit.bind(this)} 
              isReady={this.state.isTransitionEnd} />
          </View>
        </Swiper>
      );
    } else{
      return (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size={Platform.OS == 'ios' ? 1 : 64} color={Colors.accentColor} />
        </View>
      );
    }
  }

  okModal(targetTab, callback){
    Actions.pop();
    TimerMixin.requestAnimationFrame(() =>  {
      Actions.refresh({ activeTab: targetTab });
      callback();
    });
  }

  dismissModal(){
    Actions.pop();
  }

  onIndexChanged(){
    this.setState({ isTransitionEnd: false });
  }

  onMomentumScrollEnd(){
    this.setState({ isTransitionEnd: true });
  }

  scrollBy (index) {
    this.swiper.scrollBy(index);    
  }

  onCancel () {
    this.dismissModal();
  }

  // step-step responses
  onLocationFormSubmit (data, callback) {
    try {
      let updates = {
        number: data.number,
        complement: data.complement,
        visit: clone(this.state.visit)
      };

      updates.visit.type = data.type;
      updates.visit.check_in = data.check_in;
      updates.visit.type_location = data.type_location;

      if (!this.props.address || !this.props.address.visit.hasOwnProperty('registred_at')) {
        updates.visit.registred_at = moment(updates.check_in).format();
      }

      // Save Current Geo Location
      getLocationAsync().then((data) => {
        if (data) {
          let { latitude, longitude } = data.coords;
          updates.latitude = latitude;
          updates.longitude = longitude;
          if (!this.props.address || !this.props.address.visit.hasOwnProperty('registred_at')) {
            updates.visit.latitude = latitude;
            updates.visit.longitude = longitude;
          }
          this.setState(updates);

          callback();
        } else {
          this.setState(updates);
          callback();
        }
      }).catch((error) => {
        // Notificando Error
        simpleToast(error.message);
        captureException(error);
        // Update currente state and dispatch callback
        this.setState(updates);
        callback();
      });
    } catch(e) {
      simpleToast('Problema ao tentar criar a visita, informe ao administrador.');
      // Notificando Error
      captureException(e);
      // exit visit
      Actions.pop();
    }    
  }
  
  onInspectionFormSubmit (data, callback) {
    try{
      let updates = {
        visit: this.state.visit
      };
      
      updates.visit.inspect = omit(data, ['start_number', 'end_number']);
      
      this.setState(updates);

      callback();
    } catch(e) {
      simpleToast('Problema ao tentar criar a visita, informe ao administrador.');
      // Notificando Error
      captureException(e);
      // exit visit
      Actions.pop();      
    }
  }

  onSamplesFormSubmit (data, callback) {
    try{
      let updates = {
        visit: this.state.visit
      };
  
      updates.visit.samples = data;
  
      this.setState(updates);

      callback();
    } catch(e) {
      captureException(e);
    }
  }
  
  onTratamentFormSubmit (data, callback) {
    try{
      let updates = {
        visit: this.state.visit
      };
      
      updates.visit.treatment = data;
      
      this.setState(updates);
  
      callback();
    } catch(e) {
      simpleToast('Problema ao tentar criar a visita, informe ao administrador.');
      // Notificando Error
      captureException(e);
      // exit visit
      Actions.pop();
      
    }
  }
  
  onObservationFormSubmit (data, callback) {
    try {
      let { address } = this.props;
      let updates = {
        visit: this.state.visit
      };
  
      updates.visit.observation = data.observation;
  
      this.setState(updates);
  
      let newData = omit(this.state, ['isReady']);
  
      if(address){
        this.props.updateLocationInPublicArea(this.props.fieldgroup.$id, this.props.publicarea.$id, this.props.address, newData);
        simpleToast('Endereço foi atualizado!');
      } else{
        this.props.addLocationInPublicArea(this.props.fieldgroup.$id, this.props.publicarea.$id, newData);
        simpleToast('Endereço adicionado com sucesso!');
      }
  
      let targetTab = isVisitClosedOrRefused(this.state.visit.type) ? 0 : 1;
      
      TimerMixin.setTimeout(this.okModal.bind(this, targetTab, callback));
    } catch(e) {
      simpleToast('Problema ao tentar criar a visita, informe ao administrador.');
      // Notificando Error
      captureException(e);
      // exit visit
      Actions.pop();      
    }
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
};

function isVisitClosedOrRefused(type) {
  return [VisitType.closed, VisitType.refused].includes(type);
}

function mapStateToProps(state) {
  return {
    state: {
      currentUser: state.currentUser
    }
  };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators(ReduxActions.fieldGroupsActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FormLocationModal);
