import React, { Component } from 'react';
import { WebView, View , Share} from 'react-native';

import { Spinner, Modal } from '../common';
import { brandDark, textColor } from '../../config/variables';

class SiteModal extends Component {

  onShare = () => {
    if (this.props.item.UrlContent) {
      Share.share({
        message: this.props.item.UrlContent,
        url: this.props.item.UrlContent,
        title: this.props.title
      }, {
          dialogTitle: 'Share for your friend',
          excludedActivityTypes: ['com.apple.UIKit.activity.PostToTwitter']
        });
    }
  }

  render() {
    return (
      <Modal
        visible={this.props.show}
        title={this.props.title}
        onRequestClose={this.props.onClose}
        rightComponent={{
          icon: 'share',
          color: textColor,
          onPress: this.onShare,
          underlayColor: 'transparent'
        }}
      >
        <View style={{ flex: 1, backgroundColor: brandDark }}>
          {this.props.item.UrlContent ?
            <WebView
              source={{ uri: this.props.item.UrlContent }}
              renderLoading={() => { return (<Spinner />) }}
              startInLoadingState
              style={{ flex: 1 }}
            /> : null
          }
        </View>
      </Modal>
    );
  };
}

export default SiteModal;
