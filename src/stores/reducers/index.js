import { combineReducers } from 'redux';

import { AccountReducers } from '../../containers/account';
import { buildingReducers } from '../../containers/buildings';

export default combineReducers({
  auth: AccountReducers,
  buildings: buildingReducers
});
