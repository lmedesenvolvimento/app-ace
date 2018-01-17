import Config from "../env.json";
import { createApolloFetch } from 'apollo-fetch';

const uri = `${Config.BASEURL}/graphql`;

export function applyApolloMiddleware(credential){
  client.use(({ request, options }, next) => {
    if (!options.headers) {
      options.headers = {};
    }
    options.headers['X-User-Email'] = credential.email
    options.headers['X-User-Token'] = credential.authentication_token;
    next();
  });
}

export var client = createApolloFetch({ uri });;
