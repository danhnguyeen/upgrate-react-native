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
      const { token, customer_id, customer, message } = await axios.post('customer/create', dataRegister);
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
      console.log(res);
      if (res.first_login === false) {
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
