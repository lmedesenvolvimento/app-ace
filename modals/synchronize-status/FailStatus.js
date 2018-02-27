import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { View, Platform } from 'react-native';

import {
    Header,
    Container,
    Content,
    H1,
    H3,
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

import Colors from '../../constants/Layout';
import Layout from '../../constants/Layout';

import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { Actions } from 'react-native-router-flux';

import ReduxActions from "../../redux/actions";

class FailStatus extends React.Component {
    constructor(props){
      super(props);
    }

    render(){
      return(
        <Container>
          <View style={styles.container}>
            <View style={styles.statusContainer}>
              <H1 style={styles.textCenter}>Falha Sincronização</H1>
            </View>
            <View>
              <MaterialIcons name="cloud-off" style={styles.syncIcon} />
            </View>
            <View style={styles.statusContainer}>
              <Text style={styles.textCenter} note>Não foi possível terminar sua sincronização por favor tente novamente.</Text>
              <Button light full style={Layout.marginVertical} onPress={Actions.pop.bind(this)}>
                <Text>Tentar novamente</Text>
              </Button>
            </View>            
          </View>
      </Container>
    );
  }
}

const fadeInOut = {
  0: {
    opacity: 1,
    rotate: '0deg',
  },
  0.5: {
    opacity: 0,
    rotate: '-180deg'
  },
  1: {
    opacity: 1,
    rotate: '-360deg',
  },
};

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

function mapStateToProps(state) {
    return {
        state: {
            network: state.net,
            fieldGroups: state.fieldGroups
        }
    }
}

function mapDispatchToProps(dispatch, ownProps) {
    return bindActionCreators(ReduxActions.fieldGroupsActions, dispatch);
}

export default connect(({network}) => ({network}))(FailStatus)