import axios from '../../config/axios-mylife';
import * as actionTypes from './home-action-types';

const fetchPromotionsNewsSuccess = (promotions, news) => ({
  type: actionTypes.FETCH_PROMOTIONS_NEWS,
  promotions,
  news
});
const fetchPromotiosNewnForBrandSuccess = (promotions) => ({
  type: actionTypes.FETCH_PROMOTIONS_FOR_BRAND,
  promotions
});
export const fetchPromotionsNews = (branchId = 0) => {
  return async dispatch => {
    try {
      let data = {
        BranchId: branchId
      };
      const {Promotions} = await axios.post('promotion/promotion/list', data);
      let promotionList = [];
      let newsList = [];
      Promotions.map((item) => {
        if (item.Type === 1) {
          promotionList.push(item);
        } else {
          newsList.push(item);
        }
      });
      if(branchId === 0){
        dispatch(fetchPromotionsNewsSuccess(promotionList, newsList));
      } else {
        dispatch(fetchPromotiosNewnForBrandSuccess(promotionList))
      }
      return Promise.resolve(Promotions);
    } catch (err) {
      return Promise.reject(err);
    }
  };
};
