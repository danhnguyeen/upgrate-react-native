import { getCurrentLocale } from './index';

const initialState = {
  preferredLanguage: getCurrentLocale()
}

const updateObject = (oldObject, updatedProperties) => ({
  ...oldObject,
  ...updatedProperties
});
const updateLanguage = (state, action) => updateObject(state, { preferredLanguage: action.preferredLanguage });

export default translationsReducers = (state = initialState, action) => {
  switch (action.type) {
    case 'PREFERRED_LANGUAGE': return updateLanguage(state, action);
    default: return state;
  }
};