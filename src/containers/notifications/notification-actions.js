import * as actionTypes from './notification-action-types';
import axios from '../../config/axios-mylife';
import { getCurrentLocale } from '../../i18n';

export const fetchNotificationCountSucess = (count) => ({
  type: actionTypes.FETCH_NOTIFICATION_COUNT,
  count
});
const updateCheckNewNotification = (isNewNotification) => ({
  type: actionTypes.GET_NEW_NOTIFICATION,
  isNewNotification
})

export const fetchNotificationCount = (customer_id) => {
  return async dispatch => {
    const { count } = await axios.get('notification/count', { params: { customer_id } });
    dispatch(fetchNotificationCountSucess(count));
  };
};

export const checkNewNotification = (isNewNotification) => {
  return async dispatch => {
    dispatch(updateCheckNewNotification(isNewNotification));
  };
};

export const updateNotificationToken = (customer_id, fire_base_token, fire_base_device) => {
  return async dispatch => {
    try {
      const data = {
        customer_id,
        fire_base_token,
        fire_base_device,
        locale: getCurrentLocale()
      };
      const rest = await axios.post('notification/create-token', data);
      console.log(rest);
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  };
};
