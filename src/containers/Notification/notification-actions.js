import * as actionTypes from './notification-action-types';
import axios from '../../config/axios-mylife';

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

export const updateNotificationToken = (token, uniqueId, deviceName) => {
  return async dispatch => {
    try {
      const data = {
        "fcmToken": token,
        "deviceInfo": deviceName,
        "deviceUUID": uniqueId
      };
      await axios.post('user/fcm/updateToken', data);
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  };
};
