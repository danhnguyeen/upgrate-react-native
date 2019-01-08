import { combineReducers } from 'redux';

import { AuthReducers } from '../../containers/auth';

export default combineReducers({
  auth: AuthReducers
});
