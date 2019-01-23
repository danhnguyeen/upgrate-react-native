import React from 'react';
import { connect } from 'react-redux';
import { View, Image, StyleSheet, TouchableOpacity, Text, Linking, Animated, RefreshControl } from 'react-native';
import { Container, Icon } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { Header } from 'react-navigation';
import { Divider, Button } from 'react-native-elements';
import FastImage from 'react-native-fast-image';

import i18n from '../../i18n';
import * as actions from './building-actions';
import { brandPrimary, isIphoneX, brandLight, platform, backgroundColor, textColor, fontSize, inverseTextColor, DEVICE_WIDTH, textLightColor, textH4, shadow } from '../../config/variables';
import { PostDetail, BuildingMaps, BuildingDescription } from '../../components/buildings'

const STATUSBAR_PADDING = isIphoneX ? 24 : 0
const HEADER_MAX_HEIGHT = 300;
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


    const detailBuilding = this.props.buildingDetail
    const { isFetching } = this.state
    return (
      <Container style={styles.container} >
        <Animated.ScrollView
          style={{ flex: 1 }}
          scrollEventThrottle={1}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
            { useNativeDriver: true },
          )}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => {
                this.setState({ refreshing: true });
                setTimeout(() => this.setState({ refreshing: false }), 1000);
              }}
              // Android offset for RefreshControl
              progressViewOffset={HEADER_MAX_HEIGHT}
            />
          }
          // iOS offset for RefreshControl
          contentInset={{
            top: HEADER_MAX_HEIGHT,
          }}
          contentOffset={{
            y: -HEADER_MAX_HEIGHT,
          }}
        >
          <View style={styles.scrollViewContent}>
            <View style={{ ...shadow, padding: 15, backgroundColor: brandLight, marginBottom: 15 }}>
              <BuildingMaps style={{ margin: 15 }} building={detailBuilding} />
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
                <Icon
                  name='location-on'
                  type='MaterialIcons'
                  style={{ fontSize: fontSize + 2, color: textColor }}
                />
                <Text style={{ paddingLeft: 5, width: DEVICE_WIDTH - 50 }} numberOfLines={1}>{`${detailBuilding.address}, ${detailBuilding.district}`}</Text>
              </View>
              <Divider style={{ marginVertical: 15 }} />
              <View style={{ alignItems: 'flex-end' }}>
                <Button
                  icon={
                    <Icon
                      name='directions'
                      type="MaterialCommunityIcons"
                      style={{ color: brandPrimary, fontSize: fontSize + 6, marginLeft: 10 }}
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
            <View style={{ ...shadow, flex: 1, backgroundColor: brandLight, padding: 15, marginBottom: 15 }}>
              <View style={{ alignItems: 'center', marginBottom: 5 }}>
                <Text style={[textH4, { color: brandPrimary }]} numberOfLines={1}>{detailBuilding.sub_name}</Text>
                <Text style={{ fontStyle: 'italic' }}>{detailBuilding.address}, {detailBuilding.district}</Text>
              </View>
              <View style={styles.line}>
                <Icon style={styles.icon} name='building-o' type='FontAwesome' />
                <Text>{detailBuilding.structure ? detailBuilding.structure : `${i18n.t('buildingDetail.structure')} : -- `}</Text>
              </View>
              <View style={styles.line}>
                <Icon style={styles.icon} name='address-book-o' type='FontAwesome' />

                {detailBuilding.acreage_rent_array && detailBuilding.acreage_rent_array.length > 0 ?
                  <Text style={{ width: DEVICE_WIDTH - 50 }}>
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
                <Text>{detailBuilding.direction}</Text>
              </View>
              <View style={styles.line}>
                <Icon style={[styles.icon, { fontSize: 28 }]} name='md-star-outline' type='Ionicons' />
                <Text>{detailBuilding.classify_name}</Text>
              </View>
              <View style={styles.line}>
                <Icon style={styles.icon} name='settings' type='SimpleLineIcons' />
                <Text>{i18n.t('buildingDetail.management')}: {detailBuilding.management_agence_name}</Text>
              </View>
              <View style={styles.line}>
                <Icon style={styles.icon} name='car-battery' type='MaterialCommunityIcons' />
                <Text>{detailBuilding.electricity_cost}{i18n.t('buildingDetail.electricityHour')}</Text>
              </View>
              <Divider style={{ marginVertical: 15 }} />
              <BuildingDescription text={detailBuilding.description} />
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
            </View>
            <View style={[shadow, { padding: 15, backgroundColor: brandLight, marginBottom: 15 }]}>
              <Text style={styles.buttonText}>{i18n.t('contact.paxsky')}</Text>
              <View style={styles.line}>
                <Icon style={styles.icon} name='ios-person' type='Ionicons' />
                <Text style={[styles.buttonText, { lineHeight: 30 }]}>Ms. Phương Linh</Text>
              </View>
              <TouchableOpacity style={styles.line}
                onPress={() => Linking.openURL(`tel:+84911072299`)}>
                <Icon style={styles.icon} name='ios-call' type='Ionicons' />
                <Text style={[styles.buttonText, { lineHeight: 30 }]}>0911 07 22 99</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.line}
                onPress={() => Linking.openURL(`https://zalo.me/1732464775151258581`)}>
                <Icon style={styles.icon} name='message-text' type='MaterialCommunityIcons' />
                <Text style={[styles.buttonText, { lineHeight: 30 }]}>{i18n.t('contact.zalo')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.line}
                onPress={() => Linking.openURL(`https://m.me/paxskydotvn`)}>
                <Icon style={styles.icon} name='facebook-messenger' type='MaterialCommunityIcons' />
                <Text style={[styles.buttonText, { lineHeight: 30 }]}>{i18n.t('contact.messenger')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.line}
                onPress={() => Linking.openURL(`mailto:paxsky.vn?subject=Đăng ký tư vấn tòa nhà ${detailBuilding.sub_name}`)}>
                <Icon style={styles.icon} name='ios-mail' type='Ionicons' />
                <Text style={[styles.buttonText, { lineHeight: 30 }]}>pkd@paxsky.vn</Text>
              </TouchableOpacity>
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
            colors={[brandPrimary, '#0d59ca']}
            style={{ flex: 1 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <AnimatedFastImage
              style={[
                styles.backgroundImage,
                {
                  flex: 1,
                  width: '100%',
                  opacity: imageOpacity,
                  transform: [{ translateY: imageTranslate }],
                },
              ]}
              source={{ uri: detailBuilding.sub_images[0] }}
            />
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
    margin: 5
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
    margin: 5,
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


