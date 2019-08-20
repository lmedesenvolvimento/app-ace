import { combineReducers } from 'redux';

import ui from './ui';
import auth from './auth';
import network from './network';
// Models
import user from './user';
import field_groups from './field_groups';
import preferences from './preferences';
import publicareas from './publicareas';

export default combineReducers({
  ui,
  auth,
  network,
  preferences,
  publicareas,
  currentUser: user,
  fieldGroups: field_groups
});
