import axios from '../../config/axios';
import * as actionTypes from './appointment-action-types';

const fetchAppointmentsSuccess = (appointments) => ({
  type: actionTypes.FETCH_APPOINTMENTS,
  appointments,
});
export const fetchAppointments = (customer_id) => {
  return async dispatch => {
    try {
      console.log(customer_id)
      const result = await axios.get('appointment/list', { params: { customer_id } });
      console.log(result)
      dispatch(fetchAppointmentsSuccess(result));
      return Promise.resolve(result);
    } catch (err) {
      console.log(err)
      return Promise.reject(err)
    }
  }
};
