import { AsyncStorage } from 'react-native';

export default {
  create: async (credential) => {
    try {
      await AsyncStorage.setItem("@MyCredential", JSON.stringify(credential))
    } catch (e) {
      console.log(e)
    }
  },
  get: async () => {
    try{
      const credential = await AsyncStorage.getItem('@MyCredential');
      return credential ? JSON.parse(credential) : null;
    } catch(e){
      console.log(e)
      return null
    }
  },
  destroy: async () => {
    try {
      await AsyncStorage.removeItem('@MyCredential')
    } catch (e) {
      console.warn(e)
    }
  }
}
