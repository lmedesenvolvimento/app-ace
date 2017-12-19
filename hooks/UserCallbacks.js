import { Actions } from 'react-native-router-flux';

import Store from '../constants/Store';
import Session from '../services/Session';

import * as UserActions from '../redux/actions/user_actions';

export default {
  signInWithEmailAndPasswordSuccess: (credentials) => {
    let { user } = credentials;
    // Save in AsyncStorage
    Session.Credential.create(user);
    // Dispatch Userr
    Store.instance.dispatch(UserActions.setUser(user));
    // To route scope authorized
    Actions.authorized();
  },
  signInWithEmailAndPasswordFail: (error) => {
    console.warn(error);
  }
}
