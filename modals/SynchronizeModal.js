import React from 'react';

import {
  Container,
  Content,
} from 'native-base';

import Http from '../services/Http';

import { connect } from 'react-redux';
import { bindActionCreators } from "redux";

import ReduxActions from "../redux/actions";

import AwaitStatus from "./synchronize-status/AwaitStatus";
import OkStatus from "./synchronize-status/OkStatus";
import FailStatus from "./synchronize-status/FailStatus";
import OfflineStatus from "./synchronize-status/OfflineStatus";
import SynchronizingStatus from "./synchronize-status/SynchronizingStatus";

import Session from '../services/Session';
import { simpleToast } from '../services/Toast';

const SynchronizeStatus = {
  wait: 1,
  syncing: 2,
  fail: 3,
  done: 4,
}

export class SynchronizeModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      status: SynchronizeStatus.wait,
      progress: 0.0
    };
  }

  render(){
    let { network } = this.props.state;

    if(network.isConnected){
      switch (this.state.status) {
        case SynchronizeStatus.wait:
          return(
            <Container>
              <Content>
                <AwaitStatus onStartSync={this.onStartSync.bind(this)} />
              </Content>
            </Container>
          )          
        case SynchronizeStatus.syncing:
          return(
            <Container>
              <Content>
                <SynchronizingStatus progress={this.state.progress} />
              </Content>
            </Container>
          )
        case SynchronizeStatus.fail:
          return(
            <Container>
              <Content>
                <FailStatus onBackButton={this.toAwaitStatus} />
              </Content>
            </Container>
          )
        case SynchronizeStatus.done:
          return(
            <Container>
              <Content>
                <OkStatus onBackButton={this.toAwaitStatus} />
              </Content>
            </Container>
          )
        default:
          return(
            <Container>
              <Content>
                <AwaitStatus onStartSync={this.onStartSync.bind(this)} />
              </Content>
            </Container>
        )
    }
  } else{
    return (
      <Container>
        <Content>
          <OfflineStatus />
        </Content>
      </Container>
    );
  }
}  

onStartSync(){
  this.setState({status: SynchronizeStatus.syncing, progress: 0})

  setTimeout(() => {
    this.setState({ progress: 1 })
  }, 400)

  setTimeout(this.startSync.bind(this), 1400);
}

onStartSyncSuccess(response){
  let { currentUser } = this.props.state;
  let emptyArray = []
    
  // Limpando Storage
  Session.Storage.destroy(currentUser.data.email)
  // Limpando States
  this.props.setFieldGroups(emptyArray)
  // Carregando novo estado da Aplicação
  this.props.getFieldGroups()

  this.setState({status: SynchronizeStatus.done})
  
}

onStartSyncFail(_error){
  let { msg, err, error } = _error.response.data;
  simpleToast(msg || error)
  this.setState({status: SynchronizeStatus.fail})
}

toAwaitStatus = () => {
  this.setState({status: SynchronizeStatus.wait})
}

startSync = () => {
  Http({
    url: "/api/data/sync.json",
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-User-Email': this.props.state.currentUser.data.email,
      'X-User-Token': this.props.state.currentUser.data.authentication_token
    },
    data: {
      data: this.props.state.fieldGroups.data
    }
  })
    .then(this.onStartSyncSuccess.bind(this))
    .catch(this.onStartSyncFail.bind(this));
}
}

function mapStateToProps(state) {
  return {
    state: {
      network: state.network,
      currentUser: state.currentUser,
      fieldGroups: state.fieldGroups
    }
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return bindActionCreators(ReduxActions.fieldGroupsActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SynchronizeModal);