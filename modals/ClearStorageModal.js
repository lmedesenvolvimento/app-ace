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

import _ from 'lodash';

export class ClearStorageModal extends React.Component {  
  constructor(props) {
    super(props);
    
    this.state = {
      isReady: false
    }
  }  

  componentDidMount(){
    // remove preloading
    setTimeout( () => this.setState({ isReady: true }), 200 );
  }

  render() {
    if(this.state.isReady){
      return (
        <Container>
          <Grid>
            <Col style={{ justifyContent: 'center', alignItems: 'center' }}>
              <H2 style={Layout.padding}>Apagar todos os dados locais</H2>
              <Text note>Para limpar</Text>
            </Col>
          </Grid>
          <Footer style={{backgroundColor:"white"}} padder>
            <Grid>
              <Row>
                <Col>
                  <Button full transparent onPress={this.dismissModal.bind(this)}>
                    <Text>Cancelar</Text>
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

  okModal(){    
    // close modal
    Actions.pop();
  }

  dismissModal(){
    Actions.pop();
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

export default connect(mapStateToProps, mapDispatchToProps)(ClearStorageModal);
