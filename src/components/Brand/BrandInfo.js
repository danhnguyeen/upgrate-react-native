import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';

import { ReadMore } from '../common';
import { brandLight, textColor, brandPrimary } from '../../config/variables';
import i18n from '../../i18n';

class BrandInfo extends Component {
  _renderTruncatedFooter = (handlePress) => {
    return (
      <Text style={{ color: brandPrimary, paddingVertical: 5, paddingRight: 10 }} onPress={handlePress}>{i18n.t('global.readMore')}</Text>
    );
  }

  _renderRevealedFooter = (handlePress) => {
    return (
      <Text style={{ color: brandPrimary, paddingVertical: 5, paddingRight: 10 }} onPress={handlePress}>{i18n.t('global.showLess')}</Text>
    );
  }
  render () {
    return (
      <View style={ styles.container }>
        <FastImage 
          style={{ width: 100, height: 100, marginHorizontal: 10 }} 
          resizeMode={FastImage.resizeMode.contain} 
          source={{ uri: this.props.picture, priority: FastImage.priority.high }} />
        <View style={{ flex: 1, paddingRight: 10 }}>
          <ReadMore
            numberOfLines={5}
            renderTruncatedFooter={this._renderTruncatedFooter}
            renderRevealedFooter={this._renderRevealedFooter}
            onReady={this._handleTextReady}>
            <Text style={{ color: textColor }}>{ this.props.shop.BrandDescription }</Text>
          </ReadMore>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: brandLight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 10
  }
});

export default BrandInfo;
