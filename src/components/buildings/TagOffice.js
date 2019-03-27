import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text } from 'react-native';
import { Icon, ListItem, Left, Body, Button } from "native-base";
import LinearGradient from 'react-native-linear-gradient';
import { Divider } from 'react-native-elements';

import { brandLight, textLightColor, brandPrimary, fontSize, textColor, shadow } from '../../config/variables';
import i18n, { getCurrentLocale } from '../../i18n';
import { getOfficeFloorName, capitalize } from '../../util/utility';

export default class TagOffice extends React.Component {
  state = {
    image_srcFailed: null,
    image_thumbnail_srcFailed: null,
    image_thumbnail_src: true
  }

  render() {
    const officeDetail = this.props.officeDetail;
    const locale = getCurrentLocale();
    const floorName = getOfficeFloorName(officeDetail.floor);
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{officeDetail.office_name}</Text>
        {this.state.image_thumbnail_src ?
          <TouchableOpacity onPress={() => this.props.viewImage(officeDetail.image_src)}>
            <Image style={{ width: '100%', height: 180 }}
              source={{ uri: officeDetail.image_thumbnail_src }}
              resizeMethod={'resize'}
              onError={({ nativeEvent: { error } }) => { this.setState({ image_thumbnail_src: false }) }}
            />
          </TouchableOpacity>
          :
          <View style={styles.noImage}>
            <Icon
              name='md-images'
              type='Ionicons'
              style={{ color: '#bbbbbb', fontSize: 55 }}
            />
          </View>
        }
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
          <Icon
            name="vector-square"
            type='MaterialCommunityIcons'
            style={{ fontSize: fontSize + 4, color: textColor, marginRight: 10 }} />
          <Text>{`${officeDetail.acreage_rent}m2`}</Text>
        </View>
        {/* <Divider style={{ marginVertical: 10 }} /> */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
          <Icon
            name="floor-plan"
            type='MaterialCommunityIcons'
            style={{ fontSize: fontSize + 4, color: textColor, marginRight: 10 }} />
          <Text>{capitalize(floorName)}</Text>
        </View>
        {/* <Divider style={{ marginVertical: 10 }} /> */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon
            name="directions-fork"
            type='MaterialCommunityIcons'
            style={{ fontSize: fontSize + 4, color: textColor, marginRight: 10 }} />
          <Text>{officeDetail[`direction_${locale}`]}</Text>
        </View>
        <Divider style={{ marginTop: 10, marginHorizontal: 20 }} />
        <Button transparent block onPress={this.props.onPress}>
          <Text style={{ color: brandPrimary, fontSize: fontSize + 2 }}>{i18n.t('appointment.appointmentRequest')}</Text>
        </Button>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    ...shadow,
    backgroundColor: brandLight,
    marginBottom: 15,
    padding: 15,
    paddingBottom: 5
  },
  title: {
    fontSize: fontSize + 4,
    fontWeight: '500',
    marginBottom: 15,
    textAlign: 'center'
  },
  noImage: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center'
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
    color: textLightColor,
    fontSize: 22,
    width: 30
  }
})
