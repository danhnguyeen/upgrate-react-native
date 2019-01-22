import axios from '../../config/axios';
import * as actionTypes from './building-action-types'
import { Image } from 'react-native'

const fetchBuidlingsSuccess = (buildings, buildingsFilterData) => ({
  type: actionTypes.FETCH_BUILDINGS,
  buildings: buildings,
  buildingsFilterData: buildingsFilterData
})
export const fetchBuidlings = (district_id = null) => {
  return async dispatch => {
    try {
      const requestUrl = district_id ? `building?district_id=${district_id}` : 'building'
      const data = await axios.get(requestUrl)
      console.log(data)
      data.buildings.sort((a, b) => { return a.acreage_rent_array > b.acreage_rent_array ? -1 : 1 })
      data.direction_array.sort((a, b) => { return a.direction_name > b.direction_name ? 1 : -1 })
      const buildingsFilterData = {
        direction_array: data.direction_array,
        acreage: [data.min_acreage, data.max_acreage],
        rent_cost: data.rent_cost_array
      }
      const main_images = []
      data.buildings.forEach(item => { main_images.push(item.main_image) })
      _loadResourcesImage(main_images)

      dispatch(fetchBuidlingsSuccess(data.buildings, buildingsFilterData))
      return Promise.resolve(true)
    }
    catch (err) {
      console.log(err)
      return Promise.reject(err)
    }
  }
}
const fetchDistrictListSuccess = (districtList, provinceId, buildingsDistricts) => ({
  type: actionTypes.FETCH_DISTRICT,
  buildingsDistricts: buildingsDistricts,
  districtList: districtList,
  provinceId: provinceId
})
export const fetchDistrictList = (provinceId = 4) => {
  return async dispatch => {
    try {
      let buildingsDistricts = []
      const data = await axios.get(`district?province_id=${provinceId}`)
      data.sort((a, b) => {
        let newA = a.district_name
        let newB = b.district_name
        if (newA.startsWith("Quận")) {
          newA = parseInt(newA.replace("Quận", "").trim())
        }
        if (newB.startsWith("Quận")) {
          newB = parseInt(newB.replace("Quận", "").trim())
        }
        if (a.district_name.startsWith("Quận") && b.district_name.startsWith("Quận")) { return newA - newB }
        else {
          return -1
        }
      })

      data.forEach(item => { item.count_building > 0 && buildingsDistricts.push(item) })
      dispatch(fetchDistrictListSuccess(data, provinceId, buildingsDistricts))
      return Promise.resolve(data)
    }
    catch (err) {
      return Promise.reject(err)
    }
  }
}
export const fetchProvinceList = () => {
  return async dispatch => {
    try {
      const provinceList = await axios.get(`province`)
      dispatch({
        type: actionTypes.FETCH_PROVINCES,
        provinceList: provinceList
      })
      return Promise.resolve(provinceList)
    }
    catch (err) {
      return Promise.reject(err)
    }
  }
}
const fetchOfficeListSuccess = (officeList, buildingsId) => ({
  type: actionTypes.FETCH_OFFICES,
  buildingsId: buildingsId,
  officeList: officeList
})
export const fetchOfficeList = (buildingsId = 3) => {
  return async dispatch => {
    try {
      const data = await axios.get(`office?building_id=${buildingsId}`)
      // const sub_images = []
      // data.forEach(item => {
      //   sub_images.push(item.image_thumbnail_src, item.image_src)
      // })
      dispatch(fetchOfficeListSuccess(data, buildingsId))
      // _loadResourcesImage(sub_images)
      return Promise.resolve(data)
    }
    catch (err) {
      return Promise.reject(err)
    }
  }
}


const fetchBuildingDetailSuccess = (buildingDetail, buildingsId) => ({
  type: actionTypes.FETCH_BUILDING_DETAIL,
  buildingDetail: buildingDetail,
  buildingsId: buildingsId
})
export const fetchBuildingDetail = (buildingDetail) => {
  return async dispatch => {
    dispatch(fetchBuildingDetailSuccess(buildingDetail, buildingDetail.building_id));
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