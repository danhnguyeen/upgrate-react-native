import React from 'react';
import { connect } from 'react-redux';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Content, Icon, Text } from "native-base";

import * as actions from '../building-actions';
import { Spinner } from '../../../components/common';
// import { Common, styles, winW, winH } from '../../constants/';
import { isEmpty } from '../../../util/utility';
import { TagOffice } from '../../../components/buildings';
import { backgroundColor, brandPrimary } from '../../../config/variables';
import OfficeFilter from './OfficeFilter';

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
  }
  async componentDidMount() {
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

    this.setState({ filterData, isFetching: false })
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
    const { filterRequired, filterData, isFetching } = this.state
    const officeList = this.props.officeList
    const building_id = this.props.navigation.getParam('building_id')
    const building_name = this.props.navigation.getParam('building_name')
    console.log(filterRequired)
    return (
      <View style={{ flex: 1, backgroundColor }}>
        {this.state.modalVisible ?
          <OfficeFilter
            visible
            closeModal={() => this.setState({ modalVisible: false })}
            onFilterPress={(dataRequired) => { this._onFilterPress(dataRequired) }}
            clearFilterPress={() => { this._clearFilterPress() }}
            filterData={filterData}
            filterRequired={filterRequired}
          />
          : null}
        <Content style={{ backgroundColor: '#DCDCDC' }} >
          {(isFetching && officeList) ? <Spinner /> :
            <View >
              <View style={{ padding: 15, backgroundColor: '#FFF', marginBottom: 10 }}>
                <TouchableOpacity
                  onPress={() => { this.setState({ modalVisible: true }) }}
                  style={[styles.button, { alignSelf: 'flex-end', borderWidth: 0 }]}>
                  <Text style={[styles.buttonText]}>CHỌN LỌC</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', }}>
                  {!isEmpty(filterRequired.acreage_rent) &&
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
                {officeList.length < 1 ?
                  <Text>Danh sách văn phòng hiện đang trống.</Text> :
                  officeList.map((item, index) => {
                    item.building_id = building_id
                    item.building_name = building_name
                    if (isEmpty(filterRequired.acreage_rent) ||
                      (!isEmpty(filterRequired.acreage_rent) &&
                        (filterRequired.acreage_rent[0] <= item.acreage_rent && item.acreage_rent <= filterRequired.acreage_rent[1]))) {
                      return (
                        <TouchableOpacity key={index}
                          onPress={() => { this.props.navigation.navigate('ModalBooking', { dataProps: { officeDetail: item } }) }} >
                          <TagOffice officeDetail={item} navigation={this.props.navigation} />
                        </TouchableOpacity>
                      )
                    }
                    else return (<Text>Không thấy kết quả phù hợp</Text>)
                  })}
              </View>
            </View>}
        </Content>
      </View>
    )
  }
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
    paddingHorizontal: 10
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
