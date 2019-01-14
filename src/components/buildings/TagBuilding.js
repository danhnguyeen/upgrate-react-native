import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, ImageBackground } from 'react-native'
import { Text } from "native-base";
import FastImage from 'react-native-fast-image'

import { shadow, DEVICE_WIDTH } from '../../config/variables';
// const LOGO = require('../../assets/images/logo-grey.jpg');

class TagBuilding extends React.Component {
  state = {
    loadingImageFailed: null
  }

  render() {
    const detail = this.props.detailBuilding
    detail.acreage_rent_array.sort((a, b) => { return a - b })
    detail.sub_name = detail.sub_name.replace("PAX SKY", "").replace("PAXSKY", "").trim()

    detail.rent_acreage = detail.acreage_rent_array.length > 1 ?
      `Từ ${detail.acreage_rent_array[0]}m2 \nđến ${detail.acreage_rent_array[detail.acreage_rent_array.length - 1]}m2` :
      detail.acreage_rent_array.length == 1 ? `${detail.acreage_rent_array[0]}m2` : 'Chưa cập nhật';
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => {
          this.props._onfetchBuildingDetail(detail.building_id)
          this.props.navigation.navigate('BuildingDetails', { building_id: detail.building_id })
        }}>
        <View style={{ borderRadius: 5, overflow: 'hidden' }}>
          <FastImage source={{ uri: detail.main_image, priority: FastImage.priority.high }} style={{ width: '100%', height: '100%' }}>
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
          </FastImage>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    ...shadow,
    shadowOpacity: 0.5,
    elevation: 3,
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