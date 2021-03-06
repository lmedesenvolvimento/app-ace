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
      errorAfterSync: false,
      progress: 0.0,
    };
  }

  render(){
    const { state, props } = this;
    const { network } = props.state;

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
                <OkStatus onBackButton={this.toAwaitStatus} errorAfterSync={state.errorAfterSync} />
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
  const { props, state } = this;
  let { currentUser } = props.state;
  let emptyArray = []
    
  // Limpando States
  props.setFieldGroups(emptyArray)
 
  // Limpando gravações antigas do usuário
  Session.Storage.destroy(currentUser.data.email)

  if (!state.errorAfterSync) this.setState({ errorAfterSync: false })

  // Carregando novo estado da Aplicação
  props.getFieldGroups(null, () => {
    // onFail
    this.setState({ errorAfterSync: true })
  })

  this.setState({ status: SynchronizeStatus.done })
}

onStartSyncFail(err){
  let { response } = err;
  let { msg, error } = response.data;

  console.log(err);

  switch (response.status) {
    case 200:
      msg = 'Sessão de usuário já expirada, por favor efetue login novamente e tente de novo.';
      // user feedback
      simpleToast(msg);
      // Redirect for unauthorized
      Actions.unauthorized({type: ActionConst.RESET});
      break;
    default:
      simpleToast(msg || error)
      break;
  }

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

function mapStateToProps({ network, currentUser, fieldGroups }) {
  return {
    state: {
      network,
      currentUser,
      fieldGroups
    }
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return bindActionCreators(ReduxActions.fieldGroupsActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SynchronizeModal);