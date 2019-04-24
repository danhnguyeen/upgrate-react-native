import React, { Component } from 'react';
import {
  View,
  StyleSheet
} from 'react-native';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';

import { textColor, DEVICE_WIDTH, textDarkColor } from '../../../config/variables';

class Slider extends Component {
  shouldComponentUpdate(nextProps) {
    if(!this.props.selectedShop 
      || (nextProps.selectedShop && nextProps.selectedShop.bid !== this.props.selectedShop.bid)) {
      return true;
    }
    return false;
  }
  render() {
    const imageList = (this.props.selectedShop.bimg_more ? this.props.selectedShop.bimg_more.split(';') : []);
    return (
      <View style={[styles.wrapper, { height: this.props.height ? this.props.height : 180 }]}>
        <Swiper
          key={this.props.selectedShop.bid}
          showsButtons={true}
          showsPagination={this.props.showsPagination}
          autoplay={this.props.autoplay}
          dotColor={textDarkColor}
          activeDotColor={textColor}
          autoplayTimeout={4}
          prevButton={<Icon name={"ios-arrow-back"} size={26} color={textColor} />}
          nextButton={<Icon name={"ios-arrow-forward"} size={26} color={textColor} />}
        >
          {imageList.map((image, idx) => (
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
    width: DEVICE_WIDTH,
    height: 180
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

export default Slider;
