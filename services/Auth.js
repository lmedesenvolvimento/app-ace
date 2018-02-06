import Http from "./Http";
import { applyApolloMiddleware } from "./ApolloClient";
import Session from "./Session";

import Store from '../constants/Store';
import * as UserActions from '../redux/actions/user_actions';

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


function configCredentials(credential, callback){
  // Load LocalStorage
  if(credential.email){
    Session.Storage.get(credential.email).then((response)=>{
      // If Storage is empty
      if(!response){
        Session.Storage.create(credential.email, Session.Storage.initialState).then(()=>{
          console.log("FINISH")
          return callback ? callback() : false
        })
      } else{
        console.log("FINISH?")
        return callback ? callback() : false
      }
    })
  }
  // Dispatch Userr
  Store.instance.dispatch(UserActions.setUser(credential))
  // Config Next Requests
  Http.defaults.headers.common['X-User-Email'] = credential.email;
  Http.defaults.headers.common['X-User-Token'] = credential.authentication_token;
  // Create ApolloClient
  applyApolloMiddleware(credential)
}
