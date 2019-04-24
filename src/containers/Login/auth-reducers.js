import { REHYDRATE } from 'redux-persist';

import { updateObject } from '../../util/utility';
import * as actionTypes from './auth-action-types';

const initialState = {
  accountKitToken: null,
  token: null,
  user: null,
  error: null,
  loading: false,
  authRedirectPath: '/',
  loginWithFbAccountKit: false,
  cards: [],
  isInit: true
};

const rehydrate = (state, action) => {
  return updateObject(state, action.payload && action.payload.auth ?
  {
    ...action.payload.auth,
    error: null,
    loading: false,
    authRedirectPath: '/',
  }
  : {});
};

const auth = (state, action) => updateObject(state, { 
  token: action.token, 
  user: action.user,
  loginWithFbAccountKit: action.loginWithFbAccountKit
});

const authWithFacebook = (state, action) => updateObject(state, { 
  token: action.token,
  user: action.user,
  loginWithFbAccountKit: 1
});

const authWithPhone = (state, action) => updateObject(state, { 
  token: action.token, 
  user: action.user,
  loginWithFbAccountKit: 2
});

const updateProfile = (state, action) => {
  const user = Object.assign(state.user, action.profile);
  return updateObject(state, { user });
};

const updateUserProfile = (state, action) => updateObject(state, { user: action.user });

const fetchCard = (state, action) => updateObject(state, { cards: action.cards });

const authLogout = (state) => updateObject(state, { token: null, user: null });

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case REHYDRATE: return rehydrate(state, action);
    case actionTypes.AUTH_LOGIN: return auth(state, action);
    case actionTypes.AUTH_WITH_FACEBOOK: return authWithFacebook(state, action);
    case actionTypes.AUTH_WITH_PHONE: return authWithPhone(state, action);
    case actionTypes.AUTH_UPDATE_PROFILE: return updateProfile(state, action);
    case actionTypes.UPDATE_USER_PROFILE: return updateUserProfile(state, action);
    case actionTypes.FETCH_CARD: return fetchCard(state, action);
    case actionTypes.AUTH_LOGOUT: return authLogout(state, action);
    default: return state;
  }
};

export default reducer;
