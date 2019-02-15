import React from 'react'
import { connect } from 'react-redux'
import { StyleSheet, View, Alert } from 'react-native'
import { Text } from "native-base"
import MapView from 'react-native-maps';
import { Icon } from 'react-native-elements';

import * as actions from '../../stores/actions';
import { BuildingSlides, MapFilter, LocationDetails } from '../../components/locations';

class Locations extends React.Component {
  state = {
    region: {
      latitude: 10.77932254302465,
      longitude: 106.6827340513601,
      latitudeDelta: 0.045,
      longitudeDelta: 0.02,
    },
    buildingList: this.props.buildings,
    detailBuilding: null,
    modalVisible: false
  }
  componentDidMount() {
    this.props.navigation.addListener('didFocus', () => {
      this.props.navigation.setParams({ updatedTime: new Date() });
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.buildings.length !== this.props.buildings.length) {
      this.setState({ buildingList: nextProps.buildings });
    }
  }
  getCurrentPosition = (isAction) => {
    navigator.geolocation.getCurrentPosition(pos => {
      const region = {
        ...this.state.region,
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude
      };
      this.setState({ region });
      this.pickLocationHandler(region);
    }, error => {
      if (isAction) {
        Alert.alert('Không tìm thấy vị trí');
      }
    });
  }
  handleSelectedBuilding = (building) => {
    const region = {
      latitude: parseFloat(building.lat),
      longitude: parseFloat(building.long),
      latitudeDelta: 0.005,
      longitudeDelta: 0.002
    };
    console.log(building)
    this.setState({ region, detailBuilding: building, modalVisible: true });
    this.pickLocationHandler(region);
  }
  pickLocationHandler = (region) => {
    this.maps.animateToRegion(region);
  }
  filterShopHandler = (selection, district) => {
    let buildingList = this.props.buildings;
    if (district) {
      buildingList = buildingList.filter(building => {
        return building.district === district.district_name;
      });
    }
    if (buildingList.length) {
      const region = {
        latitudeDelta: 0.045,
        longitudeDelta: 0.02,
        latitude: 0,
        longitude: 0
      };
      let count = 0;
      buildingList.forEach(building => {
        if (building.long && building.lat) {
          region.longitude += parseFloat(building.long);
          region.latitude += parseFloat(building.lat);
          count++;
        }
      });
      region.longitude = region.longitude / count;
      region.latitude = region.latitude / count;
      this.setState({
        region,
        buildingList
      });
      this.pickLocationHandler(region);
    } else {
      this.setState({ buildingList });
    }
  }
  selectBuilding = (building) => {
    this.props._onfetchBuildingDetail(building.building_detail);
    this.props.navigation.navigate('BuildingDetails');
    this.closeModalHandler();
  }
  closeModalHandler = () => {
    this.setState({ modalVisible: false, detailBuilding: null });
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <MapView
          style={{ flex: 1 }}
          initialRegion={this.state.region}
          showsUserLocation={true}
          ref={ref => this.maps = ref}
        >
          {this.state.buildingList.map((building) => (
            <MapView.Marker
              key={building.building_id}
              coordinate={{
                latitude: parseFloat(building.lat),
                longitude: parseFloat(building.long)
              }}
              title={building.sub_name}
              description={building.sub_name}
              onPress={() => this.handleSelectedBuilding(building)}
            >
              <MapView.Callout tooltip style={styles.callout}>
                <View>
                  <Text>{`${building.sub_name}, ${building.district}`}</Text>
                  <Text style={{ fontSize: 14 }}>{building.rent_acreage}</Text>
                </View>
              </MapView.Callout>
            </MapView.Marker>
          ))}
        </MapView>
        {this.state.buildingList.length ?
          <View style={styles.buildingSlides}>
            <BuildingSlides
              buildings={this.state.buildingList}
              selectedBuilding={this.handleSelectedBuilding}
            />
          </View>
          : null
        }
        {this.state.modalVisible ?
          <LocationDetails
            visible={this.state.modalVisible}
            building={this.state.detailBuilding}
            gotoBuilding={this.selectBuilding}
            closeModal={this.closeModalHandler}
          />
          : null}
        <View style={styles.selectBox}>
          <MapFilter
            style={{ flex: 1 }}
            bgColor={'#fff'}
            tintColor={'#686868'}
            activityTintColor={'#000'}
            maxHeight={300}
            handler={(selection, row, dataFilter) => this.filterShopHandler(selection, row, dataFilter)}
          />
        </View>
        <View style={{ position: 'absolute', bottom: 150, right: 5 }}>
          <Icon
            reverse
            name='my-location'
            type='material'
            color='#156DAC'
            size={18}
            reverseColor={'#fff'}
            onPress={() => this.getCurrentPosition(true)} />
        </View>
      </View >
    )
  }
}

const styles = StyleSheet.create({
  callout: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ebebeb'
  },
  buildingSlides: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0
  },
  selectBox: {
    position: 'absolute',
    top: 15,
    left: 0,
    right: 0
  },
});

const mapStateToProps = state => ({
  buildings: state.buildings.buildings
});

const mapDispatchToProps = dispatch => {
  return {
    _onfetchBuildingDetail: (building) => dispatch(actions.fetchBuildingDetail(building))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Locations);