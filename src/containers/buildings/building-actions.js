import axios from '../../config/axios';
import * as actionTypes from './building-action-types';
import { getCurrentLocale } from '../../i18n';

const fetchBuidlingsSuccess = (buildings, buildingsFilterData) => ({
  type: actionTypes.FETCH_BUILDINGS,
  buildings: buildings,
  buildingsFilterData: buildingsFilterData
})
export const fetchBuidlings = (district_id = null) => {
  return async dispatch => {
    try {
      const requestUrl = district_id ? `building?district_id=${district_id}` : 'building'
      const data = await axios.get(requestUrl);
      data.buildings.sort((a, b) => { return a.acreage_rent_array > b.acreage_rent_array ? -1 : 1 });
      data.direction_array.sort((a, b) => { return a[`direction_name_${getCurrentLocale()}`] > b[`direction_name_${getCurrentLocale()}`] ? 1 : -1 })
      const buildingsFilterData = {
        direction_array: data.direction_array,
        acreage: [data.min_acreage, data.max_acreage],
        rent_cost: data.rent_cost_array
      }
      console.log(data.buildings);
      dispatch(fetchBuidlingsSuccess(data.buildings, buildingsFilterData))
      return Promise.resolve()
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
      const data = await axios.get(`district?province_id=${provinceId}`);
      console.log(data);
      data.sort((a, b) => {
        let newA = a.district_name_vi
        let newB = b.district_name_vi
        if (newA.startsWith("Quận")) {
          newA = parseInt(newA.replace("Quận", "").trim())
        }
        if (newB.startsWith("Quận")) {
          newB = parseInt(newB.replace("Quận", "").trim())
        }
        if (a.district_name_vi.startsWith("Quận") && b.district_name_vi.startsWith("Quận")) { return newA - newB }
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
      dispatch(fetchOfficeListSuccess(data, buildingsId))
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