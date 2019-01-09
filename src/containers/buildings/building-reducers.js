import * as actionTypes from './building-action-types';
import { updateObject } from '../../util/utility';


const initialState = {
  buildings: [],
  buildingsFilterData: {},
  buildingsDistricts: [],

  provinceList: [],
  provinceId: null,
  districtList: [],

  buildingsId: null,
  buildingDetail:{},
  officeList: [],
}



const fetchBuidlings = (state, action) => updateObject(state, {
  buildings: action.buildings,
  buildingsFilterData: action.buildingsFilterData
})

const fetchDistrictList = (state, action) => updateObject(state, {
  provinceId: action.provinceId,
  districtList: action.districtList,
  buildingsDistricts: action.buildingsDistricts,
})
const fetchOfficeList = (state, action) => updateObject(state, {
  buildingsId: action.buildingsId,
  officeList: action.officeList
})

const fetchBuildingDetail = (state, action) => updateObject(state, {
  buildingDetail: action.buildingDetail,
  buildingsId: action.buildingsId,
})
const fetchProvinceList = (state, action) => updateObject(state, { provinceList: action.provinceList })

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_BUILDINGS: return fetchBuidlings(state, action)
    case actionTypes.FETCH_DISTRICT: return fetchDistrictList(state, action)
    case actionTypes.FETCH_OFFICES: return fetchOfficeList(state, action)
    case actionTypes.FETCH_BUILDING_DETAIL: return fetchBuildingDetail(state, action)
    case actionTypes.FETCH_PROVINCES: return fetchProvinceList(state, action)
    default:
      return state
  }
}

export default reducer

