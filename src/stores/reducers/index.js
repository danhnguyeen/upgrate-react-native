import { combineReducers } from 'redux';

// import { newsReducers } from '../../containers/news';
import { authReducers } from '../../containers/Login';
import { homeReducers } from '../../containers/Home';
import appState from './appStateReducer';
import { notificationReducers } from '../../containers/notifications';
// import { appointmentReducers } from '../../containers/appointment';
// import translationsReducers from '../../i18n/translations-reducers';
import { bookingReducers } from '../../containers/BookTable';

export default combineReducers({
  bookingTable: bookingReducers,
  // translations: translationsReducers,
  // news: newsReducers,
  appState,
  auth: authReducers,
  homeState: homeReducers,
  notificationState: notificationReducers,
  // appointments: appointmentReducers
});
