import { combineReducers } from 'redux';

import { newsReducers } from '../../containers/news';
import { AccountReducers } from '../../containers/account';
import { buildingReducers } from '../../containers/buildings';
import { notificationReducers } from '../../containers/notifications';

export default combineReducers({
  news: newsReducers,
  auth: AccountReducers,
  buildings: buildingReducers,
  notifications: notificationReducers
});
