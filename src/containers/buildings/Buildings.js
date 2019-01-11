import React from 'react'
import { connect } from 'react-redux'
import { TouchableOpacity, View, StyleSheet, RefreshControl } from 'react-native'
import { Container, Content, Text, Icon, } from "native-base"

import * as actions from './building-actions';
import { winW, winH, isEmpty } from '../../util/utility';
import { backgroundColor, brandPrimary, DEVICE_WIDTH } from '../../config/variables';
import { TagBuilding } from '../../components/buildings';
import BuildingFilter from './BuildingFilter';

const ITEM_Margin = 10
const ITEM_W = DEVICE_WIDTH / 2 - (ITEM_Margin)
const DEFAULT = [0, 500]
const FilterDefault = {
  district: null,
  rent_cost: null,
  acreage: null,
  direction: null,
}


const RenderTagBuilding = (props) => (
  <TouchableOpacity style={{ width: ITEM_W, height: winH(26), minHeight: winW(47), paddingLeft: ITEM_Margin, paddingVertical: winW(2) }}
    onPress={() => {
      props._onfetchBuildingDetail(props.data.building_id)
      props.navigation.navigate('BuildingDetails', { building_id: props.data.building_id })
    }}  >
    <TagBuilding detailBuilding={props.data} />
  </TouchableOpacity>
)

