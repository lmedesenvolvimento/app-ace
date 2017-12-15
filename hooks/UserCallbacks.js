import { Actions } from 'react-native-router-flux';

import Session from '../services/Session';

export default {
  signInWithEmailAndPasswordSuccess: (credentials) => {
    Session.currentUser = credentials;
    Session.Credential.create(credentials);
    Actions.authorized();
  },
  signInWithEmailAndPasswordFail: (error) => {
    console.warn(error);
  },
  createUserWithEmailAndPasswordSuccess: (data, password) => {
    createUserProfile(data)
    Session.Credential.create(data, password)
    Actions.authorized()
  },
  createUserWithEmailAndPasswordFail: (error) => {
    console.warn(error);
  }
}
