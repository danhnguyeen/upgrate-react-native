import { AsyncStorage } from 'react-native';
import * as actionTypes from './auth-action-types';
import axios from '../../config/axios-mylife';

const authSuccess = (token, user, loginWithFbAccountKit=false) => ({
  type: actionTypes.AUTH_LOGIN,
  token,
  user,
  loginWithFbAccountKit
});
export const auth = (email, password) => {
  return async dispatch => {
    try {
      const { token, result, profile } = await axios.post('auth/loginWithEmail', { email, password });
      await AsyncStorage.setItem('token', token);
      const user = result[0];
      user.profile = profile;
      dispatch(authSuccess(token, user));
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  };
};

export const updateProfile = (profile) => ({
  type: actionTypes.AUTH_UPDATE_PROFILE,
  profile
});

const updateUserProfile = (user) => ({
  type: actionTypes.UPDATE_USER_PROFILE,
  user
});
export const getProfile = () => {
  return async dispatch => {
    try {
      const { result, profile, TicketData } = await axios.get('user/profile/get', { params: { langid: 1 }});
      const user = result[0];
      user.profile = profile;
      dispatch(updateUserProfile(user));
      user.TicketData = TicketData;
      return Promise.resolve(user);
    } catch (err) {
      return Promise.reject(err);
    }
  };
};

const fetchCardSuccess = (cards) => ({
  type: actionTypes.FETCH_CARD,
  cards
});
export const fetchCard = () => {
  return async dispatch => {
    try {
      const { result } = await axios.get('promotion/ListVIPCardType');
      dispatch(fetchCardSuccess(result));
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  };
};

export const pointQRcode = (data) => {
  return async dispatch => {
    try {
      const array = data.split(',');
      const params = {
        langid: 1
      };
      if (array.length) {
        params.billcode = array[0];
        params.branchid = array[1];
      }
      const result = await axios.get('ticket/bill', { params });
      return Promise.resolve(result);
    } catch (err) {
      let msg = err.msg;
      if (err.result && err.result.error) {
        msg = err.result.error[0].ErrorMsg;
      }
      err.msg = msg;
      return Promise.reject(err);
    }
  }
};

const authWithFacebookSuccess = (token, user) => ({
  type: actionTypes.AUTH_WITH_FACEBOOK,
  token,
  user
});

export const authWithFacebook = (fbToken) => {
  return async dispatch => {
    try {
      const res = await axios.post(`auth/signin/fb?token=${fbToken}`);
      if (res.status === 0) {
        const user = res.result;
        user.profile = res.profile;
        await AsyncStorage.setItem('token', res.token);
        dispatch(authWithFacebookSuccess(res.token, user));
      } else {
        dispatch(authWithFacebookSuccess(null, res.result));
      }
      return Promise.resolve(res.result);
    } catch (err) {
      return Promise.reject(err);
    }
  };
};

const authWithPhoneSuccess = (token, user) => ({
  type: actionTypes.AUTH_WITH_PHONE,
  token,
  user
});

export const authWithPhone = (accountKitToken) => {
  return async dispatch => {
    try {
      const res = await axios.post(`auth/signin/phone?token=${accountKitToken}`);
      if (res.status === 0) {
        const user = res.result;
        user.profile = res.profile;
        await AsyncStorage.setItem('token', res.token);
        dispatch(authWithPhoneSuccess(res.token, user));
      } else {
        dispatch(authWithPhoneSuccess(null, res.result));
      }
      return Promise.resolve(res);
    } catch (err) {
      return Promise.reject(err);
    }
  };
};

export const authSignUpPhoneAndFacebook = (userId, data, loginType) => {
  return async dispatch => {
    try {
      const res = await axios.post(`auth/initupdateprofile/${userId}`, data);
      const user = res.result[0];
      user.profile = res.profile;
      await AsyncStorage.setItem('token', res.token);
      dispatch(authSuccess(res.token, user, loginType));
      return Promise.resolve(res);
    } catch (error) {
      return Promise.reject(error);
    }
  };
};

export const logout = () => ({
  type: actionTypes.AUTH_LOGOUT
});
