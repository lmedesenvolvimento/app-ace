import React from 'react';
import { View } from 'react-native';


import {
  Container,
  H3,
  Text,
  Button,
} from 'native-base';

import { Col, Grid } from "react-native-easy-grid";

import Layout from '../../constants/Layout';

import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { Actions } from 'react-native-router-flux';

import ReduxActions from "../../redux/actions";

class AwaitStatus extends React.Component {
    constructor(props){
      super(props);
    }


    render(){
      return(
        <Container>
          <View style={styles.container}>
            <View style={styles.statusContainer}>
              <H3 style={[styles.textCenter, Layout.marginVertical16]}>Deseja sincronizar suas informações?</H3>
              <Text style={styles.textCenter} note>Este processo pode levar alguns minutos</Text>
              <Grid style={[{ maxHeight: 200 },Layout.marginVertical]}>
                <Col>
                  <Button full onPress={this.props.onStartSync.bind(this)}>
                    <Text>Sincronizar Agora</Text>
                  </Button>
                  <Button light full style={Layout.marginVertical} onPress={Actions.pop.bind(this)}>
                    <Text>Voltar</Text>
                  </Button>
                </Col>
              </Grid>              
            </View>            
          </View>
      </Container>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 48
  },
  statusContainer: {    
    paddingVertical: 16
  },
  progress: {
    width: 248
  },
  syncIcon: {
    fontSize: 98, 
    color: '#aaa',
    paddingVertical: 12
  },
  textCenter: {
    textAlign: 'center',
    marginVertical: 2
  }
}

export default connect(({network}) => ({network}))(AwaitStatus)