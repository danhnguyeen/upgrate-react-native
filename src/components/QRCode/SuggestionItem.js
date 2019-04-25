import React from 'react';
import { Badge } from 'react-native-elements';

import { textColor, fontSize, inverseTextColor } from '../../config/variables';

const SuggestionItem = (props) => (
  <Badge
    containerStyle={[{
      backgroundColor: props.commands[props.title] ? textColor : 'transparent',
      borderColor: props.commands[props.title] ? textColor : '#a6a6a6',
      borderWidth: 1,
      margin: 10
    }]}
    textStyle={{ color: props.commands[props.title] ? inverseTextColor : textColor, padding: 5, fontSize: fontSize + 2 }}
    value={props.title}
    onPress={() => props.onPress(props.title)}
  />
);

export default SuggestionItem;