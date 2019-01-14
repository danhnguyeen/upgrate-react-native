import React, { Component } from 'react';
import { Text, StyleSheet } from 'react-native';

import { ReadMore } from '../common';
import { brandLight, brandPrimary } from '../../config/variables';
import i18n from '../../i18n';

class BuildingDescription extends Component {
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
  render() {
    return (
      <ReadMore
        numberOfLines={3}
        renderTruncatedFooter={this._renderTruncatedFooter}
        renderRevealedFooter={this._renderRevealedFooter}
        onReady={this._handleTextReady}>
        <Text>{this.props.text}</Text>
      </ReadMore>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: brandLight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    marginVertical: 10
  }
});

export default BuildingDescription;
