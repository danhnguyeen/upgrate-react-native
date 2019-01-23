import { combineReducers } from 'redux';

import { AccountReducers } from '../../containers/account';
import { buildingReducers } from '../../containers/buildings';
import { notificationReducers } from '../../containers/notifications';

export default combineReducers({
  auth: AccountReducers,
  buildings: buildingReducers,
  notifications: notificationReducers
});
