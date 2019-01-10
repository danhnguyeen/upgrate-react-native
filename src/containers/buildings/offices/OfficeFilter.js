import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View, Modal, ActivityIndicator } from 'react-native';
import { Text, Icon } from "native-base";


import { shadow, brandLight, brandPrimary } from '../../../config/variables';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

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
      sliderLength: 250,
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
  // componentWillReceiveProps(thisProps, nextProps) {
  //   if (thisProps != nextProps) {
  //     // this.onFetchProps()
  //   }
  // }

  onFetchProps = () => {
    const { filterData, filterRequired } = this.props
    this.setState({ filterRequired, filterData }, () => {
      this.setState({ onReady: true })
    })
  }
  measureComponent = () => {
    if (this.refs.refContainer) {
      this.refs.refContainer.measure(this._logLargestSize);
    }
  }
  _logLargestSize = (width) => {
    if (width > this.state.sliderLength) {
      this.setState({ sliderLength: width - 20 })
    }
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
        animationType="none"
        transparent={true}
        onRequestClose={this.props.closeModal}
      >
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
                  <Text style={[styles.title, { lineHeight: 64 }]}>{'CHỌN LỌC'}</Text>
                </View>
                <TouchableOpacity
                  style={[styles.headerIcon, styles.right]}
                  onPress={this.props.closeModal}>
                  <Icon style={styles.icon} name={'ios-close-circle-outline'} type={'Ionicons'} />
                </TouchableOpacity>
              </View>
              <ScrollView scrollEnabled={this.state.scrollEnabled}>
                {!onReady ? <ActivityIndicator /> :
                  <View style={{ paddingHorizontal: 20 }}>
                    <View style={{ borderBottomColor: '#0d3d74', borderBottomWidth: 0.5, paddingVertical: 20 }}>
                      <Text style={{ color: '#4c4c4c', lineHeight: 30, fontWeight: '400', fontSize: 20 }}>Diện tích</Text>
                      <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                        <Text style={{ flex: 0.5, color: '#4c4c4c', }}>Từ {filterRequired.acreage_rent ? filterRequired.acreage_rent[0] : filterData.acreage_rent[0]}m2</Text>
                        <Text style={{ flex: 0.5, color: '#4c4c4c', textAlign: 'right' }}>Đến {filterRequired.acreage_rent ? filterRequired.acreage_rent[filterRequired.acreage_rent.length - 1] : filterData.acreage_rent[filterData.acreage_rent.length - 1]}m2</Text>
                      </View>
                      <View style={{ alignItems: 'center', marginHorizontal: 10 }} ref='refContainer' onLayout={() => { this.measureComponent() }}>
                        <MultiSlider
                          values={filterRequired.acreage_rent ? filterRequired.acreage_rent : [filterData.acreage_rent[0], filterData.acreage_rent[filterData.acreage_rent.length - 1]]}
                          sliderLength={this.state.sliderLength}
                          onValuesChange={values => { this._onacreage_rentChange(values) }}
                          min={filterData.acreage_rent[0]} max={filterData.acreage_rent[filterData.acreage_rent.length - 1]}
                          step={1}
                          allowOverlap snapped
                          selectedStyle={{ backgroundColor: '#5092E3', }}
                          unselectedStyle={{ backgroundColor: 'silver', }}
                          containerStyle={{ height: 30 }}
                          trackStyle={{ height: 4, backgroundColor: 'silver', }}
                          // customMarker={CustomMarker}
                        />
                      </View>
                    </View>
                  </View>
                }
              </ScrollView>
              <View style={{ justifyContent: 'flex-end', alignContent: 'flex-end', padding: 15 }}>
                <View style={{ flexDirection: 'row', }}>
                  <TouchableOpacity style={[styles.button, { flex: 0.5 }]}
                    onPress={this.props.closeModal}>
                    <Text style={[styles.buttonText, { fontSize: 20 }]}>Bỏ chọn</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.buttonBg, { flex: 0.5 }]}
                    onPress={() => { this._onFilterPress() }}>
                    <Text style={[styles.buttonBgText, { fontSize: 20 }]}>Tìm kiếm</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity style={{ paddingHorizontal: 10, margin: 5 }}
                  onPress={() => { this._onResetPress() }}>
                  <Text style={[styles.buttonText, { fontSize: 14, textAlign: 'left' }]}>{'X Reset filter'}</Text>
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