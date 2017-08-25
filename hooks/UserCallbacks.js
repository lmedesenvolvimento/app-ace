import { Actions } from 'react-native-router-flux';

import Session from '../constants/Session';
import FireBaseApp from '../constants/FirebaseApp';

export default {
  signInWithEmailAndPasswordSuccess: (data, password) => {
    createUserProfile(data)
    Session.create(data, password)
    Actions.authorized()
  },
  signInWithEmailAndPasswordFail: (error) => {
    console.warn(error);
  },
  createUserWithEmailAndPasswordSuccess: (data, password) => {
    createUserProfile(data)
    Session.create(data, password)
    Actions.authorized()
  },
  createUserWithEmailAndPasswordFail: (error) => {
    console.warn(error);
  }
}

async function createUserProfile(user) {
  await FireBaseApp.database().ref(`/users/${user.uid}/profile`).set({
    email: user.email,
  })
}
