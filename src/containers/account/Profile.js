import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import { Content, Icon, Text, } from "native-base";

import { brandPrimary, textDarkColor, textTitleColor } from '../../config/variables';

const LOGO = require('../../assets/images/logo-grey.jpg')

export default class Profile extends Component {
  constructor(props) {
    super(props)
  }
  static defaultProps = {
    isAuth: '',
    user: {},
    navigation: {},
    callToLogout: () => { },
  }

  state = {
    loadingImageFailed: null
  }

  render() {
    const { user } = this.props
    const profile = user.customer
    return (
      <Content style={{ paddingHorizontal: 15 }}>
        <View style={[styles.paragraph, { flexDirection: 'row', alignItems: 'center' , paddingVertical: 15}]}>
          <View>
            {this.state.loadingImageFailed ? <Image resizeMode={'cover'} style={{ width: '20%', height: '20%', borderRadius: 10 }} source={LOGO} /> :
              <Image resizeMode={'cover'}
                style={{ width: '20%', height: '20%', borderRadius: 10 }}
                source={{ uri: profile.image_profile }}
                loadingIndicatorSource={{ uri: profile.image_profile }}
                onError={({ nativeEvent: { error } }) => { this.setState({ loadingImageFailed: true }) }}
              />}
          </View>
          <View style={{ marginHorizontal: 15, }}  >
            <Text style={styles.textHeadline}>{profile.first_name}</Text>
            <Text style={styles.textHeadline}>{profile.last_name}</Text>
          </View>

        </View>
        <View style={styles.paragraph}>
          <View style={styles.lineBottom} >
            <Text style={styles.textTitle}>{'Email'}</Text>
            <Text style={styles.textContent}>{profile.email}</Text>
          </View>
          <View style={styles.lineBottom} >
            <Text style={styles.textTitle}>{'Điện thoại'}</Text>
            <Text style={styles.textContent}>{profile.mobile_phone}</Text>
          </View>
          <View style={styles.lineBottom} >
            <Text style={styles.textTitle}>{'Địa chỉ'}</Text>
            <Text style={styles.textContent} adjustsFontSizeToFit >
              {profile.address !== '' && `${profile.address},`}
              {profile.district_name}, {profile.province_name}
            </Text>
          </View>
          <View style={styles.lineBottom} >
            <Text style={styles.textTitle}>{'Giới tính'}</Text>
            <Text style={styles.textContent}>{profile.gender}</Text>
          </View>
        </View>
        <TouchableOpacity activeOpacity={0.6}
          onPress={() => { this.props.callToLogout() }}>
          <Text style={{ color: brandPrimary }}>{'Đăng xuất'}</Text>
        </TouchableOpacity>
      </Content >
    )
  }
}
const styles = StyleSheet.create({
  paragraph: {
    paddingVertical: 10,
  },
  lineBottom: {
    borderBottomColor: 'rgba(0,0,0,0.5)',
    borderBottomWidth: 0.3,
    marginVertical: 5,
    paddingBottom: 10,
  },
  textHeadline: {
    color: textTitleColor,
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 24 * 1.5
  },
  textTitle: {
    color: textDarkColor,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 30
  },
  textContent: {
    color: textDarkColor,
    fontSize: 18,
    fontWeight: '300',
    lineHeight: 30
  },
})

