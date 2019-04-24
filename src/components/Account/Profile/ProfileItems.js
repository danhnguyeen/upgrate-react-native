import React from 'react';
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import { ListItem } from 'react-native-elements';

import { textDarkColor, fontSize } from '../../../config/variables';

const ProfileItems = (props) => {
  return (
    <TouchableOpacity style={styles.itemContainer} onPress={props.action}>
      <ListItem
        title={
          <View style={styles.titleView}>
            <Text style={{ color: textDarkColor }}>{props.label}</Text>
            <Text style={styles.mainTitle}>{props.value}</Text>
          </View>
        }
        containerStyle={{ padding: 14 }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E9E9EF'
  },
  itemContainer: {
    borderBottomColor: '#E9E9EF', 
    borderBottomWidth: 1
  },
  titleView: {
    flexDirection: 'column',
    paddingLeft: 10
  },
  mainTitle: {
    fontSize: fontSize + 2,
    color: 'black'
  }
});

export default ProfileItems;
