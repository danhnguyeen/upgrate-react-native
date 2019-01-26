import React from 'react';
import { Badge } from 'react-native-elements';

import { brandPrimary, fontSize, inverseTextColor } from '../../config/variables';

const RatingSuggestion = (props) => (
  <Badge
    containerStyle={[{
      backgroundColor: props.selected ? brandPrimary : 'transparent',
      borderColor: brandPrimary,
      borderWidth: 1,
      // borderRadius: 3,
      margin: 5
    }]}
    textStyle={{ color: props.selected ? inverseTextColor : brandPrimary, padding: 5 }}
    value={props.title}
    onPress={props.onPress}
  />
);

export default RatingSuggestion;