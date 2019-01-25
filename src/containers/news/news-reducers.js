import * as actionTypes from './news-action-types';
import { updateObject } from '../../util/utility';

const initialState = {
  news: [],
  specialNews: [],
}

const fetchNews = (state, action) => updateObject(state, { news: action.news, specialNews: action.specialNews })

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_NEWS: return fetchNews(state, action)
    default:
      return state
  }
}

export default reducer

