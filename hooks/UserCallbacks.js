import { Platform, ToastAndroid } from "react-native";
import { Actions } from 'react-native-router-flux';

import Store from '../constants/Store';
import Session from '../services/Session';

import * as UserActions from '../redux/actions/user_actions';
import * as AuthActions from '../redux/actions/auth_actions';

export default {
  signInWithEmailAndPasswordSuccess: (credentials) => {
    let { user } = credentials;
    // Save in AsyncStorage
    Session.Credential.create(user);
    // Dispatch Userr
    Store.instance.dispatch(UserActions.setUser(user));
    Store.instance.dispatch(AuthActions.toDone());
    // To route scope authorized
    Actions.authorized();
  },
  signInWithEmailAndPasswordFail: (error) => {
    Store.instance.dispatch(AuthActions.toDone());

    console.log(error)

    if (Platform.OS == 'ios'){
      alert(error.response.data.error)
    } else{
      ToastAndroid.show(error.response.data.error, ToastAndroid.SHORT);
    }
    console.log(error.response.data);
  }
}
