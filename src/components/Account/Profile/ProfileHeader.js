import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Header, Avatar } from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Ionicons';
import { brandLight, textColor, brandPrimary, isIphoneX } from '../../../config/variables';

const ProfileHeader = (props) => {
  const leftComponent = (
    <TouchableOpacity 
      onPress={props.setModalVisible}
      style={styles.leftContainer} >
      <Icon name={ props.iconType === "back" ? "ios-arrow-back" : "ios-close" } 
        size={ props.iconType === "back" ? 32 : 40 }
        color={textColor}
      />
    </TouchableOpacity>
  );
  const centerComponent = (
    <TouchableOpacity onPress={props.editAvatar}>
      {props.user.profilePicture ?
        <FastImage 
          source={{ uri: props.user.profilePicture, priority: FastImage.priority.high }} 
          style={{ height: 76, width: 76, borderRadius: 50 }} />
        :
        <Avatar
          size="large"
          rounded
          icon={{name: 'user', type: 'font-awesome'}}
          activeOpacity={0.7}
        />
      }
      { props.editAvatar && 
      <View style={styles.editContainer}>
        <Icon name='md-create' color={textColor} size={16} /> 
      </View>
      }
    </TouchableOpacity>
  );
  return (
    <Header
      leftComponent={leftComponent}
      centerComponent={centerComponent}
      outerContainerStyles={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: brandLight, 
    minHeight: isIphoneX ? 150 : 120, 
    borderBottomWidth: 0
  },
  leftContainer: {
    padding: 10
  },
  editContainer: {
    position: 'absolute', 
    justifyContent: 'center', 
    alignItems: 'center', 
    bottom: 0, 
    width: 20, 
    height: 20, 
    right: 5, 
    backgroundColor: brandPrimary, 
    borderRadius: 50
  }
});

export default ProfileHeader;