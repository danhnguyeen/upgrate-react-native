import React from 'react';
import { connect } from 'react-redux';
import { View, Image, StyleSheet, TouchableOpacity, Text, Linking, Animated } from 'react-native';
import { Container, Icon } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { Header } from 'react-navigation';
import { Divider, Button } from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import Swiper from 'react-native-swiper';

import i18n, { getCurrentLocale } from '../../i18n';
import * as actions from './building-actions';
import { brandPrimary, isIphoneX, brandLight, platform, backgroundColor, textColor, fontSize, inverseTextColor, DEVICE_WIDTH, textLightColor, textH4, shadow, brandSuccess } from '../../config/variables';
import { BuildingMaps, BuildingDescription, ContactItem } from '../../components/buildings'
import { getBuildingStructure } from '../../util/utility';

const STATUSBAR_PADDING = isIphoneX ? 24 : 0
const HEADER_MAX_HEIGHT = 250;
const HEADER_MIN_HEIGHT = Header.HEIGHT + STATUSBAR_PADDING;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);

class BuildingDetails extends React.Component {
  state = {
    detailBuilding: null,
    isFetching: true,
    scrollY: new Animated.Value(
      // iOS has negative initial scroll value because content inset...
      platform === 'ios' ? -HEADER_MAX_HEIGHT : 0,
    ),
    refreshing: false,
  }

