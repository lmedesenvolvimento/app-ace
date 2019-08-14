import Constants from 'expo-constants';
import { createApolloFetch } from 'apollo-fetch';

const baseurl = Constants.manifest.extra.baseurl;
const uri = `${baseurl}graphql`;

export function applyApolloMiddleware(credential){
  client.use(({ options }, next) => {
    if (!options.headers) {
      options.headers = {};
    }
    options.headers['X-User-Email'] = credential.email;
    options.headers['X-User-Token'] = credential.authentication_token;
    next();
  });
}

export var client = createApolloFetch({ uri });
