import React, { Component } from 'react';
import {
  View,
  StyleSheet
} from 'react-native';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';

import { textColor, DEVICE_WIDTH, inverseTextColor } from '../../config/variables';

class BuildingSlider extends Component {
  shouldComponentUpdate(nextProps) {
    if (!this.props.buildingDetail
      || (nextProps.buildingDetail && nextProps.buildingDetail.building_id !== this.props.buildingDetail.building_id)) {
      return true;
    }
    return false;
  }
  render() {
    const images = this.props.buildingDetail.sub_images;
    console.log(images)
    return (
      <View style={[styles.wrapper, { height: this.props.height ? this.props.height : 180 }]}>
        <Swiper
          key={this.props.buildingDetail.building_id}
          showsButtons={false}
          showsPagination={this.props.showsPagination}
          autoplay={this.props.autoplay}
          autoplayTimeout={4}
          dot={
            <View style={{
              backgroundColor: '#cccccc',
              width: 6,
              height: 6,
              borderRadius: 3,
              margin: 3
            }} />
          }
          activeDotColor={inverseTextColor}
          prevButton={<Icon name={"ios-arrow-back"} size={26} color={textColor} />}
          nextButton={<Icon name={"ios-arrow-forward"} size={26} color={textColor} />}
        >
          {images && images.map((image) => (
            <View style={styles.slide} key={image}>
              <FastImage
                source={{ uri: image }}
                style={styles.image}
              />
            </View>
          ))}
        </Swiper>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    width: DEVICE_WIDTH
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: DEVICE_WIDTH,
    height: '100%'
  }
})

export default BuildingSlider;
