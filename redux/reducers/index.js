import { combineReducers } from 'redux';

import ui from './ui';
import auth from './auth';
import network from './network';
// Models
import user from './user';
import field_groups from './field_groups';
import preferences from './preferences';

export default combineReducers({
  ui,
  auth,
  network,
  preferences,
  currentUser: user,
  fieldGroups: field_groups
});
