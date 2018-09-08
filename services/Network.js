import { NetInfo } from 'react-native';

import Store from '../constants/Store';

import * as NetworkAction from '../redux/actions/network_actions';

// const TYPES = {
//   none: 'none',
//   wifi: 'wifi',
//   cellular: 'cellular',
//   unknown: 'unknown'
// };

function onConnectivityChange(isConnected) {
  if(isConnected){
    Store.instance.dispatch(NetworkAction.setStatusOnline());
  } else{
    Store.instance.dispatch(NetworkAction.setStatusOffline());
  }
}

export function watchConnection(){
  NetInfo.isConnected.addEventListener(
    'connectionChange',
    (isConnected) => onConnectivityChange(isConnected)
  );
}
