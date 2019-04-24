import axios from '../../config/axios-mylife';
import * as actionTypes from './booking-action-types';

export const setSelectedShop = (selectedShop, selectedBusiness) => {
  return {
    type: actionTypes.SET_SELECTED_SHOP,
    selectedShop,
    selectedBusiness
  };
};

const fetchBusinessSuccess = (businesses) => ({
  type: actionTypes.FETCH_BUSINESSES,
  businesses
});

export const fetchBusiness = () => {
  return async dispatch => {
    try {
      const { result } = await axios.get('business/list');
      dispatch(fetchBusinessSuccess(result));
      return Promise.resolve(result);
    } catch (err) {
      return Promise.reject(err);
    }
  };
};
