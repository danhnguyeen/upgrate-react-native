import React, { Component } from 'react'
import {
  TouchableOpacity,
  View,
  Modal,
  ScrollView,
  StyleSheet,
  ActivityIndicator
} from 'react-native'
import { Text, Icon } from "native-base"
import MultiSlider from '@ptomasroos/react-native-multi-slider'

import { MultiSelect } from '../../components/buildings'
import { shadow, brandLight, brandPrimary } from '../../config/variables'
import i18n from '../../i18n';


class BuildingFilter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sliderLength: 200,
      selectedData: {
        district: null,
        rent_cost: null,
        acreage: null,
        direction: null
      }
    }
  }
  componentDidMount() {
    const filterRequired = this.props.filterRequired
    if (filterRequired.district || filterRequired.rent_cost || filterRequired.acreage || filterRequired.direction) {
      this.setState({ selectedData: filterRequired })
    }
  }
  measureComponent = () => {
    if (this.refs.refContainer) {
      this.refs.refContainer.measure(this._logLargestSize)
    }
  }
  _logLargestSize = (width) => {
    if (width > this.state.sliderLength) {
      this.setState({ sliderLength: width - 10 })
    }
  }
  _onResetPress = () => {
    this.setState({
      selectedData: {
        district: null,
        rent_cost: null,
        acreage: null,
        direction: null
      }
    })
    if (this.props.clearFilterPress) {
      this.props.clearFilterPress()
    }
  }
  _onFilterPress = () => {
    if (this.props.onFilterPress) {
      const filterRequired = this.state.selectedData
      this.props.onFilterPress(filterRequired)
    }
  }
  _onCloselPress = () => {
    this.props.closeModal()
  }
  _onFilterChange(value, key) {
    const { selectedData } = this.state
    selectedData[`${key}`] = value
    this.setState({ selectedData })
  }
  enableScroll = () => this.setState({ scrollEnabled: true })
  disableScroll = () => this.setState({ scrollEnabled: false })

  render() {
    const { districtList, filterData } = this.props
    const { selectedData } = this.state
    return (
      <Modal
        visible={this.props.visible}
        animationType="none"
        transparent={true}
        onRequestClose={() => { }} >
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', position: 'relative' }} >
          <TouchableOpacity onPress={this.props.closeModal}
            style={{
              backgroundColor: 'rgba(255,255,255,0.7)',
              flexDirection: 'row',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              position: 'absolute',
            }}
          />
          <View style={[{ width: '80%', height: '80%', borderRadius: 4 }, shadow]}>
            <View style={{ overflow: 'hidden', backgroundColor: brandLight, flex: 1 }}>
              <View style={{
                flexDirection: 'row',
                backgroundColor: '#083C76',
                borderBottomColor: '#DFBC2C', borderBottomWidth: 9
              }} >
                <View style={[styles.headerIcon, styles.left]}></View>
                <View style={styles.headerTitle}>
                  <Text style={[styles.title, { lineHeight: 64 }]}>{i18n.t('filter.filters')}</Text>
                </View>
                <TouchableOpacity
                  style={[styles.headerIcon, styles.right]}
                  onPress={this.props.closeModal}>
                  <Icon style={styles.icon} name={'ios-close-circle-outline'} type={'Ionicons'} />
                </TouchableOpacity>
              </View>
              <ScrollView scrollEnabled={this.state.scrollEnabled}>
                <View style={{ paddingHorizontal: 20 }}>
                  {districtList && districtList.length > 0 &&
                    <View style={[styles.line, { paddingBottom: 0 }]}>
                      <MultiSelect
                        selectedItems={selectedData.district ? `${selectedData.district.district_name}` : i18n.t('filter.selectDistrict')}
                        items={districtList}
                        displayKey="district_name"
                        addItemAll={true}
                        onSelectedItemsChange={(selectedItems) => this._onFilterChange(selectedItems, 'district')}
                      />
                    </View>
                  }
                  {filterData.direction_array && filterData.direction_array.length > 0 &&
                    <View style={[styles.line, { paddingBottom: 0 }]}>
                      <MultiSelect
                        selectedItems={selectedData.direction ? `${selectedData.direction.direction_name}` : i18n.t('filter.selectDirection')}
                        items={filterData.direction_array}
                        displayKey="direction_name"
                        addItemAll={true}
                        onSelectedItemsChange={(selectedItems) => this._onFilterChange(selectedItems, 'direction')}
                      />
                    </View>
                  }
                  {filterData.rent_cost && filterData.rent_cost.length > 0 &&
                    <View style={{ paddingVertical: 20 }}>
                      <Text style={{ color: '#4c4c4c', lineHeight: 30, fontWeight: '400', fontSize: 20 }}>{i18n.t('filter.price')}</Text>
                      <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                        <Text adjustsFontSizeToFit style={{ flex: 0.5, color: '#4c4c4c', }}>${selectedData.rent_cost ? selectedData.rent_cost[0].toFixed(1) : filterData.rent_cost[0].toFixed(1)}</Text>
                        <Text adjustsFontSizeToFit style={{ flex: 0.5, color: '#4c4c4c', textAlign: 'right' }}>${selectedData.rent_cost ? selectedData.rent_cost[1].toFixed(1) : filterData.rent_cost[1].toFixed(1)}</Text>
                      </View>
                      <View style={{ alignItems: 'center', marginHorizontal: 10 }} ref='refContainer' onLayout={() => { this.measureComponent() }}>
                        <MultiSlider
                          values={selectedData.rent_cost ? selectedData.rent_cost : filterData.rent_cost}
                          sliderLength={this.state.sliderLength}
                          onValuesChange={values => { this._onFilterChange(values, 'rent_cost') }}
                          min={filterData.rent_cost[0]} max={filterData.rent_cost[1]}
                          step={1}
                          allowOverlap snapped
                          selectedStyle={{ backgroundColor: '#0d3d74', }}
                          unselectedStyle={{ backgroundColor: 'silver', }}
                          containerStyle={{ height: 30 }}
                          trackStyle={{ height: 4, backgroundColor: 'silver', }}
                          onValuesChangeStart={this.disableScroll}
                          onValuesChangeFinish={this.enableScroll}
                        />
                      </View>
                    </View>
                  }
                  {filterData.acreage && filterData.acreage.length > 0 &&
                    <View style={{ paddingVertical: 20 }}>
                      <Text style={{ color: '#4c4c4c', lineHeight: 30, fontWeight: '400', fontSize: 20 }}>{i18n.t('filter.acreage')}</Text>
                      <View style={{ flexDirection: 'row', paddingVertical: 10 }}>
                        <Text style={{ flex: 0.5, color: '#4c4c4c', }}>{selectedData.acreage ? selectedData.acreage[0] : filterData.acreage[0]}m2</Text>
                        <Text style={{ flex: 0.5, color: '#4c4c4c', textAlign: 'right' }}>{selectedData.acreage ? selectedData.acreage[1] : filterData.acreage[1]}m2</Text>
                      </View>
                      <View style={{ alignItems: 'center' }}>
                        <MultiSlider
                          values={selectedData.acreage ? selectedData.acreage : filterData.acreage}
                          sliderLength={this.state.sliderLength}
                          onValuesChange={values => { this._onFilterChange(values, 'acreage') }}
                          min={filterData.acreage[0]} max={filterData.acreage[1]}
                          step={1}
                          allowOverlap snapped
                          selectedStyle={{ backgroundColor: '#0d3d74', }}
                          unselectedStyle={{ backgroundColor: 'silver', }}
                          trackStyle={{ height: 4, backgroundColor: 'silver', }}
                          containerStyle={{ height: 30, }}
                        />
                      </View>
                    </View>
                  }
                </View>

              </ScrollView>
              <View style={{ justifyContent: 'flex-end', alignContent: 'flex-end', padding: 15 }}>
                <View style={{ flexDirection: 'row', }}>
                  <TouchableOpacity style={[styles.button, { flex: 0.5 }]}
                    onPress={this.props.closeModal}>
                    <Text style={[styles.buttonText, { fontSize: 20 }]}>{i18n.t('filter.clear')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.buttonBg, { flex: 0.5 }]}
                    // onPress={this._onFilterPress}>
                    onPress={() => { this._onFilterPress() }}>
                    <Text style={[styles.buttonBgText, { fontSize: 20 }]}>{i18n.t('filter.filter')}</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity style={{ paddingHorizontal: 10, margin: 5 }}
                  onPress={this._onResetPress}>
                  <Text style={[styles.buttonText, { fontSize: 14, textAlign: 'left' }]}>{i18n.t('filter.reset')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  line: {
    borderBottomColor: '#0d3d74',
    borderBottomWidth: 0.5,
    paddingVertical: 20,
  },
  button: {
    borderWidth: 1,
    borderColor: '#C7DDF6',
    borderRadius: 2,
    padding: 5,
    paddingHorizontal: 10,
    margin: 5
  },
  buttonText: {
    color: brandPrimary,
    textAlign: 'center'
  },
  buttonBg: {
    backgroundColor: brandPrimary,
    borderRadius: 2,
    padding: 5,
    paddingHorizontal: 10,
    margin: 5,
  },
  buttonBgText: {
    color: '#FFF',
    textAlign: 'center'
  },
  headerIcon: {
    flex: 0.2,
    justifyContent: 'center',
  },
  left: {
    paddingLeft: 20,
  },
  right: {
    paddingRight: 20,
    alignItems: 'flex-end'
  },
  headerTitle: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  title: {
    color: "#FFF",
    fontSize: 18,
    lineHeight: 40,
    fontWeight: "500"
  },
  icon: {
    color: "#fff",
    fontSize: 30
  },
})

export default BuildingFilter