import { Location, Permissions } from 'expo';
import { simpleToast } from "./Toast"

export async function getLocationAsync() {
  const { Location, Permissions } = Expo;
  const { status } = await Permissions.askAsync(Permissions.LOCATION);
  if (status === 'granted') {
      try{
        return await Location.getCurrentPositionAsync({enableHighAccuracy: true});
      } 
      catch(e){
        simpleToast('Serviço de Localização está desabilitado')
        return false
      }
  } else {
    simpleToast('Permissão de acesso a localização negada.')
    return false
  }
}
