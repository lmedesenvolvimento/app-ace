import { AsyncStorage } from 'react-native';

let Session = {
  Credential: {
    create: async (credentials) => {
      try {
        await AsyncStorage.setItem(
          "@MyCredential",
          JSON.stringify(credentials)
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
  Storage: {
    initialState: { data: [] },
    create: async (key, value) => {
      try {
        await AsyncStorage.setItem(
          key,
          JSON.stringify(value)
        )
        let data = await AsyncStorage.getItem(key);
        // Put in cache for easy access
        Session.Storage.cache = data
      } catch (e) {
        console.log(e)
      }
    },
    get: async (key) => {
      try{
        const data = await AsyncStorage.getItem(key);
        Session.Storage.cache = data ? JSON.parse(data) : null
        return Session.Storage.cache;
      } catch(e){
        return null
      }
    },
    destroy: async (key) => {
      try {
        await AsyncStorage.removeItem(key)
      } catch (e) {
        console.warn(e)
      }
    },
    cache: null
  },
  currentUser: null,
}

export default Session;
