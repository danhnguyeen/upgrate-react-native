import * as actionTypes from './booking-action-types';
import { updateObject } from '../../util/utility';

const initialState = {
  businesses: [],
  selectedShop: null,
  selectedBusiness: null
};

const setSelectedShop = (state, action) => updateObject(state, { selectedShop: action.selectedShop, selectedBusiness: action.selectedBusiness });

const fetchBusiness = (state, action) => updateObject(state, { businesses: action.businesses });

export default function (state = initialState, action) {
  switch (action.type) {
    case actionTypes.FETCH_BUSINESSES: return fetchBusiness(state, action);
    case actionTypes.SET_SELECTED_SHOP: return setSelectedShop(state, action);
    default: return state;
  }
};
