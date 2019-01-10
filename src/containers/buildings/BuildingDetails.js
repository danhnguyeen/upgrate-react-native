import React from 'react'
import { connect } from 'react-redux';
import { View, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Linking } from 'react-native'
import { Container, Content, DeckSwiper, CardItem, Text, Icon } from 'native-base';

import * as actions from './building-actions';
import { brandPrimary, shadow, brandLight } from '../../config/variables';
import { PostDetail } from '../../components/buildings'

class BuildingDetails extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      detailBuilding: null,
      isFetching: true
    }
    this._isMounted = false
  }

  componentWillUnmount() {
    this._isMounted = false;
  }
  componentDidMount() {
    this._isMounted = true
    if (this._isMounted == true) {
      this._onFetching()
    }
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
        <Content >
          <View style={{ height: 300, position: 'relative', }}>
            {renderHeaderImage}
            <View style={[styles.headerIcon, styles.left]}>
              <TouchableOpacity onPress={() => { this.props.navigation.goBack() }}>
                <Icon style={[styles.icon, { color: brandPrimary }]} name={'ios-arrow-back'} type={'Ionicons'} />
              </TouchableOpacity>
            </View>
          </View>
          {isFetching ?
            <ActivityIndicator /> :
            <View>
              <View style={[styles.paragraph, shadow]}>
                <View style={{ alignItems: 'center', marginBottom: 5 }}>
                  <Text style={{ color: '#0D3D74', fontSize: 24, lineHeight: 40, fontWeight: '700', }} adjustsFontSizeToFit numberOfLines={1}>{detailBuilding.sub_name}</Text>
                  <Text style={{ color: '#9F9F9F', fontSize: 16, fontStyle: 'italic' }}>{detailBuilding.address}, {detailBuilding.district}</Text>
                </View>
                <View style={styles.line}>
                  <Icon style={styles.icon} name='building' type='FontAwesome' /><Text style={styles.text}>{detailBuilding.structure ? detailBuilding.structure : 'Chưa cập nhật'}</Text>
                </View>
                <View style={styles.line}>
                  <Icon style={styles.icon} name='ios-expand' type='Ionicons' />
                  {detailBuilding.acreage_rent_array && detailBuilding.acreage_rent_array.length > 0 ?
                    detailBuilding.acreage_rent_array.map((item, index) =>
                      <Text key={index} style={styles.text} >
                        {index > 0 && ' - '}{item}
                        {index == (detailBuilding.acreage_rent_array.length - 1) && 'm2'}
                      </Text>
                    )
                    :
                    <Text style={styles.text} >{detailBuilding.acreage_rent_list == 'FULL' ? 'Toàn bộ' : 'Chưa cập nhật'}</Text>
                  }
                </View>
                <View style={styles.line}>
                  <Icon style={styles.icon} name='ios-eye' type='Ionicons' />
                  <Text style={styles.text}>{detailBuilding.direction}</Text>
                </View>
                <View style={styles.line}>
                  <Icon style={styles.icon} name='elevator' type='Foundation' />
                  <Text style={styles.text}>{detailBuilding.classify_name}</Text>
                </View>
                <View style={styles.line}>
                  <Icon style={styles.icon} name='shield' type='Feather' />
                  <Text style={styles.text}>Đơn vị quản lý: {detailBuilding.management_agence_name}</Text>
                </View>
                <View style={styles.line}>
                  <Icon style={styles.icon} name='battery-charging' type='Feather' />
                  <Text style={styles.text}>{detailBuilding.electricity_cost}K/ giờ</Text>
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
        </Content>
      </Container>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: brandLight
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
  icon: {
    color: "#fff",
    fontSize: 30
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


