import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';

import i18n, { getCurrentLocale } from '../../i18n';
import { brandPrimary, shadow, fontSize } from '../../config/variables';
import { getBuildingStructure } from '../../util/utility';

class BuildingSlides extends Component {
  renderSlides = () => this.props.buildings.map((slide, idx) => {
    const locale = getCurrentLocale();
    const structure = getBuildingStructure(slide.building_detail, locale);
    return (
      <View
        key={slide.building_id}
        style={[styles.container, { marginLeft: (idx === 0 ? 10 : 0) }]}
      >
        <TouchableOpacity style={styles.slideStyle} onPress={() => this.props.selectedBuilding(slide)} >
          <FastImage
            style={styles.image}
            source={{ uri: slide.main_image }}
          />
          <View style={styles.infoContainer}>
            <View>
              <Text style={styles.titleStyle}>PAX SKY</Text>
              <Text style={styles.subTitleStyle} numberOfLines={2}>{`${slide.sub_name}, ${slide.district}`}</Text>
            </View>
            <View>
              <Text style={{ width: 170 }} numberOfLines={2}>{structure ? structure : `${i18n.t('buildingDetail.structure')} : -- `}</Text>
              <Text style={styles.priceStyle}>{`$${slide.rent_cost.toFixed(2)}/m2`}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  });

  render() {
    return (
      <ScrollView
        horizontal
        style={{ flex: 1 }}
        showsHorizontalScrollIndicator={false}
      >
        {this.renderSlides()}
      </ScrollView>
    );
  }
}

const styles = {
  container: {
    ...shadow,
    flex: 1,
    width: 280,
    backgroundColor: '#fff',
    marginRight: 10,
    marginVertical: 10,
    borderRadius: 5
  },
  slideStyle: {
    overflow: 'hidden',
    flexDirection: 'row',
    borderRadius: 5
  },
  infoContainer: {
    padding: 10,
    justifyContent: 'space-between'
  },
  titleStyle: {
    color: brandPrimary,
    fontWeight: 'bold',
    fontSize: fontSize + 2,
    marginBottom: 5
  },
  subTitleStyle: {
    fontSize: fontSize - 2,
    width: 170,
    color: '#616161'
  },
  priceStyle: {
    // fontWeight: 'bold',
    marginTop: 3,
    color: brandPrimary
    // fontSize: 15
  },
  image: {
    width: 90,
    height: 150
  }
};

export default BuildingSlides;
