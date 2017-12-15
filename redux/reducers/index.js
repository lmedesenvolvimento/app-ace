import { combineReducers } from 'redux';

import routes from './routes';
import network from './network';

export default combineReducers({
  router: routes,
  network: network
});
