import React from 'react';
import { connect } from 'react-redux';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Content, Icon, Text } from "native-base";

import * as actions from '../building-actions';
import { Spinner } from '../../../components/common';
import { isEmpty } from '../../../util/utility';
import { TagOffice } from '../../../components/buildings';
import { backgroundColor, brandPrimary, fontSize, brandLight } from '../../../config/variables';
import OfficeFilter from './OfficeFilter';
import i18n from '../../../i18n';

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
    if (!isEmpty(building_id)) {
      if ((building_id == this.props.buildingsId) && !isEmpty(this.props.officeList)) {
        this._onFetching()
      }
      else {
        await this.props._onfetchOfficeList(building_id)
          .then(() => { this._onFetching() })
          .catch((ignored) => { console.log(`error ${ignored}`) })
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
    const building_id = this.props.navigation.getParam('building_id')
    const building_name = this.props.navigation.getParam('building_name')
    let officeList = []
    if (!isEmpty(filterRequired.acreage_rent)) {
      this.props.officeList.forEach(item => {
        if ((filterRequired.acreage_rent[0] <= item.acreage_rent && item.acreage_rent <= filterRequired.acreage_rent[1])) {
          officeList.push(item);
        }
      })
    }
    else {
      officeList = this.props.officeList
    }
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
        <View style={styles.filterContainer}>
          <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
            {!isEmpty(filterRequired.acreage_rent) &&
              <TouchableOpacity
                onPress={() => { this._clearFilterPress() }}
                style={styles.button}>
                <Text style={styles.buttonText}>{filterRequired.acreage_rent[0]}m2 - {filterRequired.acreage_rent[filterRequired.acreage_rent.length - 1]}m2</Text>
                <Icon style={styles.closeIcon} name='md-close' type="Ionicons" />
              </TouchableOpacity>
            }
          </View>
          <View style={{ alignItems: 'flex-start', justifyContent: 'flex-end' }}>
            <TouchableOpacity
              onPress={() => { this.setState({ modalVisible: true }) }}
              style={{ alignSelf: 'flex-end', paddingVertical: 15 }}>
              <Text style={[styles.buttonText, { fontSize }]}>{i18n.t('filter.filters')}</Text>
            </TouchableOpacity>
          </View>
        </View>
        {(isFetching && officeList) ? <Spinner /> :
          <Content style={{ backgroundColor, paddingTop: 10 }}>
            {!isEmpty(filterRequired.acreage_rent) && officeList.length < 1 ?
              <Text style={{ textAlign: 'center' }}>{i18n.t('filter.noResult')}</Text>
              : isEmpty(filterRequired.acreage_rent) && officeList.length < 1 ? <Text style={{ textAlign: 'center' }}>{i18n.t('global.updating')}</Text>
                : officeList.map((item, index) => {
                  item.building_id = building_id
                  item.building_name = building_name
                  return (
                    <TouchableOpacity key={index}
                      onPress={() => { this.props.navigation.navigate('ModalBooking', { dataProps: { officeDetail: item } }) }} >
                      <TagOffice officeDetail={item} navigation={this.props.navigation} />
                    </TouchableOpacity>
                  )
                })}
          </Content>
        }
      </View>
    )
  }
};

const styles = StyleSheet.create({
  filterContainer: {
    backgroundColor: brandLight,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  buttonText: {
    fontSize: fontSize - 3,
    color: brandPrimary,
    textAlign: 'center'
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
  closeIcon: {
    fontSize: fontSize - 3,
    color: brandPrimary,
    textAlign: 'center',
    marginLeft: 5, fontSize: fontSize + 1
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
