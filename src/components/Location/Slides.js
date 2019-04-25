import React, { Component } from 'react';
import { View, TouchableOpacity, Text, ScrollView } from 'react-native';
import FastImage from 'react-native-fast-image';
import * as Animatable from 'react-native-animatable';

import { brandDark, platform } from '../../config/variables';

class Slides extends Component {
  shouldComponentUpdate(nextProps) {
    if (this.props.isChangeBrand !== nextProps.isChangeBrand
      || (this.props.isChangeBrand === nextProps.isChangeBrand && this.props.isChangeBrand === false)) {
      if (platform === 'android') {
        this.slideMapScroll.scrollTo({ x: 0, y: 0 });
      }
      return true;
    } else {
      return false;
    }
  }
  renderSlides = () => this.props.business.contain.map((slide, idx) => (
    <Animatable.View
      animation={platform === 'ios' ? "fadeInRight" : null}
      key={slide.bid}
      style={[styles.slideStyle, { marginLeft: (idx === 0 ? 10 : 0) }]}
    >
      <TouchableOpacity
        style={{ overflow: 'hidden' }}
        onPress={() => this.props.selectShop(slide)}
      >
        <FastImage
          style={styles.image}
          resizeMode={FastImage.resizeMode.cover}
          source={{ uri: slide.bimg_url }}
        >
          <View style={styles.container}>
            <View style={styles.titleContainer}>
              <View style={{ paddingLeft: 10 }}>
                <Text style={styles.textStyle} numberOfLines={2}>{slide.badd}</Text>
              </View>
            </View>
          </View>
        </FastImage>
      </TouchableOpacity>
    </Animatable.View>
  ));

  render() {
    return (
      <ScrollView
        horizontal
        style={{ flex: 1 }}
        showsHorizontalScrollIndicator={false}
        ref={ref => { this.slideMapScroll = ref }}
      >
        {this.renderSlides()}
      </ScrollView>
    );
  }
}

const styles = {
  slideStyle: {
    flex: 1,
    width: 165,
    backgroundColor: brandDark,
    marginRight: 10,
    borderRadius: 7,
    overflow: 'hidden',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end'
  },
  titleContainer: {
    paddingVertical: 5,
    backgroundColor: 'rgba(33, 43, 52, 0.85)',
    minHeight: 50,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  textStyle: {
    paddingRight: 20,
    marginRight: 20,
    color: 'white'
  },
  image: {
    width: '100%',
    height: 130
  },
  logoStyle: {
    marginLeft: 5,
    width: 30,
    height: 30,
    resizeMode: 'contain'
  }
};

export default Slides;
