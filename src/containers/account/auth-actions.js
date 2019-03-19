import * as actionTypes from './auth-action-types';
import axios from '../../config/axios';


const authSuccess = (token, user) => ({
  type: actionTypes.AUTH_LOGIN,
  token,
  user
});
export const auth = (email, password) => {
  return async dispatch => {
    try {
      const { token, customer } = await axios.post('login', { email, password });
      console.log(customer)
      dispatch(authSuccess(token, customer));
      return Promise.resolve(customer);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}

export const authSignUp = (dataRegister) => {
  return async dispatch => {
    try {
      const { token, customer } = await axios.post('customer/create', dataRegister);
      dispatch(authSuccess(token, customer));
      return Promise.resolve(token, customer)
    } catch (err) {
      console.log(err)
      return Promise.reject(err)
    }
  }
}

const authWithPhoneAndFacebookSuccess = (token, result) => ({
  type: actionTypes.AUTH_WITH_FACEBOOK,
  token,
  user: result.customer,
  provider: result.provider,
  provider_user_id: result.provider_user_id
});

export const authWithFacebook = (access_token) => {
  return async dispatch => {
    try {
      const res = await axios.get('customer/facebook/check-token', { params: { access_token } });
      if (res.first_login === false) {
        res.provider = 'facebook';
        console.log(res)
        dispatch(authWithPhoneAndFacebookSuccess(res.token, res));
      } else {
        dispatch(authWithPhoneAndFacebookSuccess(null, res));
      }
      return Promise.resolve(res);
    } catch (err) {
      console.log(err)
      return Promise.reject(err);
    }
  };
};

export const authWithPhone = (access_token) => {
  return async dispatch => {
    try {
      const res = await axios.get('customer/facebook-account-kit/check-token', { params: { access_token } });
      console.log(res);
      if (res.first_login === false) {
        res.provider = 'phone';
        dispatch(authWithPhoneAndFacebookSuccess(res.token, res));
      } else {
        dispatch(authWithPhoneAndFacebookSuccess(null, res));
      }
      return Promise.resolve(res);
    } catch (err) {
      console.log(err)
      return Promise.reject(err);
    }
  };
};

export const authSignUpPhoneAndFacebook = (data) => {
  return async dispatch => {
    try {
      const res = await axios.post('customer/social/create-login', data);
      dispatch(authSuccess(res.token, res.customer));
      return Promise.resolve(res.customer);
    } catch (error) {
      return Promise.reject(error);
    }
  };
};

export const logout = (customer_id, fire_base_device) => {
  return async dispatch => {
    try {
      console.log({customer_id, fire_base_device})
      const res = await axios.post('notification/remove-token', { customer_id, fire_base_device });
      console.log(res)
      dispatch({ type: actionTypes.AUTH_LOGOUT });
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  }
}

export const updateProfile = (profile) => ({
  type: actionTypes.AUTH_UPDATE_PROFILE,
  profile
});

const updateUserProfile = (user) => ({
  type: actionTypes.UPDATE_USER_PROFILE,
  user
})
export const getProfile = (customer_id) => {
  return async dispatch => {
    try {
      const result = await axios.get(`customer/info?customer_id=${customer_id}`);
      dispatch(updateUserProfile(result))
      return Promise.resolve()
    } catch (err) {
      return Promise.reject(err)
    }
  }
}
