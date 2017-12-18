import { Platform, ToastAndroid, NetInfo } from 'react-native';

import Store from "../constants/Store";

import * as NetworkAction from "../redux/actions/network_actions";

TYPES = {
  none: 'none',
  wifi: 'wifi',
  cellular: 'cellular',
  unknown: 'unknown'
}

class Network {
  isConnected = false

  onConnectivityChange = (isConnected) => {
    if(isConnected){
      this.isConnected = true
      Store.instance.dispatch(NetworkAction.setStatusOnline())
    } else{
      this.isConnected = false      
      Store.instance.dispatch(NetworkAction.setStatusOffline())
    }
  }
}

NetInfo.isConnected.addEventListener(
  'connectionChange',
  (isConnected) => network.onConnectivityChange(isConnected)
);

network = new Network()

export default network;
