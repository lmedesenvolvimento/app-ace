import { Platform, ToastAndroid, NetInfo } from 'react-native';

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
    } else{
      this.isConnected = false
      if(Platform.OS === 'ios'){
        alert("Problemas com Conexão, Modo offline ativo")
      } else{
        ToastAndroid.show('Problemas com Conexão, Modo offline ativo', ToastAndroid.LONG);
      }
    }
  }
}

NetInfo.isConnected.addEventListener(
  'connectionChange',
  (isConnected) => network.onConnectivityChange(isConnected)
);

network = new Network()

export default network;