class Buildings extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      filterRequired: FilterDefault,
      filterData: FilterDefault,
      listBuildings: [],
      districList: [],
      isFetching: true,
      modalVisible: false,
      refreshing: false
    }
    this._isMounted = false
  }

  componentWillUnmount() {
    this._isMounted = false
  }
  componentDidMount() {
    this._isMounted = true
    // this._isMounted && this._onRefresh()
    if (this._isMounted) {
      const { buildings, districtList, buildingsFilterData } = this.props
      if (isEmpty(buildings) || isEmpty(districtList) || isEmpty(buildingsFilterData)) {
        this._onRefresh()
      }
      this.setState({ isFetching: false })
    }
  }
  _onRefresh = async () => {
    this.setState({ refreshing: true })
    await Promise.all([
      this.props._onfetchBuidlings(),
      this.props._onfetchDistrictList()
    ])
    this.setState({ refreshing: false, })
  }
  _clearFilterPress = (item = 'all') => {
    let { filterRequired } = this.state
    switch (item) {
      case 'district':
        filterRequired.district = null
        break
      case 'rent_cost':
        filterRequired.rent_cost = null
        break
      case 'acreage':
        filterRequired.acreage = null
        break
      case 'direction':
        filterRequired.direction = null
        break
      default:
        filterRequired = {
          district: null,
          rent_cost: null,
          acreage: null,
          direction: null,
        }
    }
    this.setState({ filterRequired })
  }
  _onFilterPress = (filterRequired) => {
    this.setState({ filterRequired, modalVisible: false })
  }
  render() {
    const { isFetching, filterRequired } = this.state
    const { district, rent_cost, acreage, direction } = filterRequired
    return (
      <View style={[styles.container]}>
        {this.state.modalVisible ?
          <BuildingFilter
            visible
            closeModal={() => this.setState({ modalVisible: false })}
            onFilterPress={this._onFilterPress}
            clearFilterPress={this._clearFilterPress}
            filterData={this.props.buildingsFilterData}
            districtList={this.props.districtList}
            filterRequired={filterRequired}
          />
          : null}
        <Container key={'LIST'} tabLabel={'DANH SÁCH TÒA NHÀ'} style={styles.container}>
          <TouchableOpacity
            onPress={() => { this.setState({ modalVisible: true }) }}
            style={[styles.button, { alignSelf: 'flex-end', borderWidth: 0, marginHorizontal: winW(5) }]}>
            <Text style={[styles.buttonText]}>CHỌN LỌC</Text>
          </TouchableOpacity>
          <View style={{ paddingHorizontal: winW(2), flexDirection: 'row', flexWrap: 'wrap', backgroundColor: '#FFF' }}>
            {district &&
              <TouchableOpacity
                onPress={() => { this._clearFilterPress('district') }}
                style={[styles.button, { flexDirection: 'row' }]}>
                <Text style={[styles.buttonText]}>{district.district_name}</Text>
                <Icon style={[styles.buttonText, { marginLeft: 5, fontSize: 18 }]} name='md-close' type="Ionicons" />
              </TouchableOpacity>
            }
            {rent_cost &&
              <TouchableOpacity
                onPress={() => { this._clearFilterPress('rent_cost') }}
                style={[styles.button, { flexDirection: 'row' }]}>
                <Text style={[styles.buttonText]}>${rent_cost[0].toFixed(1)} - ${rent_cost[1].toFixed(1)}</Text>
                <Icon style={[styles.buttonText, { marginLeft: 5, fontSize: 18 }]} name='md-close' type="Ionicons" />
              </TouchableOpacity>
            }
            {acreage &&
              <TouchableOpacity
                onPress={() => { this._clearFilterPress('acreage') }}
                style={[styles.button, { flexDirection: 'row' }]}>
                <Text style={[styles.buttonText]}>{acreage[0]}m2 - {acreage[1]}m2</Text>
                <Icon style={[styles.buttonText, { marginLeft: 5, fontSize: 18 }]} name='md-close' type="Ionicons" />
              </TouchableOpacity>
            }
            {direction &&
              <TouchableOpacity
                onPress={() => { this._clearFilterPress('direction') }}
                style={[styles.button, { flexDirection: 'row' }]}>
                <Text style={[styles.buttonText]}>{direction.direction_name}</Text>
                <Icon style={[styles.buttonText, { marginLeft: 5, fontSize: 18 }]} name='md-close' type="Ionicons" />
              </TouchableOpacity>
            }
          </View>
          <Content
            style={{ paddingHorizontal: (ITEM_Margin / 2) }}
            refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh} />}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {this.props.buildings && this.props.buildings.map((item, index) => {
                if (district || rent_cost || acreage || direction) {
                  if (district && district.district_name !== item.district) { }
                  else if (rent_cost && (rent_cost[0] > item.rent_cost || item.rent_cost > rent_cost[1])) { }
                  else if (acreage && (acreage[0] > item.acreage_rent_array[0] || item.acreage_rent_array[item.acreage_rent_array.length - 1] > acreage[1])) { }
                  else if (direction && direction.direction_name !== item.direction) { }
                  else return <RenderTagBuilding data={item} key={index} navigation={this.props.navigation} _onfetchBuildingDetail={(buildingsId) => { this.props._onfetchBuildingDetail(buildingsId) }} />
                }
                else return <RenderTagBuilding data={item} key={index} navigation={this.props.navigation} _onfetchBuildingDetail={(buildingsId) => { this.props._onfetchBuildingDetail(buildingsId) }} />
              })}
            </View>
          </Content>
        </Container>
      </View >
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundColor
  },
  buttonText: {
    color: brandPrimary,
    textAlign: 'center'
  },
  button: {
    borderWidth: 1,
    borderColor: '#C7DDF6',
    borderRadius: 2,
    padding: 5,
    paddingHorizontal: 10,
    margin: 5
  },
});

const mapStateToProps = state => {
  return {
    buildings: state.buildings.buildings,
    buildingsFilterData: state.buildings.buildingsFilterData,
    districtList: state.buildings.buildingsDistricts
  }
}

const mapDispatchToProps = dispatch => {
  return {
    _onfetchBuidlings: (district_id) => dispatch(actions.fetchBuidlings(district_id)),
    _onfetchDistrictList: (provinceId) => dispatch(actions.fetchDistrictList(provinceId)),
    _onfetchBuildingDetail: (buildingsId) => dispatch(actions.fetchBuildingDetail(buildingsId)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Buildings)