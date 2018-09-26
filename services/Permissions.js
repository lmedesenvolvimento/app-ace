import Expo from 'expo';

export async function getLocationAsync() {
  const { Location, Permissions } = Expo;
  try{
    const { status } = await Permissions.askAsync(Permissions.LOCATION);

    if (status === 'granted') {
        try{
          return await Location.getCurrentPositionAsync({enableHighAccuracy: false});
        } 
        catch(error){
          throw new Error('Falha, por favor habilite a alta precisão de localização em seu dispositivo.');
        }
    } else {
      throw new Error('Permissão de acesso a localização negada, por favor habilite o acesso a localização.');
    }
  } catch(error){
    throw error;
  }
};
