import * as actionTypes from './auth-action-types';
import axios from '../../config/axios';


const authSuccess = (token, user) => ({
  type: actionTypes.AUTH_LOGIN,
  token,
  user
})
export const auth = (email, password) => {
  return async dispatch => {
    try {
      const { token, customer_id, customer } = await axios.post('login', { email, password })
      const user = { customer_id, customer }
      dispatch(authSuccess(token, user))
      return Promise.resolve(user)
    } catch (err) {
      return Promise.reject(err)
    }
  }
}

export const authSignUp = (dataRegister) => {
  return async dispatch => {
    try {
      const { token, customer_id, customer, message } = await axios.post('customer/create', dataRegister)
      let dataResolve
      if (token && customer_id && customer) {
        const user = { customer_id, customer }
        dataResolve = { token: token }
        dispatch(authSuccess(token, user))
      }
      else if (!token && message == 'Success') {
        dataResolve = {
          token: null,
          email: dataRegister.email,
          password: dataRegister.password
        }
      }
      return Promise.resolve(dataResolve)
    } catch (err) {
      return Promise.reject(err)
    }
  }
}

const authWithFacebookSuccess = (token, user) => ({
  type: actionTypes.AUTH_WITH_FACEBOOK,
  token,
  user
});

export const authWithFacebook = (access_token) => {
  return async dispatch => {
    try {
      const res = await axios.get('customer/facebook/check-token', { params: { access_token } });
      console.log(res);
      if (res.first_login === false) {
        const user = res.result;
        dispatch(authWithFacebookSuccess(res.token, user));
      } else {
        dispatch(authWithFacebookSuccess(null, res.customer));
      }
      return Promise.resolve(res.customer);
    } catch (err) {
      console.log(err)
      return Promise.reject(err);
    }
  };
};

export const logout = () => {
  return async dispatch => {
    try {
      dispatch({ type: actionTypes.AUTH_LOGOUT })
      return Promise.resolve()
    } catch (err) {
      return Promise.reject(err)
    }
  }
}



const updateUserProfile = (user) => ({
  type: actionTypes.UPDATE_USER_PROFILE,
  user
})
export const getProfile = (customer_id) => {
  return async dispatch => {
    try {
      const result = await axios.get(`customer/info?customer_id=${customer_id}`)
      consolelog('customer/info?customer_id', result)
      let user
      user.profile = result
      dispatch(updateUserProfile(user))
      return Promise.resolve()
    } catch (err) {
      return Promise.reject(err)
    }
  }
}
