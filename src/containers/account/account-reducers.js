import { REHYDRATE } from 'redux-persist';

import { updateObject } from '../../util/utility';
import * as actionTypes from './auth-action-types';

const initialState = {
	accountKitToken: null,
	provider: null,
	provider_user_id: null,
	token: null,
	user: null,
	loginWithFbAccountKit: false
};

const rehydrate = (state, action) => {
	return updateObject(state, action.payload && action.payload.auth ?
		{ ...action.payload.auth }
		: {});
};

const authWithFacebook = (state, action) => updateObject(state, {
	token: action.token,
	user: action.user,
	provider: action.provider,
	provider_user_id: action.provider_user_id,
	loginWithFbAccountKit: true
});

const authWithPhone = (state, action) => updateObject(state, {
	token: action.token,
	user: action.user,
	provider: action.provider,
	provider_user_id: action.provider_user_id,
	loginWithFbAccountKit: true
});

const updateProfile = (state, action) => {
	const user = Object.assign(state.user, action.profile);
	return updateObject(state, { user });
};

const updateUserProfile = (state, action) => updateObject(state, { user: action.user });

const auth = (state, action) => updateObject(state, {
	token: action.token,
	user: action.user,
	loginWithFbAccountKit: action.loginWithFbAccountKit
});

const authLogout = (state) => updateObject(state, { 
	accountKitToken: null,
	provider: null,
	provider_user_id: null,
	token: null,
	user: null,
	loginWithFbAccountKit: false
});

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case REHYDRATE: return rehydrate(state, action);
		case actionTypes.AUTH_LOGIN: return auth(state, action);
		case actionTypes.AUTH_LOGOUT: return authLogout(state, action);
		case actionTypes.AUTH_WITH_FACEBOOK: return authWithFacebook(state, action);
		case actionTypes.AUTH_UPDATE_PROFILE: return updateProfile(state, action);

		case actionTypes.UPDATE_USER_PROFILE: return updateUserProfile(state, action);
		default: return state;
	}
};

export default reducer;
