import { combineReducers } from 'redux';

import auth from './auth';
import network from './network';
// Models
import user from './user';
import field_groups from './field_groups';
import visit from './visit';

export default combineReducers({
  auth: auth,
  network: network,
  currentUser: user,
  fieldGroups: field_groups,
  visit: visit
});
