import * as actionTypes from './notification-action-types';
import { updateObject } from '../../util/utility';

const initialState = {
  notifications: [],
  count: 0,
  isNewNotification: false
};

const fetchNotification = (state, action) => updateObject(state, {notifications: action.notifications});
const fetchNotificationCount = (state, action) => updateObject(state, {count: action.count});
const updateGetNewNotification = (state, action) => updateObject(state, {isNewNotification: action.isNewNotification});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_NOTIFICATIONS: return fetchNotification(state, action);
    case actionTypes.FETCH_NOTIFICATION_COUNT: return fetchNotificationCount(state, action);
    case actionTypes.GET_NEW_NOTIFICATION: return updateGetNewNotification(state, action);
    default: return state;
  }
};

export default reducer;
