import React, { Component } from 'react';
import {
  StyleSheet,
  Alert,
  View,
  Animated,
  Easing,
  ActivityIndicator,
  Text
} from 'react-native';
import { connect } from 'react-redux';
import QRCodeScanner from 'react-native-qrcode-scanner';

import { DEVICE_HEIGTH, DEVICE_WIDTH, isIphoneX, brandDark, brandPrimary, textDarkColor } from "../../config/variables";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as actions from '../Login/auth-actions';
import i18n from '../../i18n';
import { OutlineButton } from '../../components/common';

const offsetLeftRight = 60;
const heightHeader = isIphoneX ? 76 : 56;
const heightFooter = isIphoneX ? 100 : 80;
const offsetTopBottom = (DEVICE_HEIGTH - (DEVICE_WIDTH - offsetLeftRight * 2) - heightHeader - heightFooter) / 2;
const offsetTopBottomBorder = offsetTopBottom + 10;
const offsetLeftRightBorder = offsetLeftRight + 10;

class QRCode extends Component {
  state = {
    isRender: true,
    isReivew: false,
    isShowFocusCamera: false,
    submitting: false
  };
  constructor(props) {
    super(props);
    this.focusCameraScaleValue = new Animated.Value(0);
  }
  componentDidMount() {
    this.props.navigation.addListener('didFocus', () => {
      this.setState({ isRender: true });
      this.props.navigation.setParams({ updatedTime: new Date() });
      this.setState({ isShowFocusCamera: true });;
      // reset the animated values
      this.focusCameraScaleValue.setValue(0);
      // start the sequence
      Animated.timing(this.focusCameraScaleValue, {
        toValue: 1,
        duration: 1300,
        easing: Easing.linear
      }).start();
    });
    this.props.navigation.addListener('willBlur', () => {
      this.setState({ isRender: false, isShowFocusCamera: false });
    });
  }
  async onSuccess(e) {
    try {
      this.setState({ submitting: true });
      const result = await this.props.getPoint(e.data);
      if (!result || !result.profile || !result.branch || result.resultCode == 'ERR') {
        throw new Error(i18n.t('account.applyFailed'));
      }
      result.billCode = e.data.split(',')[0];
      this.setState({ submitting: false }, () => {
        Alert.alert(i18n.t('global.notification'),
          i18n.t('account.bonusPointSuccess'),
          [{
            text: i18n.t('global.ok'),
            onPress: () => this.onScanSuccess(result)
          }],
          { cancelable: false }
        );
      });
    } catch (error) {
      this.setState({ submitting: false });
      if (error.msg === 'Bill can not show!') {
        error.msg = i18n.t('qrcode.billCanNotShow');
      }
      if (!error.msg) {
        error.msg = error.message;
      }
      Alert.alert(i18n.t('global.error'),
        error.msg,
        [{
          text: i18n.t('global.ok'),
          onPress: () => this.scanner.reactivate()
        }],
        { cancelable: false }
      );
    }
  }
  onScanSuccess = (data) => {
    if (!data.reviews) {
      this.props.navigation.navigate('Review', { billData: data });
    } else {
      this.scanner.reactivate();
    }
  }
  modalHandler = () => {
    this.setState({ isReivew: !this.state.isReivew }, () => {
      if (!this.state.isReivew && this.scanner) {
        this.scanner.reactivate();
      }
    });
  }
  render() {
    // interpolate the scale of the title
    const focusCameraScale = this.focusCameraScaleValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.3, 0.1, 6]
    });
    const iconOpacity = this.focusCameraScaleValue.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0]
    });
    // construct the styles for the title
    const focusCameraTransformStyle = {
      transform: [{ scale: focusCameraScale }]
    };
    if (!this.props.user) {
      return (
        <View style={{ flex: 1, backgroundColor: brandDark }}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <View style={styles.icon}>
              <Ionicons name="ios-star" color={textDarkColor} size={130} />
            </View>
            <Text style={{ textAlign: 'center' }}>{i18n.t('account.signinForRewards')}</Text>
            <OutlineButton
              title={i18n.t('account.siginToContinue')}
              buttonStyle={{ width: 200, marginTop: 20 }}
              onPress={() => this.props.navigation.navigate('login')}
            />
          </View>
        </View>
      );
    }
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: brandDark }}>
        {this.state.submitting ?
          <View style={{ position: 'absolute', height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center', zIndex: 2 }}>
            <ActivityIndicator size="large" color={brandPrimary} />
          </View>
          : null}
        {this.state.isRender &&
          <QRCodeScanner
            ref={(node) => {
              this.scanner = node
            }}
            onRead={this.onSuccess.bind(this)}
            cameraStyle={styles.cameraContainer}
            topViewStyle={styles.zeroContainer}
            bottomViewStyle={styles.zeroContainer}
          />}
        <Animated.View style={[styles.focusCameraContainer, focusCameraTransformStyle, { opacity: iconOpacity }]}>
          <Ionicons name={'ios-qr-scanner'} size={300} color='#fff' />
        </Animated.View>
        {this.state.isShowFocusCamera && (
          <View style={[styles.containerScan,
          {
            borderTopWidth: offsetTopBottom,
            borderBottomWidth: offsetTopBottom,
            borderLeftWidth: offsetLeftRight,
            borderRightWidth: offsetLeftRight
          }]} />
        )}
        {this.state.isShowFocusCamera && (
          <View style={[styles.borderTopLeft,
          {
            top: offsetTopBottomBorder,
            left: offsetLeftRightBorder,
          }]} />
        )}
        {this.state.isShowFocusCamera && (
          <View style={[styles.borderTopRight,
          {
            top: offsetTopBottomBorder,
            right: offsetLeftRightBorder,
          }]} />
        )}
        {this.state.isShowFocusCamera && (
          <View style={[styles.borderBottomLeft,
          {
            bottom: offsetTopBottomBorder,
            left: offsetLeftRightBorder,
          }]} />
        )}
        {this.state.isShowFocusCamera && (
          <View style={[styles.borderBottomRight,
          {
            bottom: offsetTopBottomBorder,
            right: offsetLeftRightBorder,
          }]} />
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  containerScan: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0.2,
    borderColor: 'white',
  },
  borderTopLeft: {
    position: 'absolute',
    height: 30,
    width: 30,
    borderColor: 'white',
    borderLeftWidth: 5,
    borderTopWidth: 5,
  },
  borderTopRight: {
    position: 'absolute',
    height: 30,
    width: 30,
    borderColor: 'white',
    borderRightWidth: 5,
    borderTopWidth: 5,
  },
  borderBottomLeft: {
    position: 'absolute',
    height: 30,
    width: 30,
    borderColor: 'white',
    borderLeftWidth: 5,
    borderBottomWidth: 5,
  },
  borderBottomRight: {
    position: 'absolute',
    height: 30,
    width: 30,
    borderColor: 'white',
    borderRightWidth: 5,
    borderBottomWidth: 5,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  zeroContainer: {
    height: 0,
    flex: 0,
  },
  cameraContainer: {
    height: DEVICE_HEIGTH,
  },
  focusCameraContainer: {
    top: -56,
    position: "absolute",
    width: DEVICE_WIDTH,
    height: DEVICE_HEIGTH - 20,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    width: 160, 
    height: 160, 
    borderColor: textDarkColor, 
    borderRadius: 160, 
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30
  }
});

const mapStateToProps = state => {
  return {
    user: state.auth.user
  }
}

const mapDispathToProps = dispatch => {
  return {
    getPoint: (data) => dispatch(actions.pointQRcode(data))
  };
}
export default connect(mapStateToProps, mapDispathToProps)(QRCode);
