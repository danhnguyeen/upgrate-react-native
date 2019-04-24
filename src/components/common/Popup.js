import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import {
  brandPrimary,
  brandDark,
  shadowColor,
  textH4
} from '../../config/variables';

const popup = (props) => {
  return (
    <Modal
      transparent={true}
      animationType='fade'
      visible={props.visible}
      onRequestClose={props.onRequestClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <View style={[styles.bodyStyle, props.bodyStyle]} elevation={3}>
            <TouchableOpacity
              onPress={props.onRequestClose}
              style={styles.closeButton}>
              <Icon name="md-close" size={30} color={brandPrimary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{props.title}</Text>
            {props.children}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center'
  },
  bodyStyle: {
    width: '94%',
    maxHeight: '75%',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: brandDark,
    borderRadius: 2,
    shadowColor: shadowColor,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5
  },
  closeButton: {
    position: 'absolute',
    padding: 10,
    right: 5,
    top: 0
  },
  headerTitle: {
    ...textH4,
    color: brandPrimary,
    marginTop: 30,
    marginBottom: 10
  }
});

export default popup;
