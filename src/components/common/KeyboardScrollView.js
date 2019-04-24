import React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { platform } from '../../config/variables';

const KeyboardScrollView = (props) => (
  <KeyboardAwareScrollView 
    style={{ width: '100%' }}
    scrollEnabled={true}
    enableOnAndroid={true}
    keyboardShouldPersistTaps={platform === 'ios' ? 'handled' : 'handled'}
    { ...props }
  >
    {props.children}
  </KeyboardAwareScrollView>
);

export default KeyboardScrollView;
