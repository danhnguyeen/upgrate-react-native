import React, { Component } from 'react'
import {
  Text,
  View,
  ScrollView,
  StyleSheet
} from 'react-native'
import MultiSlider from '@ptomasroos/react-native-multi-slider';

import { Modal, PickerSelect, Button, SliderMarker } from '../../components/common';
import { brandLight, brandPrimary, DEVICE_WIDTH } from '../../config/variables';
import i18n from '../../i18n';

class BuildingFilter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sliderLength: DEVICE_WIDTH/2,
      selectedData: {
        district: { district_id: -1 },
        rent_cost: null,
        acreage: null,
        direction: { direction_id: -1 }
      }
    }
  }
  componentDidMount() {
    const filterRequired = this.props.filterRequired
    if (filterRequired.district || filterRequired.rent_cost || filterRequired.acreage || filterRequired.direction) {
      this.setState({ selectedData: filterRequired })
    }
  }
  _onResetPress = () => {
    this.setState({
      selectedData: {
        district: { district_id: -1 },
        rent_cost: null,
        acreage: null,
        direction: { direction_id: -1 }
      }
    })
    if (this.props.clearFilterPress) {
      this.props.clearFilterPress();
    }
  }
  _onFilterPress = () => {
    if (this.props.onFilterPress) {
      const filterRequired = this.state.selectedData;
      this.props.onFilterPress(filterRequired);
    }
  }
  _onFilterChange(value, key) {
    const { selectedData } = this.state
    selectedData[`${key}`] = value
    this.setState({ selectedData })
  }
  enableScroll = () => this.setState({ scrollEnabled: true })
  disableScroll = () => this.setState({ scrollEnabled: false })

  render() {
    const { filterData } = this.props;
    const { selectedData } = this.state;
    return (
      <Modal
        visible={this.props.visible}
        title={i18n.t('filter.filters')}
        onRequestClose={this.props.closeModal} >
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ padding: 25, backgroundColor: brandLight }}>
            <PickerSelect
              label={i18n.t('filter.selectDistrict')}
              onChange={district => this._onFilterChange(district, 'district')}
              isObject
              data={[{ district_id: -1, district_name: i18n.t('filter.allData') }, ...this.props.districtList]}
              keyName={'district_name'}
              keyId='district_id'
              value={this.state.selectedData.district}
            />
            <PickerSelect
              label={i18n.t('filter.selectDirection')}
              onChange={direction => this._onFilterChange(direction, 'direction')}
              isObject
              data={[{ direction_id: -1, direction_name: i18n.t('filter.allData') }, ...filterData.direction_array]}
              keyName={'direction_name'}
              keyId='direction_id'
              value={this.state.selectedData.direction}
            />
            {filterData.rent_cost && filterData.rent_cost.length > 0 &&
              <View style={{ paddingVertical: 20 }}>
                <Text style={{ marginBottom: 10 }}>{i18n.t('filter.price')}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text>${selectedData.rent_cost ? selectedData.rent_cost[0].toFixed(0) : filterData.rent_cost[0].toFixed(0)}</Text>
                  <MultiSlider
                    values={selectedData.rent_cost ? selectedData.rent_cost : filterData.rent_cost}
                    sliderLength={this.state.sliderLength}
                    onValuesChange={values => { this._onFilterChange(values, 'rent_cost') }}
                    min={filterData.rent_cost[0]} max={filterData.rent_cost[1]}
                    step={1}
                    customMarker={SliderMarker}
                    allowOverlap snapped
                    selectedStyle={{ backgroundColor: brandPrimary }}
                    unselectedStyle={{ backgroundColor: 'silver', }}
                    containerStyle={{ height: 30, marginHorizontal: 20 }}
                    trackStyle={{ height: 4, backgroundColor: 'silver', }}
                    onValuesChangeStart={this.disableScroll}
                    onValuesChangeFinish={this.enableScroll}
                  />
                  <Text>${selectedData.rent_cost ? selectedData.rent_cost[1].toFixed(0) : filterData.rent_cost[1].toFixed(0)}</Text>
                </View>
              </View>
            }
            {filterData.acreage && filterData.acreage.length > 0 &&
              <View style={{ paddingVertical: 20 }}>
                <Text style={{ marginBottom: 10 }}>{i18n.t('filter.acreage')}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text>{selectedData.acreage ? selectedData.acreage[0] : filterData.acreage[0]}m2</Text>
                  <MultiSlider
                    values={selectedData.acreage ? selectedData.acreage : filterData.acreage}
                    sliderLength={this.state.sliderLength}
                    onValuesChange={values => { this._onFilterChange(values, 'acreage') }}
                    min={filterData.acreage[0]} max={filterData.acreage[1]}
                    step={1}
                    allowOverlap snapped
                    customMarker={SliderMarker}
                    selectedStyle={{ backgroundColor: brandPrimary }}
                    unselectedStyle={{ backgroundColor: 'silver', }}
                    trackStyle={{ height: 4, backgroundColor: 'silver', }}
                    containerStyle={{ height: 30, marginHorizontal: 20 }}
                  />
                  <Text>{selectedData.acreage ? selectedData.acreage[1] : filterData.acreage[1]}m2</Text>
                </View>
              </View>
            }
          </ScrollView>
          <View style={{ heigth: 100, flexDirection: 'row', backgroundColor: brandLight }}>
            <Button
              buttonStyle={{ width: (DEVICE_WIDTH / 2) - 30, marginRight: 10, backgroundColor: 'transparent' }}
              titleStyle={{ color: brandPrimary }}
              title={i18n.t('filter.reset')}
              onPress={this._onResetPress}
            />
            <Button
              buttonStyle={{ width: (DEVICE_WIDTH / 2) - 30, marginLeft: 10 }}
              title={i18n.t('filter.filter')}
              onPress={this._onFilterPress}
            />
          </View>
        </View>
      </Modal>
    )
  }
}

export default BuildingFilter;