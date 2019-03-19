import React from 'react';
import { connect } from 'react-redux';
import { TouchableOpacity, View, StyleSheet, Text, FlatList } from 'react-native';
import { Container, Icon, } from "native-base";

import * as actions from './building-actions';
import { isEmpty } from '../../util/utility';
import { fontSize, brandPrimary, brandLight, DEVICE_WIDTH } from '../../config/variables';
import { TagBuilding } from '../../components/buildings';
import BuildingFilter from './BuildingFilter';
import i18n, { getCurrentLocale } from '../../i18n';

const FilterDefault = {
  district: { district_id: -1 },
  rent_cost: null,
  acreage: null,
  direction: { direction_id: -1 }
}

class Buildings extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      filterRequired: { ...FilterDefault },
      districList: [],
      isFetching: true,
      modalVisible: false,
      refreshing: false
    }
  }

  componentDidMount() {
    const { buildings, districtList, buildingsFilterData } = this.props;
    if (isEmpty(buildings) || isEmpty(buildingsFilterData)) {
      this._onRefresh();
    }
    if (isEmpty(districtList)) {
      this.props._onfetchDistrictList();
    }
    this.setState({ isFetching: false });
    this.props.navigation.addListener('didFocus', () => {
      this.props.navigation.setParams({ updatedTime: new Date() });
    });
  }
  _onRefresh = async () => {
    try {
      this.setState({ refreshing: true })
      await this.props._onfetchBuidlings();
      this.setState({ refreshing: false });
    } catch (error) {
      this.setState({ refreshing: false });
    }
  }
  _clearFilterPress = (key = 'all') => {
    let { filterRequired } = this.state
    if (key == 'all') {
      filterRequired = { ...FilterDefault }
    } else {
      filterRequired[key] = FilterDefault[key];
    }
    this.setState({ filterRequired })
  }
  selectBuilding = (building) => {
    this.props._onfetchBuildingDetail(building.building_detail);
    this.props.navigation.navigate('BuildingDetails');
  }
  render() {
    const { district, rent_cost, acreage, direction } = this.state.filterRequired;
    const buildings = this.props.buildings.filter((item) => {
      if (district || rent_cost || acreage || direction) {
        if (district && district.district_id > 0 && district.district_name !== item.district) { }
        else if (rent_cost && (rent_cost[0] > item.rent_cost || item.rent_cost > rent_cost[1])) { }
        else if (acreage && (acreage[0] > item.acreage_rent_array[0] || item.acreage_rent_array[item.acreage_rent_array.length - 1] > acreage[1])) { }
        else if (direction && direction.direction_id > 0 && direction.direction_name !== item.direction) { }
        else return item;
      }
      else return item;
    });
    const locale = getCurrentLocale();
    return (
      <View style={[styles.container]}>
        {this.state.modalVisible ?
          <BuildingFilter
            visible={this.state.modalVisible}
            closeModal={() => { this.setState({ modalVisible: false }) }}
            onFilterPress={(filterRequired) => { this.setState({ filterRequired, modalVisible: false }) }}
            clearFilterPress={this._clearFilterPress}
            filterData={this.props.buildingsFilterData}
            districtList={this.props.districtList}
            filterRequired={this.state.filterRequired}
          />
          : null}
        <Container style={styles.container}>
          <View style={{ paddingHorizontal: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
              {district && district.district_id > 0 &&
                <TouchableOpacity
                  onPress={() => { this._clearFilterPress('district') }}
                  style={styles.button}>
                  <Text style={[styles.buttonText]}>{district.district_name}</Text>
                  <Icon style={styles.closeIcon} name='md-close' type="Ionicons" />
                </TouchableOpacity>
              }
              {rent_cost &&
                <TouchableOpacity
                  onPress={() => { this._clearFilterPress('rent_cost') }}
                  style={styles.button}>
                  <Text style={[styles.buttonText]}>${rent_cost[0].toFixed(1)} - ${rent_cost[1].toFixed(1)}</Text>
                  <Icon style={styles.closeIcon} name='md-close' type="Ionicons" />
                </TouchableOpacity>
              }
              {acreage &&
                <TouchableOpacity
                  onPress={() => { this._clearFilterPress('acreage') }}
                  style={styles.button}>
                  <Text style={[styles.buttonText]}>{acreage[0]}m2 - {acreage[1]}m2</Text>
                  <Icon style={styles.closeIcon} name='md-close' type="Ionicons" />
                </TouchableOpacity>
              }
              {direction && direction.direction_id > 0 &&
                <TouchableOpacity
                  onPress={() => { this._clearFilterPress('direction') }}
                  style={[styles.button, { flexDirection: 'row' }]}>
                  <Text style={[styles.buttonText]}>{direction[`direction_name_${locale}`]}</Text>
                  <Icon style={styles.closeIcon} name='md-close' type="Ionicons" />
                </TouchableOpacity>
              }
            </View>
            <View style={{ alignItems: 'flex-start', justifyContent: 'flex-end' }}>
              <TouchableOpacity
                onPress={() => { this.setState({ modalVisible: true }) }}
                style={{ alignSelf: 'flex-end', paddingTop: 15, paddingBottom: 10 }}>
                <Text style={[styles.buttonText, { fontSize: fontSize + 2 }]}>{i18n.t('filter.filters')}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <FlatList
            onRefresh={this._onRefresh}
            refreshing={this.state.refreshing}
            numColumns={2}
            style={{ width: DEVICE_WIDTH }}
            data={buildings}
            contentContainerStyle={{ paddingTop: 8 }}
            renderItem={({ item, index }) =>
              <TagBuilding building={item} index={index} key={item.building_id} selectBuilding={this.selectBuilding} />
            }
            keyExtractor={item => item.building_id.toString()}
          />
        </Container>
      </View >
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: brandLight
  },
  buttonText: {
    fontSize: fontSize - 2,
    color: brandPrimary,
    textAlign: 'center'
  },
  closeIcon: {
    fontSize: fontSize - 2,
    color: brandPrimary,
    textAlign: 'center',
    marginLeft: 5, fontSize: fontSize + 1
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: brandPrimary,
    borderRadius: 3,
    padding: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    marginRight: 5
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
    _onfetchBuildingDetail: (building) => dispatch(actions.fetchBuildingDetail(building)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Buildings)
