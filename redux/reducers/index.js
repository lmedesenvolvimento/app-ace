import { combineReducers } from 'redux';

import routes from './routes';
import network from './network';
import user from './user';

export default combineReducers({
  router: routes,
  network: network,
  currentUser: user,
});
