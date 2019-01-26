import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text } from 'react-native'
import FastImage from 'react-native-fast-image'
import StarRating from 'react-native-star-rating';
import Swiper from 'react-native-swiper';

import { fontSize, DEVICE_WIDTH, brandPrimary, brandWarning, textLightColor, textColor, inverseTextColor } from '../../config/variables';
import i18n from '../../i18n';

class TagBuilding extends React.Component {
  render() {
    const building = this.props.building;
    const buildingDetail = building.building_detail;
    building.acreage_rent_array.sort((a, b) => { return a - b })
    building.sub_name = building.sub_name.replace("PAX SKY", "").replace("PAXSKY", "").trim()

    building.rent_acreage = building.acreage_rent_array.length > 1 ?
      `${building.acreage_rent_array[0]}m2 - ${building.acreage_rent_array[building.acreage_rent_array.length - 1]}m2` :
      building.acreage_rent_array.length == 1 ? `${building.acreage_rent_array[0]}m2` : i18n.t('buildingDetail.updating');
    const images = [building.main_image, ...buildingDetail.sub_images];
    let rate = 0;
    switch (buildingDetail.classify_name) {
      case "Văn phòng hạng A": rate = 5; break;
      case "Văn phòng hạng B": rate = 4; break
      case "Văn phòng hạng C": rate = 3; break
    }
    return (
      <View style={styles.container} >
        <View style={styles.imageContainer}>
          <Swiper
            showsButtons={false}
            showsPagination={true}
            index={0}
            loop={false}
            autoplay={false}
            dotColor={textLightColor}
            activeDotColor={inverseTextColor}
          >
            {images.map((image) => (
              <View style={styles.slide} key={image}>
                <FastImage
                  source={{ uri: image }}
                  style={styles.image}
                />
              </View>
            ))}
          </Swiper>
          {/* <FastImage source={{ uri: building.main_image, priority: FastImage.priority.high }} style={{ width: '100%', height: '100%' }} /> */}
        </View>
        <TouchableOpacity
          onPress={() => this.props.selectBuilding(building)}>
          <View>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5, color: brandPrimary }} numberOfLines={2} >PAXSKY {building.sub_name}</Text>
            <Text numberOfLines={1} style={{ fontSize: fontSize - 2, marginBottom: 5 }}>{buildingDetail.address}, {buildingDetail.district}</Text>
            <View style={{ alignItems: 'center', flexDirection: 'row', marginBottom: 5 }}>
              <Text style={{ marginRight: 5 }}>{buildingDetail.classify_name}</Text>
              <StarRating
                disabled
                emptyStar={'ios-star-outline'}
                fullStar={'ios-star'}
                halfStar={'ios-star-half'}
                iconSet={'Ionicons'}
                maxStars={5}
                starSize={fontSize}
                starStyle={{ paddingHorizontal: 1 }}
                rating={rate}
                fullStarColor={brandWarning}
              />
            </View>
            <Text style={{ marginBottom: 5, fontWeight: 'bold' }}>{`$${building.rent_cost.toFixed(1)}`}/m2 </Text>
            <Text>{building.rent_acreage}</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 35
  },
  imageContainer: {
    width: DEVICE_WIDTH - 40,
    height: (DEVICE_WIDTH - 40) * 0.65,
    // padding: 10,
    borderRadius: 3,
    marginBottom: 10,
    overflow: 'hidden'
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: '100%',
    height: '100%'
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
  rent_acreage: { color: '#DEBB3D', lineHeight: 21, fontSize: 14, flex: 0.6 },
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