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
import i18n, { getCurrentLocale } from '../../i18n';
import { Modal, Button } from '../common';

const LocationDetails = (props) => {
  const building = props.building;
  const locale = getCurrentLocale();
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
          <View style={{ paddingBottom: 15, backgroundColor: brandLight }}>
            <BuildingMaps building={building} height={120} />
            <View style={{ marginTop: 10, justifyContent: 'center' }}>
              <View style={styles.phoneContainer}>
                <View style={styles.locationIcon}>
                  <Icon
                    name='location-pin'
                    type='SimpleLineIcons'
                    style={{ fontSize, color: textLightColor }}
                  />
                </View>
                <Text style={{ width: DEVICE_WIDTH - 50 }} numberOfLines={1}>{`${building.building_detail.address}, ${building.building_detail.district}`}</Text>
              </View>
              <TouchableOpacity onPress={() => Linking.openURL(`tel:${phoneNumber}`)} style={styles.phoneContainer}>
                <View style={styles.locationIcon}>
                  <Icon
                    name='old-phone'
                    type='Entypo'
                    style={{ fontSize, color: brandPrimary }}
                  />
                </View>
                <Text style={styles.phoneNumber}>{phoneNumber}</Text>
              </TouchableOpacity>
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
          <View style={{ backgroundColor: brandLight, paddingVertical: 15 }}>
            <View style={styles.line}>
              <View style={styles.iconContainer}>
                <Icon style={styles.icon} name='building-o' type='FontAwesome' />
              </View>
              <Text style={{ width: DEVICE_WIDTH - 50 }}>{building.building_detail.structure ? building.building_detail.structure : `${i18n.t('buildingDetail.structure')} : -- `}</Text>
            </View>
            <View style={styles.line}>
              <View style={styles.iconContainer}>
                <Icon style={[styles.icon, { fontSize: 24 }]} name='md-star-outline' />
              </View>
              <Text>{building.building_detail[`classify_name_${locale}`]}</Text>
            </View>
            <View style={[styles.line, { marginBottom: 0 }]}>
              <View style={styles.iconContainer}>
                <Icon style={[styles.icon, { fontSize: 22, color: brandPrimary }]} name='md-pricetag' />
              </View>
              <Text style={{ color: brandPrimary, fontWeight: 'bold' }}>{building.building_detail.rent_cost.toFixed(1)}$/m2</Text>
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
  phoneNumber: {
    color: brandPrimary
  },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 5
  },
  icon: {
    color: textLightColor,
    fontSize: 18
  },
  locationIcon: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconContainer:  {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center'
  }
};

export default LocationDetails;
