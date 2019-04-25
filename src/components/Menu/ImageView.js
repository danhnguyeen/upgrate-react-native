/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { Overlay } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import PhotoView from 'react-native-photo-view';

import { Spinner } from '../common';
import { DEVICE_WIDTH, textColor, platform } from "../../config/variables";

class ImageView extends Component {
  state = {
    loading: true
  }
  render() {
    return (
      <Overlay isVisible={this.props.visible}
        containerStyle={{ zIndex: 1 }}
        overlayStyle={{ padding: 4 }}
        borderRadius={0}
        width={DEVICE_WIDTH - 60}
        height={DEVICE_WIDTH - 60}
        windowBackgroundColor='transparent'
        // onBackdropPress={this.props.photoViewHandler}
      >
        <TouchableOpacity
          onPress={this.props.photoViewHandler}
          style={{ padding: 10, paddingTop: 0, position: 'absolute', right: 5, top: 3, zIndex: 2 }}>
          <Icon name={"ios-close"}
            size={38}
            color={textColor}
            underlayColor='transparent'
          />
        </TouchableOpacity>
        <PhotoView
          source={{ uri: this.props.photo }}
          minimumZoomScale={1.0}
          maximumZoomScale={3}
          style={{ width: '100%', height: '100%' }}
          onLoadEnd={() => this.setState({ loading: false })}
          loadingIndicatorSource={<Spinner />}
          // onViewTap={this.props.photoViewHandler}
        >
          {this.state.loading && platform === 'ios' ?
            <Spinner />
            : null
          }
        </PhotoView>
      </Overlay>
    );
  }
};

export default ImageView;
