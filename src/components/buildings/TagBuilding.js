import React from 'react';
import { StyleSheet, View, Image } from 'react-native'
import { Text } from "native-base";
import { shadow } from '../../config/variables';
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
      detail.acreage_rent_array.length == 1 ? `${detail.acreage_rent_array[0]}m2` : 'Chưa cập nhật'
    return (
      <View style={[shadow, { position: 'relative', height: '100%', flex: 1 }]}>
        <View>
          {this.state.loadingImageFailed ?
            <Image resizeMode={'cover'} style={{ width: '100%', height: '100%' }} source={LOGO} /> :
            <Image style={{ width: '100%', height: '100%' }}
              onError={({ nativeEvent: { error } }) => { this.setState({ loadingImageFailed: true }) }}
              source={{ uri: detail.main_image }} />
          }
        </View>
        <View style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}>
          <View style={{
            backgroundColor: 'rgba(13, 61, 116,0.65)',
            flex: 1,
            justifyContent: 'flex-end',
            padding: '5%',
          }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: '10%', }}>
              <Text numberOfLines={1} style={styles.district}>{detail.district}</Text>
              <View style={[styles.spectators, { marginVertical: '6%' }]} />
              <Text numberOfLines={2} style={styles.sub_name} adjustsFontSizeToFit uppercase >{detail.sub_name}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text numberOfLines={2} adjustsFontSizeToFit style={styles.rent_acreage}>{detail.rent_acreage}</Text>
              <Text numberOfLines={1} adjustsFontSizeToFit style={styles.rent_cost}>{`$${detail.rent_cost.toFixed(1)}`}</Text>
            </View>
          </View>
        </View>
      </View >
    )
  }
}

const styles = StyleSheet.create({
  district: { color: '#FFF', lineHeight: 20, fontSize: 13, },
  sub_name: { color: '#FFF', lineHeight: 24, fontSize: 16, height: 24 * 2, textAlign: 'center' },
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