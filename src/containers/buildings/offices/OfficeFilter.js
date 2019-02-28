import React from 'react';
import { ScrollView, StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { Divider } from 'react-native-elements';

import { shadow, brandLight, brandPrimary, DEVICE_WIDTH } from '../../../config/variables';
import { Modal, Button, SliderMarker } from '../../../components/common';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import i18n from '../../../i18n';

class CustomMarker extends React.Component {
  render() {
    return (
      <View style={[shadow, { width: 30, height: 30, borderRadius: 15, backgroundColor: '#FFF' }]} />
    )
  }
}

class OfficeFilter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      onReady: false,
      sliderLength: DEVICE_WIDTH / 2,
      filterRequired: {
        district: null,
        rent_cost: null,
        acreage_rent: null,
        direction: null
      }
    }
    this._isMounted = false
  }

  componentWillUnmount() {
    this._isMounted = false;
  }
  componentDidMount = () => {
    this._isMounted = true
    this._isMounted && this.onFetchProps()
  }

  onFetchProps = () => {
    const { filterData, filterRequired } = this.props
    this.setState({ filterRequired, filterData }, () => {
      this.setState({ onReady: true })
    })
  }

  _onResetPress = () => {
    this.setState({
      filterRequired: {
        district: null,
        rent_cost: null,
        acreage_rent: null,
        direction: null
      }
    })
    if (this.props.clearFilterPress) {
      this.props.clearFilterPress()
    }
  }
  _onFilterPress = () => {
    if (this.props.onFilterPress) {
      const { filterRequired } = this.state
      this.props.onFilterPress(filterRequired)
    }
  }

  _onacreage_rentChange(value) {
    const { filterRequired } = this.state
    filterRequired.acreage_rent = value
    this.setState({ filterRequired })
  }
  enableScroll = () => this.setState({ scrollEnabled: true });
  disableScroll = () => this.setState({ scrollEnabled: false });
  render() {
    const { districList, filterData } = this.props
    const { filterRequired, onReady } = this.state
    return (
      <Modal
        visible={this.props.visible}
        title={i18n.t('filter.filters')}
        onRequestClose={this.props.closeModal} >
        <View style={{ flex: 1, backgroundColor: brandLight }}>
          <ScrollView contentContainerStyle={{ paddingVertical: 50 }}>
            {!onReady ? <ActivityIndicator /> :
              <View style={{ paddingHorizontal: 20 }}>
                <Text style={{ marginBottom: 10 }}>{i18n.t('filter.acreage')}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text>{filterRequired.acreage_rent ? filterRequired.acreage_rent[0] : filterData.acreage_rent[0]}m2</Text>
                  <MultiSlider
                    values={filterRequired.acreage_rent ? filterRequired.acreage_rent : [filterData.acreage_rent[0], filterData.acreage_rent[filterData.acreage_rent.length - 1]]}
                    sliderLength={this.state.sliderLength}
                    onValuesChange={values => { this._onacreage_rentChange(values) }}
                    min={filterData.acreage_rent[0]} max={filterData.acreage_rent[filterData.acreage_rent.length - 1]}
                    step={1}
                    customMarker={SliderMarker}
                    allowOverlap snapped
                    selectedStyle={{ backgroundColor: brandPrimary, }}
                    unselectedStyle={{ backgroundColor: 'silver', }}
                    containerStyle={{ height: 30, marginHorizontal: 20 }}
                    trackStyle={{ height: 4, backgroundColor: 'silver' }}
                  />
                  <Text>{filterRequired.acreage_rent ? filterRequired.acreage_rent[filterRequired.acreage_rent.length - 1] : filterData.acreage_rent[filterData.acreage_rent.length - 1]}m2</Text>
                </View>
              </View>
            }
          </ScrollView>
          <Divider />
          <View style={{ heigth: 100, flexDirection: 'row', backgroundColor: brandLight }}>
            <Button
              buttonStyle={{ width: (DEVICE_WIDTH / 2) - 30, marginRight: 10, backgroundColor: 'transparent' }}
              title={i18n.t('filter.reset')}
              titleStyle={{ color: brandPrimary }}
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

const styles = StyleSheet.create({
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
});

export default OfficeFilter;