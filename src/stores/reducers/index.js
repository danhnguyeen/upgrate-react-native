import { combineReducers } from 'redux';

import { newsReducers } from '../../containers/news';
import { AccountReducers } from '../../containers/account';
import { buildingReducers } from '../../containers/buildings';
import { notificationReducers } from '../../containers/notifications';
import { appointmentReducers } from '../../containers/appointment';
import translationsReducers from '../../i18n/translations-reducers';

export default combineReducers({
  translations: translationsReducers,
  news: newsReducers,
  auth: AccountReducers,
  buildings: buildingReducers,
  notifications: notificationReducers,
  appointments: appointmentReducers
});
