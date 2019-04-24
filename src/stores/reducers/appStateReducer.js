import { Dimensions } from 'react-native';
import * as actionTypes from '../actions/types';

const initialState = {
  isConnected: true,
  activeScreen: 'Home',
  isShowBtnMenu: true,
  deviceWidth: Dimensions.get('window').width,
  deviceHeight: Dimensions.get('window').height,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.UPDATE_STATUS_INTERNET:
      return {
        ...state,
        isConnected: action.isConnected
      };
    case actionTypes.UPDATE_ACTIVE_MAIN_SCREEN:
      return {
        ...state,
        activeScreen: action.activeScreen,
      };
    case actionTypes.SHOW_BTN_MENU:
      return {
        ...state,
        isShowBtnMenu: action.isShowBtnMenu,
      };
    case actionTypes.UPDATE_DEVICE_WIDTH_HEIGHT:
      return {
        ...state,
        deviceWidth: action.deviceWidth,
        deviceHeight: action.deviceHeight,
      };
    default:
      return state;
  }
};
