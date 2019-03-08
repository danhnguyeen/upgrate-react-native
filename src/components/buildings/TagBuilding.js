import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Divider } from 'react-native-elements';

import { fontSize, DEVICE_WIDTH, inverseTextColor, shadow, brandLight } from '../../config/variables';

class TagBuilding extends React.Component {
  render() {
    const building = this.props.building;
    const buildingDetail = building.building_detail;
    const maxAcreage = Math.max(...building.acreage_rent_array);
    building.rent_acreage = maxAcreage !== -Infinity ? `${Math.min(...building.acreage_rent_array)} - ${maxAcreage} m2` : '';
    return (
      <View style={[styles.container, {
        marginLeft: this.props.index % 2 ? 5 : 10,
        marginRight: this.props.index % 2 ? 10 : 5
      }]}
        >
        <TouchableOpacity onPress={() => this.props.selectBuilding(building)} style={styles.imageContainer}>
          <FastImage source={{ uri: building.main_image, priority: FastImage.priority.high }} style={styles.image} />
          <View style={styles.infoContainer}>
            <View style={{ justifyContent: 'space-between', alignItems: 'center', flex: 1, paddingHorizontal: 10 }}>
              <Text style={{ color: inverseTextColor, fontSize: fontSize - 3 }}>{buildingDetail.district}</Text>
              <Text style={{ color: inverseTextColor, textAlign: 'center', fontWeight: '500' }} numberOfLines={2}>{buildingDetail.address}</Text>
            </View>
            <Divider style={{ backgroundColor: inverseTextColor, marginVertical: 5, width: '100%' }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10 }}>
              <Text style={{ color: inverseTextColor, fontSize: fontSize - 3, color: '#DEBB3D' }}>{building.rent_acreage}</Text>
              <Text style={{ color: inverseTextColor, fontSize: fontSize - 3, color: '#DEBB3D' }}>${building.rent_cost.toFixed(1)}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    backgroundColor: brandLight,
    width: (DEVICE_WIDTH / 2) - 15,
    borderRadius: 3,
    ...shadow,
    elevation: 5,
    shadowOpacity: 0.3
  },
  imageContainer: {
    width: (DEVICE_WIDTH / 2) - 15,
    height: ((DEVICE_WIDTH / 2) - 15) * 1.1,
    borderRadius: 3,
    // elevation: 4,
    overflow: 'hidden'
  },
  infoContainer: {
    position: 'absolute',
    paddingVertical: 5,
    bottom: 0,
    width: (DEVICE_WIDTH / 2) - 15,
    height: 90,
    backgroundColor: 'rgba(13, 78, 128, 0.8)'
  },
  image: {
    width: '100%',
    height: '100%'
  }
});

export default TagBuilding;