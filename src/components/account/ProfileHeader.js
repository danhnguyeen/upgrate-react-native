import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Icon } from 'native-base';
import FastImage from 'react-native-fast-image';
import { Avatar } from 'react-native-elements';
import { connect } from 'react-redux';

import { inverseTextColor, DEVICE_WIDTH, platform, textColor, textLightColor } from '../../config/variables';

const ProfileHeader = (props) => {
  return (
    <TouchableOpacity onPress={props.editAvatar}>
      <View style={platform === 'android' ? styles.container : null}>
        {props.user.image_profile && props.user.image_profile !==  'http://paxsky.amagumolabs.io/images/no_image_available.jpg' ?
          <FastImage
            source={{ uri: props.user.image_profile, priority: FastImage.priority.high }}
            style={{ height: 76, width: 76, borderRadius: 50 }} />
          :
          <Avatar
            size="large"
            rounded
            placeholderStyle={{ backgroundColor: inverseTextColor }}
            icon={{ name: 'user', type: 'font-awesome', color: textColor }}
          />
        }
        <View style={{ width: 76 }}>
          <View style={styles.editContainer}>
            <Icon name='md-create' style={{ color: inverseTextColor, fontSize: 16 }} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: DEVICE_WIDTH - 110,
    justifyContent: 'center',
    alignItems: 'center'
  },
  editContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 0,
    width: 20,
    height: 20,
    right: 5,
    backgroundColor: textLightColor,
    borderRadius: 50
  }
});

const mapStateToProps = state => {
  return {
    user: state.auth.user
  }
}
export default connect(mapStateToProps)(ProfileHeader);