import React, { Component } from 'react';
import { View, ActivityIndicator, Text, TouchableHighlight, Alert } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements'

import i18n from '../../i18n';
import * as actions from '../../stores/actions';
// import { mapStyle } from '../../util/map';
import { Slides, ShopDetails } from '../../components/Location';
import { updateObject } from '../../util/utility';
import {
  textDarkColor,
  inverseTextColor
} from '../../config/variables';
import DropdownMenu from '../../components/ReactNativeDropdownMenu';

class Location extends Component {
  state = {
    mapLoaded: false,
    region: {
      latitude: 10.767932254302465,
      longitude: 106.6927340513601,
      latitudeDelta: 0.045,
      longitudeDelta: 0.02,
    },
    business: {
      contain: []
    },
    isVisibleShopDetail: false,
    isVisibleRestaurant: false,
    currentLocation: null,
    selectedShop: null,
    isChangeBrand: false,
  }

  async componentDidMount() {
    this.props.navigation.addListener('didFocus', () => {
      this.props.navigation.setParams({ updatedTime: new Date() });
    });
    this.getCurrentPosition();
    this.setState({ mapLoaded: true });
    if (!this.props.businesses[0]) {
      await this.props.onFetchBusiness();
    }
    if (this.props.businesses[0]) {
      this.setState({ business: this.props.businesses[0] });
    }
  }
  getCurrentPosition = (isAction) => {
    navigator.geolocation.getCurrentPosition(pos => {
      const region = {
        ...this.state.region,
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude
      };
      this.setState({ region, currentLocation: region });
      this.pickLocationHandler(region);
    }, error => {
      if (isAction) {
        Alert.alert(i18n.t('location.cannotGetLocation'));
      }
    });
  }
  pickLocationHandler = (region) => {
    this.maps.animateToRegion(region);
  }
  onRegionChangeComplete = (region) => {
    this.setState(prevState => {
      return {
        region: {
          ...prevState.region,
          latitudeDelta: region.latitudeDelta,
          longitudeDelta: region.longitudeDelta
        }
      };
    });
  }
  handleSelectedShop = (shop, locationOnly) => {
    const region = updateObject(this.state.region, {
      latitude: shop.blat,
      longitude: shop.blng
    });
    const newRegion = shop.blat ? { latitude: shop.blat, longitude: shop.blng } : {};
    this.setState({
      isVisibleShopDetail: true,
      region: { ...this.state.region, newRegion },
      selectedShop: locationOnly ? null : { ...shop }
    });
    this.pickLocationHandler(region);
  }

  changeShop = (shop) => {
    this.setState({ selectedShop: { ...shop } });
    this.restaurantModalHandler();
  }

  hideShopDetail = () => {
    this.setState({ selectedShop: null, isVisibleShopDetail: false });
  }
  restaurantModalHandler = () => {
    this.setState(prevState => {
      return { isVisibleRestaurant: !prevState.isVisibleRestaurant }
    });
  }
  makeABooking = (shop) => {
    this.props.onSetSelectedShop(shop, this.state.business);
    this.setState({ isVisibleShopDetail: false, selectedShop: null }, () => {
      setTimeout(() => {
        this.props.navigation.navigate('Booking', { shopId: shop.bid, shopName: shop.bname });
      });
    });
  }
  filterShopHandler = (selection, row, dataFilter) => {
    const region = {
      ...this.state.region,
      latitude: 0,
      longitude: 0
    };
    let count = 0;
    dataFilter[selection][row].contain.forEach(shop => {
      if (shop.blng && shop.blat) {
        region.longitude += shop.blng;
        region.latitude += shop.blat;
        count++;
      }
    });
    region.longitude = region.longitude / count;
    region.latitude = region.latitude / count;
    this.setState({
      region,
      business: dataFilter[selection][row],
      isChangeBrand: !this.state.isChangeBrand
    });
    this.pickLocationHandler(region);
  }

  render() {
    if (!this.state.mapLoaded) {
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size='large' />
        </View>
      );
    }
    return (
      <View style={{ flex: 1, position: 'relative' }}>
        <MapView
          style={{ flex: 1 }}
          initialRegion={this.state.region}
          showsUserLocation={true}
          provider={PROVIDER_GOOGLE}
          // style={StyleSheet.absoluteFill}
          // followsUserLocation={true}
          // loadingEnabled={true}
          // showsMyLocationButton={true}
          // region={this.state.region}
          ref={ref => this.maps = ref}
          onRegionChangeComplete={(region) => this.onRegionChangeComplete(region)}
        // customMapStyle={mapStyle}
        >
          {this.state.business.contain.map((shop) => (
            shop.blat ?
              <MapView.Marker
                key={shop.bid}
                coordinate={{ latitude: shop.blat, longitude: shop.blng }}
                title={shop.bname}
                description={shop.badd}
                onPress={() => this.handleSelectedShop(shop, true)}
              // image={shop.type === 'coffee' ? markerIcon : yenIcon}
              >
                <MapView.Callout tooltip style={styles.callout}>
                  {/* <TouchableHighlight onPress={() => this.handleSelectedShop(shop)}> */}
                    <View>
                      <Text style={{ color: textDarkColor, fontWeight: 'bold' }}>{shop.bname}</Text>
                      <Text style={{ color: textDarkColor }}>{shop.badd}</Text>
                    </View>
                  {/* </TouchableHighlight> */}
                </MapView.Callout>
              </MapView.Marker> : null
          ))}
        </MapView>
        <View style={styles.listShop}>
          <Slides
            isChangeBrand={this.state.isChangeBrand}
            business={this.state.business}
            selectShop={this.handleSelectedShop}
          />
        </View>
        <View style={styles.selectBox}>
          <DropdownMenu
            style={{ flex: 1 }}
            bgColor={'#fff'}
            tintColor={textDarkColor}
            activityTintColor={inverseTextColor}
            maxHeight={300}
            handler={(selection, row, dataFilter) => this.filterShopHandler(selection, row, dataFilter)}
          >
          </DropdownMenu>
        </View>
        {this.state.selectedShop ?
          <ShopDetails
            show={this.state.isVisibleShopDetail}
            onClose={this.hideShopDetail}
            shop={this.state.selectedShop}
            business={this.state.business}
            changeShop={this.changeShop}
            makeABooking={this.makeABooking}
            isVisibleRestaurant={this.state.isVisibleRestaurant}
            restaurantModalHandler={this.restaurantModalHandler}
          />
          : null
        }
        <View style={{ position: 'absolute', bottom: 140, right: 5 }}>
          <Icon
            reverse
            size={20}
            name='my-location'
            type='material'
            color='#00a8f7'
            reverseColor={'#fff'}
            onPress={() => this.getCurrentPosition(true)} />
        </View>
      </View>
    );
  }
}

const styles = {
  listShop: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0
  },
  selectBox: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0
  },
  callout: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ebebeb'
  }
};

const mapStateToProps = state => ({
  token: state.auth.token,
  user: state.auth.user,
  businesses: state.bookingTable.businesses
});

const mapDispatchToProps = dispatch => ({
  onSetSelectedShop: (selectedShop, business) => dispatch(actions.setSelectedShop(selectedShop, business)),
  onFetchBusiness: () => dispatch(actions.fetchBusiness()),
  changePage: (screen) => dispatch(actions.updateActiveMainScreen(screen))
});


export default connect(mapStateToProps, mapDispatchToProps)(Location);