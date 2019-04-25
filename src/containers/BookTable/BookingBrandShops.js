import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';

import * as actions from './booking-actions';
import {
  fontSize,
  brandDark,
  brandPrimary,
  brandLight,
  shadowColor,
  lineHeight,
  DEVICE_WIDTH
} from '../../config/variables';
import { ShopItem } from '../../components/Brand';

class BookingBrandShops extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('business').BrandName,
      headerBackTitle: null
    }
  };

  state = {
    business: this.props.navigation.getParam('business')
  }

  goToBookingTable = (selectedShop) => {
    this.props.onSetSelectedShop(selectedShop, this.state.business);
    this.props.navigation.navigate('Booking', { shopId: selectedShop.bid, shopName: selectedShop.bname });
  }

  render() {
    return (
      <View style={{ backgroundColor: brandDark, flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={{ flex: 1 }}>
            {this.state.business.contain.map((shop) => (
              <Animatable.View animation="fadeIn" key={shop.bid}>
                <TouchableOpacity
                  onPress={() => this.goToBookingTable(shop)}
                  style={styles.shopContainer}
                  elevation={1}
                  key={shop.bid}
                >
                 <ShopItem shop={shop} />
                  {/* <View style={{ flexDirection: 'row' }}>
                    <FastImage style={styles.pictureStyle} source={{ uri: shop.bimg_url }} />
                    <View style={styles.detailContainer}>
                      <View>
                        <Text style={styles.titleStyle} numberOfLines={1}>{shop.bname}</Text>
                        <View style={{ flexDirection: 'row' }}>
                          <Text style={{ flex: 1, flexWrap: 'wrap', lineHeight, fontSize: fontSize - 1 }}>{shop.badd}</Text>
                        </View>
                        <View style={styles.phoneTouch}>
                          {shop.bphone ?
                            <Icon
                              name='old-phone'
                              type='entypo'
                              color={brandPrimary}
                              size={14}
                            />
                            : null}
                          <Text style={styles.phoneNumber}>{shop.bphone}</Text>
                        </View>
                      </View>
                    </View>
                  </View> */}
                </TouchableOpacity>
              </Animatable.View>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    backgroundColor: brandDark
  },
  shopContainer: {
    // backgroundColor: brandLight,
    // padding: 15,
    // marginBottom: 10,
    // shadowColor: shadowColor,
    // shadowOffset: { width: 1, height: 1 },
    // shadowOpacity: 0.5,
    // shadowRadius: 5
  },
  pictureStyle: {
    width: 120,
    height: 90,
    borderRadius: 3
  },
  detailContainer: {
    paddingLeft: 10,
    justifyContent: 'space-between'
  },
  titleStyle: {
    lineHeight,
    marginBottom: 5,
    fontSize: fontSize + 1,
    // width: DEVICE_WIDTH - 150
  },
  phoneContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  phoneTouch: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  phoneNumber: {
    color: brandPrimary,
    bottom: 0,
    paddingLeft: 5,
    fontSize: fontSize - 1
  }
});

const mapStateToProps = state => ({
  restaurants: state.bookingTable.restaurants
});

const mapDispatchToProps = dispatch => ({
  onSetSelectedShop: (selectedShop, business) => dispatch(actions.setSelectedShop(selectedShop, business))
});

export default connect(mapStateToProps, mapDispatchToProps)(BookingBrandShops);
