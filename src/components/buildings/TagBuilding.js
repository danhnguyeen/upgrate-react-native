import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, ImageBackground } from 'react-native'
import { Text } from "native-base";

import { shadow, DEVICE_WIDTH } from '../../config/variables';
const LOGO = require('../../assets/images/logo-grey.jpg');

class TagBuilding extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loadingImageFailed: null
    }
  }
  render() {
    const data = {
      "acreage_rent_array": [
        50,
        71,
        75,
        80,
        90,
        150,
        160,
        180,
        230,
      ],
      "acreage_rent_list": "230-180-50-80-90-160-150-71-75",
      "address": "13 - 15 - 17 Trương Định",
      "building_id": 8,
      "classify_name": "Văn phòng hạng B",
      "direction": "Hướng Đông Bắc",
      "district": "Quận 3",
      "electricity_cost": "0.00",
      "main_image": "http://paxsky.amagumolabs.io/storage/app/public/buildings/8/1544669937_pax-sky-13-truong-dinh-1.jpg",
      "main_image_thumbnail": "http://paxsky.amagumolabs.io/storage/app/public/buildings/8/thumbnail/1544669937_pax-sky-13-truong-dinh-1.jpg",
      "manager_cost": "4.50",
      "rent_cost": 28.7,
      "rental_cost": "22.00",
      "structure": " 2 hầm 11 tầng 11 sân thượng",
      "sub_name": "PAX SKY 13-15-17 Trương Định",
      "tax_cost": "2.20",
    }

    const detail = this.props.detailBuilding
    detail.acreage_rent_array.sort((a, b) => { return a - b })
    detail.sub_name = detail.sub_name.replace("PAX SKY", "").replace("PAXSKY", "").trim()


    detail.rent_acreage = detail.acreage_rent_array.length > 1 ?
      `Từ ${detail.acreage_rent_array[0]}m2 \nđến ${detail.acreage_rent_array[detail.acreage_rent_array.length - 1]}m2` :
      detail.acreage_rent_array.length == 1 ? `${detail.acreage_rent_array[0]}m2` : 'Chưa cập nhật';
    const picture = detail.main_image ? { uri: detail.main_image } : LOGO;
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => {
          this.props._onfetchBuildingDetail(detail.building_id)
          this.props.navigation.navigate('BuildingDetails', { building_id: detail.building_id })
        }}>
        <View style={{ borderRadius: 5, overflow: 'hidden' }}>
          <ImageBackground source={picture} style={{ width: '100%', height: '100%' }}>
            <View style={{
              backgroundColor: 'rgba(13, 61, 116,0.65)',
              flex: 1,
              justifyContent: 'flex-end',
              paddingHorizontal: 15,
              paddingVertical: 10
            }}>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text numberOfLines={1} style={styles.district}>{detail.district}</Text>
                <View style={[styles.spectators, { marginVertical: '6%' }]} />
                <Text numberOfLines={2} style={styles.sub_name} adjustsFontSizeToFit uppercase >{detail.sub_name}</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text numberOfLines={2} adjustsFontSizeToFit style={styles.rent_acreage}>{detail.rent_acreage}</Text>
                <Text numberOfLines={1} adjustsFontSizeToFit style={styles.rent_cost}>{`$${detail.rent_cost.toFixed(1)}`}</Text>
              </View>
            </View>
          </ImageBackground>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    ...shadow,
    shadowOpacity: 0.5,
    width: (DEVICE_WIDTH - 10) / 2 - 15,
    height: (DEVICE_WIDTH - 10) / 2 - 15 + ((DEVICE_WIDTH - 10) / 2 - 15) * 0.2,
    // padding: 10,
    borderRadius: 5,
    margin: 5
  },
  district: { color: '#FFF', lineHeight: 20, fontSize: 13, },
  sub_name: { 
    color: '#FFF', 
    lineHeight: 24, 
    fontSize: 16, 
    height: 24 * 2, 
    textAlign: 'center',
    // fontWeight: 'bold'
  },
  rent_acreage: { color: '#DEBB3D', lineHeight: 21, fontSize: 14, flex: 0.6, height: 42 },
  rent_cost: { color: '#DEBB3D', lineHeight: 42, fontSize: 18, flex: 0.4, textAlign: 'right' },
  spectators: {
    backgroundColor: '#FFF',
    height: 0.5,
    width: '70%',
    flexDirection: 'row',
    justifyContent: 'center'
  },
});

export default TagBuilding;