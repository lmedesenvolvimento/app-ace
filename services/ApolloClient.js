import Config from '../env.json';
import ProductionConfig from '../env.production.json';
import { createApolloFetch } from 'apollo-fetch';

const baseurl = (__DEV__ ? Config.BASEURL : ProductionConfig);
const uri = `${baseurl}/graphql`;

export function applyApolloMiddleware(credential){
  client.use(({ options }, next) => {
    if (!options.headers) {
      options.headers = {};
    }
    options.headers['X-User-Email'] = credential.email
    options.headers['X-User-Token'] = credential.authentication_token;
    next();
  });
}

export var client = createApolloFetch({ uri });;
