import * as actionTypes from './appointment-action-types';
import { updateObject } from '../../util/utility';

const initialState = {
  appointments: []
};

const fetchAppointments = (state, action) => updateObject(state, { appointments: action.appointments });

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_APPOINTMENTS: return fetchAppointments(state, action)
    default:
      return state
  }
};

export default reducer;

