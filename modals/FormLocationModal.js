import React from 'react';
import { View } from 'react-native';

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
  Item,
  Input,
  Body,
  Button,
  Picker,
} from 'native-base';

import Swiper from 'react-native-swiper';

import Theme from '../constants/Theme';
import Layout from '../constants/Layout';

import { simpleToast } from '../services/Toast';

import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { Actions } from 'react-native-router-flux';

import ReduxActions from "../redux/actions";

import { LocationForm } from './forms/location';
import { InspectionForm } from './forms/location/inspection';

export class FormLocationModal extends React.Component {
  state = {
    name: "Urra"
  }
  constructor(props) {
    super(props);
  }

  componentDidMount(){}

  render() {
    return (
      <Swiper
        ref={ (component) => this.swiper = component }
        loop={false}
        style={styles.wrapper}
        scrollEnabled={false}
        showsPagination={false}
        showsButtons={false}>
        <View style={styles.slide}>
          <LocationForm {...this.props } scrollBy={this.scrollBy} />
        </View>
        <View style={styles.slide}>
          <InspectionForm {...this.props } scrollBy={this.scrollBy} />
        </View>
        <View style={styles.slide}>
          <LocationForm {...this.props } scrollBy={this.scrollBy} />
        </View>
      </Swiper>
    );
  }

  okModal(){
    this.dismissModal()
  }

  dismissModal(){
    Actions.pop();
  }

  scrollBy = (index) => {
    this.swiper.scrollBy(index, false)
  }

}

const styles = {
  wrapper: {},
  slide: {
    flex: 1
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

export default connect(mapStateToProps, mapDispatchToProps)(FormLocationModal);
