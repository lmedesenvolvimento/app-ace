import React from 'react';
import { Platform, ProgressBarAndroid, ProgressViewIOS } from 'react-native';
import { View } from 'react-native-animatable';

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
    Icon,
    Body,
    Button,
    Picker,
} from 'native-base';

import Colors from '../constants/Layout';
import Layout from '../constants/Layout';

import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { Actions } from 'react-native-router-flux';

import ReduxActions from "../redux/actions";

import AwaitStatus from "./synchronize-status/AwaitStatus";
import OkStatus from "./synchronize-status/OkStatus";
import FailStatus from "./synchronize-status/FailStatus";
import SynchronizingStatus from "./synchronize-status/SynchronizingStatus";

export class SynchronizeModal extends React.Component {
    state = {
      progress: 0.3
    }

    constructor(props){
      super(props);
    }

    render(){
      return(
        <Container>
          <Content>
            <AwaitStatus />
            <SynchronizingStatus progress={this.state.progress} />
            <FailStatus />
            <OkStatus />
          </Content>
        </Container>
    )
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
            currentUser: state.currentUser,
            fieldGroups: state.fieldGroups
        }
    }
}

function mapDispatchToProps(dispatch, ownProps) {
    return bindActionCreators(ReduxActions.fieldGroupsActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SynchronizeModal);