import React from 'react';
import { View } from 'react-native';

import { shadow } from '../../config/variables';

const SliderMarker = () => (
  <View style={[shadow, { width: 30, height: 30, borderRadius: 15, backgroundColor: '#fff', borderWidth: 1, borderColor: '#eaeaea', elevation: 5 }]} />
);

export default SliderMarker;
