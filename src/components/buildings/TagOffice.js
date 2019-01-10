import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { Text, Icon } from "native-base";
import LinearGradient from 'react-native-linear-gradient';

import { brandLight } from '../../config/variables';

const LOGO = require('../../assets/images/logo-grey.jpg')

export default class TagOffice extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      image_srcFailed: null,
      image_thumbnail_srcFailed: null,
      image_thumbnail_src: true
    }
  }

  render() {
    const data = {
      "acreage_rent": 230,
      "acreage_total": 230,
      "building_id": 3,
      "direction": "Hướng Bắc",
      "floor_name": "Mezzanine",
      "image_src": "http://paxsky.amagumolabs.io/storage/app/public/offices/12/1543333793_180425_Layout_PAX SKY 13-15_1,2,3,4,5,6,7,8F.jpg",
      "image_thumbnail_src": "http://paxsky.amagumolabs.io/storage/app/public/offices/12/thumbnail/1543333793_180425_Layout_PAX SKY 13-15_1,2,3,4,5,6,7,8F.jpg",
      "office_id": 12,
      "office_name": "Office layout 230m2",
    }
    const { office_name, floor_name, direction, acreage_rent, acreage_total, image_src } = data
    const officeDetail = this.props.officeDetail

    return (
      <View style={[styles.paragraph, { paddingHorizontal: 15 }]}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 0.6 }}>
            {this.state.image_thumbnail_src ?
              <Image style={{ width: '100%', height: 148 }} resizeMode={'cover'}
                onError={({ nativeEvent: { error } }) => { this.setState({ image_thumbnail_src: false }) }}
                source={{ uri: data.image_thumbnail_src }} />
              :
              <Image resizeMode={'cover'} style={{ width: '100%', height: 148 }} source={LOGO} />
            }
          </View>
          <View style={{ flex: 0.4, paddingLeft: 10, }}>
            <View style={{ flexDirection: 'row' }}>
              <Icon style={{ color: '#686868', lineHeight: 30, fontSize: 20, marginRight: 10 }} name='ios-expand' type='Ionicons' />
              <Text style={{ color: '#686868', lineHeight: 30 }}>{officeDetail.acreage_rent}m2</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Icon style={{ color: '#686868', lineHeight: 30, fontSize: 20, marginRight: 10 }} name='elevator' type='Foundation' />
              <Text style={{ color: '#686868', lineHeight: 30 }}>{officeDetail.floor_name}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Icon style={{ color: '#686868', lineHeight: 30, fontSize: 20, marginRight: 10 }} name='ios-eye' type='Ionicons' />
              <Text style={{ color: '#686868', lineHeight: 30 }}>{officeDetail.direction}</Text>
            </View>
            <TouchableOpacity style={{ flex: 1, flexDirection: 'row' }}
              onPress={() => { this.props.navigation.navigate('Booking', { dataProps: { officeDetail: officeDetail } }) }}>
              <LinearGradient start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }} colors={['#80C2F3', '#3E89E2']}
                style={{ flex: 1, borderRadius: 3, alignItems: 'center', alignContent: 'center', justifyContent: 'center', flexDirection: 'row', }} >
                <Icon style={[styles.buttonBgText, { fontSize: 22, paddingRight: 5 }]} name={`calendar-plus`} type={'MaterialCommunityIcons'} />
                <Text style={[styles.buttonBgText]}>Đặt lịch hẹn</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <Text style={{ color: '#0D3D74', lineHeight: 30, fontWeight: '700' }}>{officeDetail.office_name}</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  paragraph: {
    backgroundColor: brandLight,
    borderRadius: 3,
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonBgText: {
    color: '#FFF',
    textAlign: 'center'
  },
  line: {
    flexDirection: 'row',
    paddingVertical: 5,
    marginRight: 10
  },
  text: {
    color: '#686868',
    fontWeight: '400',
  },
  icon: {
    color: '#686868',
    width: 30,
    fontSize: 22,
  }
})
