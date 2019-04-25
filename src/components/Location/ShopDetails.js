import React from 'react';
import {
  View,
  Linking,
  ScrollView
} from 'react-native';

import { brandPrimary, brandDark } from '../../config/variables';
import { RestaurantList, RestaurantSelect } from '../BookTable/RestaurantSelect';
import { Map, Details, Slider } from '../BookTable/About';
import i18n from '../../i18n';
import { OutlineButton, Modal } from '../common';

const ShopDetails = (props) => (
  <Modal
    visible={props.show}
    onRequestClose={props.onClose}
    title={props.shop.bname}
  >
    <RestaurantList
      isVisible={props.isVisibleRestaurant}
      onClose={props.restaurantModalHandler}
      changeShop={props.changeShop}
      selectedShop={props.shop}
      title={props.business.BrandName}
      shops={props.business.contain}
    />
    <View style={{ flex: 1, backgroundColor: brandDark }}>
      <ScrollView>
        <View>
          <Slider height={220} showsPagination={false} autoplay={true} selectedShop={props.shop} />
          <RestaurantSelect
            selectedShop={props.shop}
            openModal={props.restaurantModalHandler}
          />
        </View>
        <Map selectedShop={props.shop} isLocation />
        <View style={styles.buttonArea}>
          <OutlineButton
            icon={{ name: 'map-marker', type: 'font-awesome', size: 15, color: brandPrimary }}
            title={i18n.t('location.getDirection')}
            buttonStyle={{ width: 200 }}
            onPress={() => Linking.openURL(`https://www.google.com/maps?daddr=${props.shop.blat},${props.shop.blng}`)}
          />
        </View>
        <Details selectedShop={props.shop} />
        <View style={styles.buttonArea}>
          <OutlineButton
            buttonStyle={{ width: 200 }}
            title={i18n.t('booking.about.viewDetails')}
            onPress={() => props.makeABooking(props.shop)}
          />
        </View>
      </ScrollView>
    </View>
  </Modal>
);

const styles = {
  image: {
    width: '100%',
    height: 200
  },
  buttonArea: {
    justifyContent: 'center',
    alignItems: 'center'
  },
};

export default ShopDetails;
