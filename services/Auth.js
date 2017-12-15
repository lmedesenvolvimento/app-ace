import Http from "./Http";
import Session from "./Session";

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
  Session.currentUser = credential
  Http.defaults.headers.common['X-User-Email'] = credential.email;
  Http.defaults.headers.common['X-User-Token'] = credential.authentication_token;
}
