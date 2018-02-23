import React from 'react';
import { View, Platform, ProgressBarAndroid, ProgressViewIOS } from 'react-native';

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

import Colors from '../constants/Layout';
import Layout from '../constants/Layout';

import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { Actions } from 'react-native-router-flux';

import ReduxActions from "../redux/actions";

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
          <View style={[styles.container, Layout.padding]}>
            {
              (Platform.OS === 'android')
                ?
                (<ProgressBarAndroid styleAttr="Horizontal" style={styles.progress} progress={this.state.progress} indeterminate={false} /> )
                :
                (<ProgressViewIOS style={styles.progress} progress={this.state.progress} /> )
            }
          </View>
        </Container>
      );
    }
}

const styles = {
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  progress: {
    flex: 1,    
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