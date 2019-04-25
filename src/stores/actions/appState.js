import * as actionTypes from './types';

export const updateActiveMainScreen = (activeScreen) => ({
  type: actionTypes.UPDATE_ACTIVE_MAIN_SCREEN,
  activeScreen,
});
export const updateShowBtnMenu = (isShowBtnMenu) => ({
  type: actionTypes.SHOW_BTN_MENU,
  isShowBtnMenu,
});
export const updateDeviceWidthHeight = (deviceWidth, deviceHeight) => ({
  type: actionTypes.UPDATE_DEVICE_WIDTH_HEIGHT,
  deviceWidth,
  deviceHeight
});