  render() {
    // Because of content inset the scroll value will be negative on iOS so bring
    // it back to 0.
    const scrollY = Animated.add(
      this.state.scrollY,
      platform === 'ios' ? HEADER_MAX_HEIGHT : 0,
    );
    const headerTranslate = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, -HEADER_SCROLL_DISTANCE],
      extrapolate: 'clamp',
    });

    const imageOpacity = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [1, 1, 0],
      extrapolate: 'clamp',
    });
    const imageTranslate = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, 100],
      extrapolate: 'clamp',
    });

    const titleScale = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [1, 1, 0.8],
      extrapolate: 'clamp',
    });
    const titleTranslate = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [0, 0, -8],
      extrapolate: 'clamp',
    });

    const detailBuilding = this.props.buildingDetail;
    const locale = getCurrentLocale();

    const structure = getBuildingStructure(detailBuilding, locale);
    return (
      <Container style={styles.container} >
        <Animated.ScrollView
          style={{ flex: 1 }}
          scrollEventThrottle={1}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
            { useNativeDriver: true },
          )}
          // iOS offset for RefreshControl
          contentInset={{
            top: HEADER_MAX_HEIGHT,
          }}
          contentOffset={{
            y: -HEADER_MAX_HEIGHT,
          }}
        >
          <View style={styles.scrollViewContent}>
            <View style={styles.blockContainer}>
              <View style={{ alignItems: 'center', marginBottom: 5 }}>
                <Text style={[textH4, { color: brandPrimary }]} numberOfLines={1}>{detailBuilding.sub_name}</Text>
                <Text style={{ fontStyle: 'italic', fontSize: fontSize - 2 }}>{detailBuilding[`address_${locale}`]}, {detailBuilding[`district_${locale}`]}</Text>
              </View>
              <View style={styles.line}>
                <Icon style={styles.icon} name='building-o' type='FontAwesome' />
                <Text>{structure ? structure : `${i18n.t('buildingDetail.structure')} : -- `}</Text>
              </View>
              <View style={styles.line}>
                <Icon style={styles.icon} name='vector-square' type='MaterialCommunityIcons' />
                {detailBuilding.acreage_rent_array && detailBuilding.acreage_rent_array.length > 0 ?
                  <Text style={{ width: DEVICE_WIDTH - 80 }}>
                    {detailBuilding.acreage_rent_array.join('-')}m2
                  </Text>
                  :
                  <Text>{detailBuilding.acreage_rent_list == 'FULL' ?
                    `${i18n.t('buildingDetail.acreage')} : ${i18n.t('buildingDetail.full')} `
                    : `${i18n.t('buildingDetail.structure')} : -- `}</Text>
                }
              </View>
              <View style={styles.line}>
                <Icon style={styles.icon} name='directions-fork' type='MaterialCommunityIcons' />
                <Text>{detailBuilding[`direction_${locale}`]}</Text>
              </View>
              <View style={styles.line}>
                <Icon style={[styles.icon, { fontSize: 28 }]} name='md-star-outline' type='Ionicons' />
                <Text>{detailBuilding[`classify_name_${locale}`]}</Text>
              </View>
              <View style={styles.line}>
                <Icon style={styles.icon} name='settings' type='SimpleLineIcons' />
                <Text>{i18n.t('buildingDetail.management')}: {detailBuilding.management_agence_name}</Text>
              </View>
              <View style={styles.line}>
                <Icon style={styles.icon} name='car-battery' type='MaterialCommunityIcons' />
                <Text>{detailBuilding.electricity_cost}{i18n.t('buildingDetail.electricityHour')}</Text>
              </View>
              {detailBuilding[`description_${locale}`] ?
                <React.Fragment>
                  <Divider style={{ marginVertical: 15 }} />
                  <BuildingDescription text={detailBuilding[`description_${locale}`]} />
                </React.Fragment>
                : null }
              <Divider style={{ marginVertical: 15 }} />
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <TouchableOpacity style={[styles.buttonComon, styles.button, { flex: 0.5, borderColor: '#e12d2d' }]}>
                  <Text style={[styles.buttonText, { color: '#e12d2d' }]}>{i18n.t('buildingDetail.price')}</Text>
                  <Text style={[styles.buttonText, { fontSize: 18, fontWeight: '700', color: '#e12d2d' }]}>{detailBuilding.rent_cost.toFixed(1)}$/m2</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.buttonBg, styles.button, { flex: 0.5, }]}
                  onPress={() => { this.props.navigation.navigate('Offices', { building_id: detailBuilding.building_id, building_name: detailBuilding.sub_name }) }}>
                  <Text style={[styles.buttonBgText]}>{i18n.t('buildingDetail.viewOffices')}</Text>
                  <Icon style={[styles.buttonBgText]} name='md-arrow-forward' type='Ionicons' />
                </TouchableOpacity>
              </View>
              <View style={{ marginTop: 5 }}>
                <Text style={{ fontSize: fontSize - 2, fontStyle: 'italic' }}>
                  {i18n.t('buildingDetail.currencyRate')}
                </Text>
              </View>
            </View>
            <View style={[styles.blockContainer, { padding: 0 }]}>
              <ContactItem
                title={'Ms. Phương Linh'}
                color={textLightColor}
                icon={<Icon active name="user-circle-o" type="FontAwesome" style={{ fontSize: 17 }} />}
                hideRight
              />
              <ContactItem
                title={'0911 07 22 99'}
                color={brandSuccess}
                onPress={() => Linking.openURL(`tel:+84911072299`)}
                icon={<Icon active name='old-phone' type='Entypo' style={{ fontSize: 17 }} />}
              />
              <ContactItem
                onPress={() => Linking.openURL(`https://zalo.me/1732464775151258581`)}
                title={i18n.t('contact.zalo')}
                color={'#008FF3'}
                isImage
                icon={<FastImage source={require('../../assets/images/zalo-icon.png')} style={{ width: 28, height: 28 }} />}
              />
              <ContactItem
                onPress={() => Linking.openURL(`https://m.me/paxskydotvn`)}
                title={i18n.t('contact.messenger')}
                color={'#4584ff'}
                icon={<Icon active name='facebook-messenger' type='MaterialCommunityIcons' style={{ fontSize: 18 }} />}
              />
              <ContactItem
                nonBorder
                onPress={() => Linking.openURL(`mailto:paxsky.vn?subject=Đăng ký tư vấn tòa nhà ${detailBuilding.sub_name}`)}
                title={'pkd@paxsky.vn'}
                icon={<Icon active name='ios-mail' type='Ionicons' style={{ fontSize: 18 }} />}
              />
            </View>
            <View style={styles.blockContainer}>
              <BuildingMaps style={{ margin: 15 }} height={180} building={detailBuilding} />
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
                <Icon
                  name='location-on'
                  type='MaterialIcons'
                  style={{ fontSize: fontSize + 2, color: textColor }}
                />
                <Text style={{ paddingLeft: 5, width: DEVICE_WIDTH - 50 }} numberOfLines={1}>{`${detailBuilding[`address_${locale}`]}, ${detailBuilding.district}`}</Text>
              </View>
              <Divider style={{ marginVertical: 15 }} />
              <View style={{ alignItems: 'flex-end' }}>
                <Button
                  icon={
                    <Icon
                      name='directions'
                      type="MaterialCommunityIcons"
                      style={{ color: brandPrimary, fontSize: fontSize + 6, marginRight: 5 }}
                    />
                  }
                  onPress={() => Linking.openURL(`https://www.google.com/maps?daddr=${detailBuilding.lat},${detailBuilding.long}`)}
                  iconContainerStyle={{ marginHorizontal: 10 }}
                  titleStyle={{ color: brandPrimary, fontSize }}
                  buttonStyle={{
                    elevation: 0,
                    borderColor: brandPrimary,
                    borderWidth: 1,
                    backgroundColor: 'transparent',
                    borderRadius: 20,
                    paddingRight: 15
                  }}
                  title={i18n.t('buildingDetail.getDirection')}
                />
              </View>
            </View>
          </View>
        </Animated.ScrollView>
        <Animated.View
          // pointerEvents="none"
          style={[
            styles.header,
            { transform: [{ translateY: headerTranslate }] },
          ]}
        >
          <LinearGradient
            colors={['#2079ae', '#54ace0']}
            style={{ flex: 1 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Swiper
              showsButtons={false}
              showsPagination={true}
              autoplay={true}
              autoplayTimeout={4}
              dot={
                <Animated.View style={{
                  backgroundColor: '#cccccc',
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  margin: 3,
                  opacity: imageOpacity
                }} />
              }
              activeDot={
                <Animated.View style={{
                  backgroundColor: inverseTextColor,
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  margin: 3,
                  opacity: imageOpacity
                }} />
              }
            >
              {detailBuilding.sub_images.map((image) => (
                <AnimatedFastImage
                  key={image}
                  style={[
                    styles.backgroundImage,
                    {
                      flex: 1,
                      width: '100%',
                      opacity: imageOpacity,
                      transform: [{ translateY: imageTranslate }],
                    },
                  ]}
                  source={{ uri: image }}
                />
              ))}
            </Swiper>
          </LinearGradient>
        </Animated.View>
        <Animated.View
          style={[
            styles.barIcon,
            {
              transform: [
                // { scale: titleScale },
                { translateY: titleTranslate },
              ],
            },
          ]}
        >
          <TouchableOpacity style={{ marginLeft: 9, width: 50 }} onPress={() => { this.props.navigation.goBack() }}>
            <Icon style={{ color: inverseTextColor, fontSize: 34 }} name={'ios-arrow-back'} type={'Ionicons'} />
          </TouchableOpacity>
        </Animated.View>
        <Animated.View
          style={[
            styles.bar,
            {
              transform: [
                { scale: titleScale },
                { translateY: titleTranslate },
              ],
            },
          ]}
        >
          <Text style={styles.title} numberOfLines={1}>{detailBuilding.sub_name}</Text>
        </Animated.View>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor
  },
  blockContainer: {
    ...shadow,
    padding: 15,
    backgroundColor: brandLight,
    marginBottom: 15,
    shadowRadius: 1,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 }
  },
  header: {
    position: 'absolute',
    elevation: 5,
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#03A9F4',
    overflow: 'hidden',
    height: HEADER_MAX_HEIGHT,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: HEADER_MAX_HEIGHT
  },
  bar: {
    backgroundColor: 'transparent',
    marginTop: (platform === 'ios' ? 32 : 18) + STATUSBAR_PADDING,
    height: 32,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  barIcon: {
    zIndex: 1,
    backgroundColor: 'transparent',
    marginTop: (platform === 'ios' ? 32 : 18) + STATUSBAR_PADDING,
    height: 32,
    elevation: 5,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  title: {
    fontSize: platform === 'ios' ? 21 : 25,
    maxWidth: DEVICE_WIDTH - 60,
    fontWeight: platform === 'ios' ? '600' : '500',
    color: '#fff'
  },
  scrollViewContent: {
    // iOS uses content inset, which acts like padding.
    paddingTop: platform !== 'ios' ? HEADER_MAX_HEIGHT : 0,
  },
  row: {
    height: 40,
    margin: 16,
    backgroundColor: '#D3D3D3',
    alignItems: 'center',
    justifyContent: 'center',
  },



  paragraph: {
    backgroundColor: brandLight,
    borderRadius: 3,
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: brandPrimary,
    textAlign: 'center'
  },
  buttonComon: {
    borderWidth: 1,
    borderColor: '#C7DDF6',
    borderRadius: 2,
    padding: 5,
    paddingHorizontal: 10,
    marginVertical: 5,
    marginRight: 5
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
  button: {
    alignItems: 'center', alignContent: 'center', justifyContent: 'center', paddingHorizontal: 5
  },
  headerIcon: {
    flex: 0.2,
    justifyContent: 'center'
  },
  left: {
    paddingLeft: 20,
  },
  right: {
    paddingRight: 20,
    alignItems: 'flex-end',
  },
  buttonBgText: {
    color: '#FFF',
    textAlign: 'center'
  },
  buttonBg: {
    backgroundColor: brandPrimary,
    borderRadius: 2,
    padding: 5,
    paddingHorizontal: 10,
    marginVertical: 5,
    marginLeft: 5
  },
})

const mapStateToProps = state => {
  return {
    buildingsId: state.buildings.buildingDetail,
    buildingDetail: state.buildings.buildingDetail
  }
};

const mapDispatchToProps = dispatch => {
  return {
    _onfetchBuildingDetail: (buildingsId) => dispatch(actions.fetchBuildingDetail(buildingsId)),
    _onfetchOfficeList: (buildingsId) => dispatch(actions.fetchOfficeList(buildingsId)),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(BuildingDetails);


