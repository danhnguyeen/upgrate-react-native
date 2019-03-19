import { REHYDRATE } from 'redux-persist';

import { getCurrentLocale } from './index';

const initialState = {
  preferredLanguage: getCurrentLocale(true)
}

const rehydrate = (state, action) => {
  return updateObject(state, action.payload && action.payload.translations ? { ...action.payload.translations } : {});
};

const updateObject = (oldObject, updatedProperties) => ({
  ...oldObject,
  ...updatedProperties
});

const updateLanguage = (state, action) => updateObject(state, { preferredLanguage: action.preferredLanguage });

export default translationsReducers = (state = initialState, action) => {
  switch (action.type) {
    case REHYDRATE: return rehydrate(state, action);
    case 'PREFERRED_LANGUAGE': return updateLanguage(state, action);
    default: return state;
  }
};