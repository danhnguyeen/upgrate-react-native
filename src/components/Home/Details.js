import React from 'react';
import { WebView, View } from 'react-native';

import { Spinner, Modal } from '../common';
import { brandDark } from '../../config/variables';

const modalDetails = (props) => {
  return (
    <Modal
      visible={props.show}
      onRequestClose={props.onClose}
      rightComponent={{
        icon: 'share',
        color: '#fff',
        onPress: props.onShare,
        underlayColor: 'transparent'
      }}
    >
      <View style={{ flex: 1, backgroundColor: brandDark }}>
        {props.item.UrlContent ?
          <WebView
            source={{ uri: props.item.UrlContent }}
            renderLoading={() => { return (<Spinner />) }}
            startInLoadingState
            style={{ flex: 1 }}
          /> : null
        }
      </View>
    </Modal>
  );
};

export default modalDetails;
