import * as actionTypes from './notification-action-types';
import axios from '../../config/axios';

const fetchNotificationSucess = (notifications) => ({
  type: actionTypes.FETCH_NOTIFICATIONS,
  notifications
});
const fetchNotificationCountSucess = (count) => ({
  type: actionTypes.FETCH_NOTIFICATION_COUNT,
  count
});
const updateCheckNewNotification = (isNewNotification) => ({
  type: actionTypes.GET_NEW_NOTIFICATION,
  isNewNotification
})

// export const fetchNotifications = (data) => {
//   // return async dispatch => {
//   //   dispatch(fetchNotificationSucess(notifications));
//   // };
//   return async dispatch => {
//     try {
//       const { Notifications, ...result } = await axios.post('notification/getAll', data);
//       dispatch(fetchNotificationSucess(Notifications));
//       return Promise.resolve(result);
//     } catch (err) {
//       return Promise.reject(err);
//     }
//   };
// };

export const fetchNotificationCount = () => {
  return async dispatch => {
    const { Number } = await axios.post('notification/numberUnread');
    dispatch(fetchNotificationCountSucess(Number));
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
        fire_base_device
      };
      await axios.post('notification/create-token', data);
      console.log('create token')
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  };
};
