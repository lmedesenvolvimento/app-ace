import Http from "./Http";
import Session from "./Session";

import Store from '../constants/Store';
import * as UserActions from '../redux/actions/user_action';

export default {
  sign_in: async (email, password) => {
    let response = await Http.post("/api/users/sign_in", {
      user: {
        email: email,
        password: password
      }
    });
    configCredentials(response.data)
    return response.data;
  },
  configCredentials: configCredentials
}


function configCredentials(credential){
  // Dispatch Userr
  Store.instance.dispatch(UserActions.setUser(credential))
  // Config Next Requests
  Http.defaults.headers.common['X-User-Email'] = credential.email;
  Http.defaults.headers.common['X-User-Token'] = credential.authentication_token;
}
