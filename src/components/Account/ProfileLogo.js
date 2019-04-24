import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Avatar } from 'react-native-elements'

import { textDarkColor } from '../../config/variables';

const ProfileLogo = () => (
  <View style={styles.container}>
    <Avatar
      size="large"
      rounded
      icon={{name: 'user', type: 'font-awesome'}}
      activeOpacity={0.7}
      containerStyle={styles.avatarStyle}
    />
    <Text style={styles.textStyle}>Philippe Nguyen</Text>
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  avatarStyle: {
    marginLeft: 10,
    marginRight: 10
  },
  textStyle: {
    fontSize: 20,
    color: textDarkColor
  }
});
export default ProfileLogo;

