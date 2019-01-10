import React from 'react';
import { connect } from 'react-redux';
import { TouchableOpacity, View, StyleSheet, ActivityIndicator } from 'react-native';
import { Content, Icon, Text } from "native-base";

import * as actions from '../building-actions';
// import { Common, styles, winW, winH } from '../../constants/';
import { isEmpty } from '../../../util/utility';
import { TagOffice } from '../../../components/buildings';
import { backgroundColor, brandPrimary } from '../../../config/variables';
// import ModalFilter from '../../components/Office/ModalFilter'

let filterData = {
  acreage_rent: [],
  direction: [],
  floor_name: [],
}
class Offices extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('building_name')
    }
  };
  constructor(props) {
    super(props)
    this.state = {
      officeList: [],
      isFetching: true,
      modalVisible: false,
      filterRequired: {
        acreage_rent: null,
      },
    }
    this._isMounted = false
  }

  componentWillUnmount() {
    this._isMounted = false
  }
  async componentDidMount() {
    this._isMounted = true
    if (this._isMounted == true) {
      const building_id = this.props.navigation.getParam('building_id')
      if ((!isEmpty(building_id) == !isEmpty(this.props.buildingsId)) && !isEmpty(this.props.officeList)) {
        this._onFetching()
      }
      else if (!isEmpty(building_id)) {
        await this.props._onfetchOfficeList(building_id)
          .then(() => { this._onFetching() })
          .catch((ignored) => { console.error(ignored) })
      }
    }
  }
  _onFetching = () => {
    const officeList = this.props.officeList
    officeList.forEach(item => {
      filterData.acreage_rent.push(item.acreage_rent)
      filterData.direction.push(item.direction)
      filterData.floor_name.push(item.floor_name)
    })
    filterData.acreage_rent = [...new Set(filterData.acreage_rent)].sort((a, b) => { return a - b })
    filterData.direction = [...new Set(filterData.direction)].sort((a, b) => { return a - b })
    filterData.floor_name = [...new Set(filterData.floor_name)].sort((a, b) => { return a - b })

    this.setState({ officeList, filterData, isFetching: false })
  }
  _clearFilterPress = () => {
    let { filterRequired } = this.state
    filterRequired.acreage_rent = null
    this.setState({ filterRequired })
  }
  _onFilterPress(filterRequired) {
    this.setState({ filterRequired, modalVisible: false })
  }
  setModalVisible(visible) {
    this.setState({ modalVisible: visible })
  }
  render() {
    const { filterRequired, filterData, officeList, isFetching } = this.state
    return (
      <View style={{ flex: 1, backgroundColor: backgroundColor }}>
        {/* <View style={styles.headerContainer} >
          <TouchableOpacity
            style={[styles.headerIcon, styles.left, { alignItems: 'flex-start' }]}
            onPress={() => { this.props.navigation.goBack() }}>
            <Icon style={[styles.icon, styles.buttonText]} name={'angle-left'} type={'FontAwesome'} />
          </TouchableOpacity>
          <View style={[styles.headerTitle]}>
            <Text style={[styles.title, styles.buttonText,]} numberOfLines={1} adjustsFontSizeToFit>{this.props.navigation.getParam('building_name', 'Danh sách văn phòng')}</Text>
          </View>
          <View style={styles.headerIcon}></View>
        </View> */}
        <Content style={{ backgroundColor: '#DCDCDC' }} >
          {(isFetching && officeList) ? <ActivityIndicator /> :
            <View >
              <View style={{ padding: 20, backgroundColor: '#FFF', marginBottom: 10 }}>
                <TouchableOpacity
                  onPress={() => { this.setState({ modalVisible: true }) }}
                  style={[styles.button, { alignSelf: 'flex-end', borderWidth: 0, marginHorizontal: 50 }]}>
                  <Text style={[styles.buttonText]}>CHỌN LỌC</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', }}>
                  {filterRequired && filterRequired.acreage_rent && filterRequired.acreage_rent.length > 1 &&
                    <TouchableOpacity
                      onPress={() => { this._clearFilterPress() }}
                      style={[styles.button, { flexDirection: 'row' }]}>
                      <Text style={[styles.buttonText]}>{filterRequired.acreage_rent[0]}m2 - {filterRequired.acreage_rent[filterRequired.acreage_rent.length - 1]}m2</Text>
                      <Icon style={[styles.buttonText, { marginLeft: 5, fontSize: 18 }]} name='md-close' type="Ionicons" />
                    </TouchableOpacity>
                  }
                </View>
              </View>
              <View >
                {officeList.map((item, index) => {
                  if (filterRequired && filterRequired.acreage_rent && filterRequired.acreage_rent.length > 0) {
                    if (filterRequired.acreage_rent[0] > item.acreage_rent || item.acreage_rent > filterRequired.acreage_rent[1]) { }
                    else return (
                      <TouchableOpacity key={index}
                        onPress={() => { this.props.navigation.navigate('Booking', { dataProps: { officeDetail: item } }) }}
                      // onPress={() => { this.props.navigation.navigate('OfficeDetail', { officeDetail: item }) }}
                      >
                        <TagOffice officeDetail={item} navigation={this.props.navigation} />
                      </TouchableOpacity>
                    )
                  }
                  else return (
                    <TouchableOpacity key={index}
                      onPress={() => { this.props.navigation.navigate('Booking', { dataProps: { officeDetail: item } }) }}
                    // onPress={() => { this.props.navigation.navigate('OfficeDetail', { officeDetail: item }) }}
                    >
                      <TagOffice officeDetail={item} navigation={this.props.navigation} />
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>}
        </Content>
        {/* {this._renderModalFilter(filterRequired, filterData)} */}
      </View>
    )
  }

  // _renderModalFilter = (filterRequired, filterData) => (
  //   <Modal visible={this.state.modalVisible} animationType="none" transparent={true} onRequestClose={() => { console.log('Modal has been closed.') }} >
  //     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', position: 'relative' }} >
  //       <TouchableOpacity onPress={() => { this.setState({ modalVisible: false }) }}
  //         style={{
  //           backgroundColor: 'rgba(255,255,255,0.7)',
  //           flexDirection: 'row',
  //           justifyContent: 'center',
  //           width: '100%',
  //           height: '100%',
  //           position: 'absolute',
  //         }}
  //       />
  //       <View style={[{ width: winW(80), height: winH(80), borderRadius: 4 }, Common.shadow]}>
  //         <ModalFilter
  //           onClose={() => { this.setState({ modalVisible: false }) }}
  //           onFilterPress={(dataRequired) => { this._onFilterPress(dataRequired) }}
  //           clearFilterPress={() => { this._clearFilterPress() }}
  //           filterData={filterData}
  //           filterRequired={filterRequired}
  //         />
  //       </View>
  //     </View>
  //   </Modal>
  // )
};

const styles = StyleSheet.create({
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
  headerIcon: {
    flex: 0.2,
    justifyContent: 'center',
    // alignItems: 'flex-start',
  },
  left: {
    paddingLeft: 20,
  },
  right: {
    paddingRight: 20,
    alignItems: 'flex-end',
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
    fontWeight: "500",
  },
  headerContainer: {
    borderBottomColor: '#f2f2f2',
    borderBottomWidth: 1,
    margin: 0,
    paddingBottom: 5,
    // paddingTop: STATUS_BAR_H,
    flexDirection: 'row',
    // justifyContent: 'center',
  },
});

const mapStateToProps = state => {
  return {
    buildingsId: state.buildings.buildingDetail,
    officeList: state.buildings.officeList
  }
}

const mapDispatchToProps = dispatch => {
  return {
    _onfetchOfficeList: (buildingsId) => dispatch(actions.fetchOfficeList(buildingsId)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Offices)
