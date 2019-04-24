import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';
import { fontFamily, fontSize, brandDark, brandLight } from '../../config/variables';

const AccountItem = (props) => (
  <TouchableOpacity onPress={props.onPress}>
    <ListItem
      containerStyle={{ backgroundColor: brandLight, paddingVertical: 20 }}
      title={props.title}
      titleStyle={styles.titleStyle}
      leftIcon={props.leftIcon}
    />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  titleStyle: {
    fontFamily,
    fontSize: fontSize + 1,
  }
});

export default AccountItem;