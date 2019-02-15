import React from 'react';
import {
  View,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity
} from 'react-native';
import { Icon } from 'native-base';

import { brandPrimary, backgroundColor, brandLight, DEVICE_WIDTH, fontSize, textColor, phoneNumber, inverseTextColor, textLightColor, isIphoneX } from '../../config/variables';
import { BuildingMaps, BuildingSlider } from '../buildings';
import i18n from '../../i18n';
import { Modal, Button } from '../common';

const LocationDetails = (props) => {
  const building = props.building;

  return (
    <Modal
      visible={props.visible}
      onRequestClose={props.closeModal}
      title={`PAXSKY ${building.sub_name}`}
    >
      <View style={{ flex: 1, backgroundColor }}>
        <ScrollView contentContainerStyle={{ paddingBottom: isIphoneX ? 20 : 0 }}>
          <BuildingSlider
            height={220}
            showsPagination={true}
            autoplay={true}
            buildingDetail={building.building_detail}
          />
          <View style={{ paddingVertical: 15, backgroundColor: brandLight }}>
            <View style={{ paddingHorizontal: 15 }}>
              <BuildingMaps building={building} />
              <View style={{ marginTop: 15, justifyContent: 'center' }}>
                <View style={{ flexDirection: 'row' }}>
                  <Icon
                    name='location-on'
                    type='MaterialIcons'
                    style={{ fontSize: fontSize + 2, color: textColor }}
                  />
                  <Text style={{ paddingLeft: 8, width: DEVICE_WIDTH - 50 }} numberOfLines={1}>{`${building.building_detail.address}, ${building.building_detail.district}`}</Text>
                </View>
                <View style={styles.phoneContainer}>
                  <TouchableOpacity onPress={() => Linking.openURL(`tel:${phoneNumber}`)} style={styles.phoneTouch}>
                    <Icon
                      name='old-phone'
                      type='Entypo'
                      style={{ fontSize }}
                    />
                    <Text style={styles.phoneNumber}>{phoneNumber}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.buttonArea}>
            <Button
              icon={
                <Icon
                  name='directions'
                  type="MaterialCommunityIcons"
                  style={{ color: inverseTextColor, fontSize: fontSize + 6, marginRight: 5 }}
                />
              }
              onPress={() => Linking.openURL(`https://www.google.com/maps?daddr=${building.lat},${building.long}`)}
              titleStyle={{ fontSize }}
              buttonStyle={{
                borderRadius: 20,
                paddingRight: 15,
                minWidth: 200,
                margin: 0
              }}
              title={i18n.t('buildingDetail.getDirection')}
            />
          </View>
          <View style={{ backgroundColor: brandLight, padding: 15 }}>
            <View style={styles.line}>
              <Icon style={styles.icon} name='building-o' type='FontAwesome' />
              <Text>{building.building_detail.structure ? building.building_detail.structure : `${i18n.t('buildingDetail.structure')} : -- `}</Text>
            </View>
            {/* <View style={styles.line}>
              <Icon style={styles.icon} name='directions-fork' type='MaterialCommunityIcons' />
              <Text>{building.building_detail.direction}</Text>
            </View> */}
            <View style={styles.line}>
              <Icon style={[styles.icon, { fontSize: 28 }]} name='md-star-outline' />
              <Text>{building.building_detail.classify_name}</Text>
            </View>
            <View style={styles.line}>
              <Icon style={[styles.icon, { fontSize: 26, color: brandPrimary }]} name='md-pricetag' />
              <Text style={{ color: brandPrimary }}>{building.building_detail.rent_cost.toFixed(1)}$/m2</Text>
            </View>
          </View>
          <View style={styles.buttonArea}>
            <Button
              icon={
                <Icon
                  name='md-arrow-dropright-circle'
                  type="Ionicons"
                  style={{ color: inverseTextColor, fontSize: fontSize + 6, marginRight: 5 }}
                />
              }
              onPress={() => Linking.openURL(`https://www.google.com/maps?daddr=${building.lat},${building.long}`)}
              titleStyle={{ fontSize }}
              buttonStyle={{
                borderRadius: 20,
                paddingRight: 15,
                minWidth: 200,
                margin: 0
              }}
              title={i18n.t('buildingDetail.viewDetails')}
              onPress={() => props.gotoBuilding(building)}
            />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = {
  image: {
    width: '100%',
    height: 200
  },
  buttonArea: {
    alignItems: 'center',
    paddingHorizontal: 15,
    marginVertical: 15
  },
  phoneContainer: {
    flexDirection: 'row',
    paddingTop: 5
  },
  phoneTouch: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  phoneNumber: {
    paddingLeft: 8
  },
  line: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 5,
    alignItems: 'center',
    marginRight: 10
  },
  icon: {
    color: textLightColor,
    fontSize: 22,
    width: 40
  },
};

export default LocationDetails;
