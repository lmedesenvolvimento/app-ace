import { AsyncStorage } from 'react-native';

export default {
  Credential: {
    create: async (credentials) => {
      try {
        await AsyncStorage.setItem(
          "@MyCredential",
          JSON.stringify(credentials.user)
        )
      } catch (e) {
        console.log(e)
      }
    },
    get: async () => {
      try{
        const credential = await AsyncStorage.getItem('@MyCredential');
        return credential ? JSON.parse(credential) : null;
      } catch(e){
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
  },
  currentUser: null,
}
