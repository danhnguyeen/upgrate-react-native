import React from 'react';
import { connect } from 'react-redux';
import { View, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Linking, Animated, RefreshControl, Text } from 'react-native';
import { Container, DeckSwiper, CardItem, Icon } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { Header } from 'react-navigation';
import { Divider, Button } from 'react-native-elements';

import * as actions from './building-actions';
import { brandPrimary, shadow, brandLight, platform, backgroundColor, textColor, fontSize, inverseTextColor, DEVICE_WIDTH, textLightColor, textH4 } from '../../config/variables';
import { PostDetail, BuildingMaps } from '../../components/buildings'

const HEADER_MAX_HEIGHT = 300;
const HEADER_MIN_HEIGHT = Header.HEIGHT;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;


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

  componentDidMount() {
    this._onFetching();
  }
  
  _onFetching = async () => {
    const building_id = this.props.navigation.getParam('building_id', null)
    if (!building_id) { }
    else {
      if (this.props.buildingsId !== building_id) {
        await this.props._onfetchBuildingDetail(building_id)
      }
      this.setState({ isFetching: false }, () => {
        this.props._onfetchOfficeList(building_id)
      })
    }
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
    let renderHeaderImage = <ActivityIndicator />
    if (!isFetching && detailBuilding) {
      const { sub_images, main_image_thumbnail } = detailBuilding
      // sub_images.push(main_image_thumbnail)
      renderHeaderImage = (
        <DeckSwiper
          dataSource={detailBuilding.sub_images}
          renderItem={item =>
            <CardItem cardBody bordered={false}>
              <Image style={{ height: 300, flex: 1, }} source={{ uri: item }} />
            </CardItem>
          }
        />
      )
    }
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
          {isFetching ?
            <ActivityIndicator /> :
            <View style={styles.scrollViewContent}>
              <View style={{ padding: 15, backgroundColor: brandLight, marginBottom: 15 }}>
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
                    title='Chỉ đường đến đây'
                  />
                </View>
              </View>
              <View style={{ flex: 1, backgroundColor: brandLight, padding: 15 }}>
                <View style={{ alignItems: 'center', marginBottom: 5 }}>
                  <Text style={[textH4, { color: brandPrimary }]} numberOfLines={1}>{detailBuilding.sub_name}</Text>
                  <Text style={{ color: '#9F9F9F', fontSize: 16, fontStyle: 'italic' }}>{detailBuilding.address}, {detailBuilding.district}</Text>
                </View>
                <View style={styles.line}>
                  <Icon style={styles.icon} name='building' type='FontAwesome' /><Text>{detailBuilding.structure ? detailBuilding.structure : 'Chưa cập nhật'}</Text>
                </View>
                <View style={styles.line}>
                  <Icon style={styles.icon} name='ios-expand' type='Ionicons' />
                  {detailBuilding.acreage_rent_array && detailBuilding.acreage_rent_array.length > 0 ?
                    detailBuilding.acreage_rent_array.map((item, index) =>
                      <Text key={index}>
                        {index > 0 && ' - '}{item}
                        {index == (detailBuilding.acreage_rent_array.length - 1) && 'm2'}
                      </Text>
                    )
                    :
                    <Text >{detailBuilding.acreage_rent_list == 'FULL' ? 'Toàn bộ' : 'Chưa cập nhật'}</Text>
                  }
                </View>
                <View style={styles.line}>
                  <Icon style={styles.icon} name='ios-eye' type='Ionicons' />
                  <Text>{detailBuilding.direction}</Text>
                </View>
                <View style={styles.line}>
                  <Icon style={styles.icon} name='elevator' type='Foundation' />
                  <Text>{detailBuilding.classify_name}</Text>
                </View>
                <View style={styles.line}>
                  <Icon style={styles.icon} name='shield' type='Feather' />
                  <Text>Đơn vị quản lý: {detailBuilding.management_agence_name}</Text>
                </View>
                <View style={styles.line}>
                  <Icon style={styles.icon} name='battery-charging' type='Feather' />
                  <Text>{detailBuilding.electricity_cost}K/ giờ</Text>
                </View>
              </View>
              <View style={[styles.paragraph, shadow, { flexDirection: 'row', justifyContent: 'center', paddingHorizontal: 5 }]}>
                <TouchableOpacity style={[styles.buttonComon, styles.button, { flex: 0.5, borderColor: '#e12d2d' }]}>
                  <Text style={[styles.buttonText, { color: '#e12d2d' }]}>Giá Thuê</Text>
                  <Text style={[styles.buttonText, { fontSize: 18, fontWeight: '700', color: '#e12d2d' }]}>{detailBuilding.rent_cost.toFixed(1)}$/m2</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.buttonBg, styles.button, { flex: 0.5, }]}
                  onPress={() => { this.props.navigation.navigate('Offices', { building_id: detailBuilding.building_id, building_name: detailBuilding.sub_name, building_detail: detailBuilding }) }}>
                  <Text style={[styles.buttonBgText]}>Xem văn phòng</Text>
                  <Icon style={[styles.buttonBgText]} name='md-arrow-forward' type='Ionicons' />
                </TouchableOpacity>
              </View>
              <View style={{ paddingHorizontal: 20 }}>
                <PostDetail description={detailBuilding.description} content={detailBuilding.content} />
              </View>
              <View style={[styles.paragraph, shadow, { padding: 10 }]}>
                <Text style={styles.buttonText}>Chuyên viên tư vấn</Text>
                <View style={styles.line}>
                  <Icon style={{ color: '#666666', lineHeight: 30, fontSize: 20, marginRight: 10 }} name='user-female' type='SimpleLineIcons' />
                  <Text style={{ color: '#666666', lineHeight: 30 }}>Ms. Phương Linh</Text>
                </View>
                <TouchableOpacity style={styles.line}
                  onPress={() => Linking.openURL(`tel:+84911072299`)}>
                  <Icon style={{ color: '#666666', lineHeight: 30, fontSize: 20, marginRight: 10 }} name='phone' type='SimpleLineIcons' />
                  <Text style={[styles.buttonText, { lineHeight: 30 }]}>0911 07 22 99</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.line}
                  onPress={() => Linking.openURL(`mailto:paxsky.vn?subject=Đăng ký tư vấn tòa nhà ${detailBuilding.sub_name}`)}>
                  <Icon style={{ color: '#666666', lineHeight: 30, fontSize: 20, marginRight: 10 }} name='envelope' type='SimpleLineIcons' />
                  <Text style={[styles.buttonText, { lineHeight: 30 }]}>pkd@paxsky.vn</Text>
                </TouchableOpacity>
              </View>
            </View>
          }
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
            {!isFetching && detailBuilding &&
              <Animated.Image
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
            }
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
            <Icon style={[styles.icon, { color: '#fff' }]} name={'ios-arrow-back'} type={'Ionicons'} />
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
          <Text style={styles.title}>{detailBuilding.sub_name}</Text>
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
    height: HEADER_MAX_HEIGHT,
    resizeMode: 'cover',
  },
  bar: {
    backgroundColor: 'transparent',
    marginTop: platform === 'ios' ? 32 : 18,
    height: 32,
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
    marginTop: platform === 'ios' ? 32 : 18,
    height: 32,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  title: {
    fontSize: platform === 'ios' ? 20 : 24,
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
    flexDirection: 'row',
    paddingVertical: 5,
    alignItems: 'center',
    marginRight: 10
  },
  icon: {
    color: textLightColor,
    fontSize: 22,
    marginRight: 15
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


