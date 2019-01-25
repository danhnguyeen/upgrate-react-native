import axios from '../../config/axios';
import * as actionTypes from './news-action-types'
import { Image } from 'react-native'

const fetchNewsSuccess = (news, specialNews) => ({
  type: actionTypes.FETCH_NEWS,
  news: news,
  specialNews: specialNews
})
export const fetchNews = () => {
  return async dispatch => {
    try {
      await axios.get('news/list')
        .catch(err => { return Promise.reject(err) })
        .then(async (result) => {
          let news = []
          let specialNews = []
          let main_images = []
          result.map((item) => {
            main_images.push(item.image)
            item.special === 1 ? specialNews.push(item) : news.push(item)
          })
          dispatch(fetchNewsSuccess(news, specialNews))
          await _loadResourcesImage(main_images)
          return Promise.resolve(result)
        })
    }
    catch (err) {
      return Promise.reject(err)
    }
  }
}
const _loadResourcesImage = async (sub_images) => {
  let imageAssets = []
  imageAssets = imageAssets.concat(sub_images)
  return Promise.all([
    await imageAssets.map(image => {
      if (typeof image === 'string') {
        Image.prefetch(image).catch((ignored) => {
          return false
        })
      }
    })
  ])
}