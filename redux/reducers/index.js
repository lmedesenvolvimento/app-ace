import { combineReducers } from 'redux';

import auth from './auth';
import routes from './routes';
import network from './network';
import user from './user';

export default combineReducers({
  auth: auth,
  network: network,
  currentUser: user,
});
