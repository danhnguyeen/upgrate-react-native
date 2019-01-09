import { combineReducers } from 'redux';

import { AuthReducers } from '../../containers/auth';
import { buildingReducers } from '../../containers/buildings';

export default combineReducers({
  auth: AuthReducers,
  buildings: buildingReducers
});
