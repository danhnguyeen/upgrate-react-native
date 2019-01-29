
import { setLocale } from './index';

const setLanguageSuccess = (preferredLanguage) => ({
  type: 'PREFERRED_LANGUAGE',
  preferredLanguage: preferredLanguage,
});
export const setLanguage = (preferredLanguage) => {
  return async dispatch => {
    try {
      setLocale(preferredLanguage)
      dispatch(setLanguageSuccess(preferredLanguage));
      return Promise.resolve(preferredLanguage);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
