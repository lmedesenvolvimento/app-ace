import { Actions } from 'react-native-router-flux';

import Store from '../constants/Store';
import Session from '../services/Session';

import * as UserActions from '../redux/actions/user_action';

export default {
  signInWithEmailAndPasswordSuccess: (credentials) => {
    // Save in AsyncStorage
    Session.Credential.create(credentials);
    // Dispatch Userr
    Store.instance.dispatch(UserActions.setUser(credentials))
    // To route scope authorized
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
