import { Platform, Dimensions, PixelRatio, StatusBar } from 'react-native';
import { Header } from 'react-navigation';

export const DEVICE_HEIGTH = Dimensions.get('window').height;
export const DEVICE_WIDTH = Dimensions.get('window').width;
export const platform = Platform.OS;
// export const isIphoneX =
//   platform === 'ios' && DEVICE_HEIGTH === 812 && DEVICE_WIDTH === 375;

const dimen = Dimensions.get('window');
export const isIphoneX = Platform.OS === 'ios' &&
      !Platform.isPad &&
      !Platform.isTVOS &&
      ((dimen.height === 812 || dimen.width === 812) || (dimen.height === 896 || dimen.width === 896));
export function getStatusBarHeight(skipAndroid = false) {
  if (Platform.OS === 'ios') {
      return isIphoneX ? 44 : 20;
  }
  if (skipAndroid) {
      return 0;
  }
  return StatusBar.currentHeight;
};
export const navHeight = Header.HEIGHT + getStatusBarHeight() - 19;
// Colors
export const brandPrimary = '#F5A623';
export const brandInfo = '#5F9EE7';
export const brandSuccess = '#7ED321';
export const brandDanger = '#D0021B';
export const brandWarning = "#f7941e";
export const brandDark = "#1C1D20";
export const brandLight = "#212B34";
export const brandLightOpacity50 = 'rgba(33, 43, 52, 0.5)';
export const brandLightOpacity70 = 'rgba(28, 29, 32, 0.7)';
export const lightBackground = '#fafbfc';
export const statusBarColor = '#171e25';
// Background Color

// Shadow Color
export const shadowColor = '#161616';
// Font
export const fontFamily = 'Roboto-Regular';
export const fontFamilyBold = 'Roboto-Bold';

let fontScal = 14;
if (PixelRatio.get() > 2) {
  fontScal = 15;
}
// if (PixelRatio.get() > 3) {
//   fontScal = 18;
// }

export const fontSize = fontScal;
export const inputFontSize = fontSize + 2;
export const lineHeight = fontSize * 1.44;
// export const fontSize = platform === 'ios' ? 12 : 14;
export const fontSizeH1 = fontSize * 2.8;
export const fontSizeH2 = fontSize * 2.4;
export const fontSizeH3 = fontSize * 2;
export const fontSizeH4 = fontSize * 1.5;
// Text
export const textColor = "#fff";
export const textDarkColor = "#686868";
export const inverseTextColor = "#000";
export const textH1 = { fontSize: fontSizeH1, fontFamily: fontFamilyBold };
export const textH2 = { fontSize: fontSizeH2, fontFamily: fontFamilyBold };
export const textH3 = { fontSize: fontSizeH3, fontFamily: fontFamilyBold };
export const textH4 = { fontSize: fontSizeH4, fontFamily: fontFamilyBold };

// Title
export const titleFontSize = fontSize + 1;

export const defaultTimeBooking = '11:00';

export const toastOption = {
  duration: 4000,
  position: -49,
  shadow: false,
  animation: true,
  hideOnPress: true,
  // delay: 1000,
  containerStyle: {
    // paddingVertical: 1,
    paddingTop: 4,
    paddingBottom: 6,
    width: DEVICE_WIDTH,
    borderRadius: 0
  }
};
