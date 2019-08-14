import { Actions } from 'react-native-router-flux';

import Store from '../constants/Store';
import Session from '../services/Session';

import { simpleToast } from '../services/Toast';
import { applyApolloMiddleware } from '../services/ApolloClient';

import * as UserActions from '../redux/actions/user_actions';
import * as AuthActions from '../redux/actions/auth_actions';

export default {
  signInWithEmailAndPasswordSuccess: (credential) => {
    let { user } = credential;
    // Config Apollo
    applyApolloMiddleware(user);
    // Save in AsyncStorage
    Session.Credential.create(user);
    // Dispatch Userr
    Store.instance.dispatch(UserActions.setUser(user));
    Store.instance.dispatch(AuthActions.toDone());
    // To route scope authorized
    Actions.authorized({type: 'reset'});
  },
  signInWithEmailAndPasswordFail: (error) => {
    Store.instance.dispatch(AuthActions.toDone());
    if (error){
      if (error.response) {
        return simpleToast(error.response.data.error);
      }
      return simpleToast('Error na conexão, por favor tente novamente!')
    }
  }
};