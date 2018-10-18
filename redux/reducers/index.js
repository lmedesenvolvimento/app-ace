import { combineReducers } from 'redux';

import ui from './ui';
import auth from './auth';
import network from './network';
// Models
import user from './user';
import field_groups from './field_groups';

export default combineReducers({
  ui: ui,
  auth: auth,
  network: network,
  currentUser: user,
  fieldGroups: field_groups
});
