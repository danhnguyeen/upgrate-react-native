import React from 'react';
import { Text } from 'react-native';
import { Badge } from 'react-native-elements';

import { brandPrimary, inverseTextColor } from '../../config/variables';

const RatingSuggestion = (props) => (
  <Badge
    badgeStyle={[{
      backgroundColor: props.selected ? brandPrimary : 'transparent',
      borderColor: brandPrimary,
      borderWidth: 1,
      margin: 5,
      height: 40,
      borderRadius: 50
    }]}
    textStyle={{ color: props.selected ? inverseTextColor : brandPrimary, fontSize: 18 }}
    value={<Text style={{ paddingHorizontal: 15, color: props.selected ? inverseTextColor : brandPrimary }}>{props.title}</Text>}
    onPress={props.onPress}

  />
);

export default RatingSuggestion;