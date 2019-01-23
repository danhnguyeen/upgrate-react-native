import { Platform, Dimensions, PixelRatio, StatusBar, NativeEventEmitter, NativeModules } from 'react-native';
import { Header } from 'react-navigation';

const { StatusBarManager } = NativeModules;

export const DEVICE_HEIGTH = Dimensions.get('window').height;
export const DEVICE_WIDTH = Dimensions.get('window').width;
export const platform = Platform.OS;

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
// let statusBarH;
// StatusBarManager.getHeight(({ height }) => console.log('heigh' +height));
// export const statusBarHeight = async() => {
//   const height = await StatusBarManager.getHeight();
//   console.log(height);
//   return height;
// };

export const navHeight = Header.HEIGHT + getStatusBarHeight() - 19;
// Colors
export const brandPrimary = '#072f6a'; //'#2997d8';
export const brandInfo = '#5F9EE7';
export const brandSuccess = '#7ED321';
export const brandDanger = '#D0021B';
export const brandWarning = "#f7941e";
export const backgroundColor = "#efeef4";
export const brandLight = "#ffffff";
export const brandLightOpacity50 = 'rgba(33, 43, 52, 0.5)';
export const brandLightOpacity70 = 'rgba(28, 29, 32, 0.7)';
export const lightBackground = '#fafbfc';
export const statusBarColor = '#171e25';
// Background Color

// Shadow Color
export const shadowColor = '#161616';
// Font
export const fontFamily = platform === 'ios' ? 'System' : 'Roboto-Regular';
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
export const textColor = "#000";
export const textDarkColor = "#000";
export const textLightColor = "#666666";
export const inverseTextColor = "#fff";
export const textH1 = { fontSize: fontSizeH1, fontFamily: fontFamilyBold };
export const textH2 = { fontSize: fontSizeH2, fontFamily: fontFamilyBold };
export const textH3 = { fontSize: fontSizeH3, fontFamily: fontFamilyBold };
export const textH4 = { fontSize: fontSizeH4, fontFamily: fontFamilyBold };

// Title
export const titleFontSize = fontSize + 2;

export const shadow = {
  elevation: 1,
  shadowColor: '#1a1917',
  shadowOpacity: 0.1,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 5,
  // marginBottom: 15
};
// export const shadowProperties = {
//   shadowColor: '#1a1917',
//   shadowOpacity: 0.25,
//   shadowOffset: { width: 0, height: 10 },
//   shadowRadius: 10
// }
