import { REHYDRATE } from 'redux-persist';
import * as actionTypes from './home-action-types';

import { updateObject } from '../../util/utility';

const initialState = {
  promotions: [],
  news: [],
  promotionsForBrand: [],
};

// const rehydrate = (state, action) => {
//   if (action.payload) {
//     return {
//       ...state,
//       news: action.payload.news,
//       promotions: action.payload.promotions
//     };
//   } else {
//     return state;
//   }
// };


const fetchPromotionsNews = (state, action) => updateObject(state, { news: action.news, promotions: action.promotions });

const fetchPromotionForBrand = (state, action) => updateObject(state, { promotionsForBrand: action.promotions });

const reducer = (state = initialState, action) => {
  switch (action.type) {
    // case REHYDRATE: return rehydrate(state, action);
    case actionTypes.FETCH_PROMOTIONS_NEWS: return fetchPromotionsNews(state, action);
    case actionTypes.FETCH_PROMOTIONS_FOR_BRAND: return fetchPromotionForBrand(state, action);
    default:
      return state;
  }
};

export default reducer;

