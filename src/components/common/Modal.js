import React from 'react';
import { Modal, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Header } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';

import { fontSize, textColor, brandLight, brandDark, navHeight, shadowColor, isIphoneX } from "../../config/variables";

const customModal = (props) => {
  return (
    <Modal
      animationType={props.animationType ? props.animationType : "slide"}
      transparent={false}
      visible={props.visible}
      onRequestClose={props.onRequestClose}
    >
      <View style={[styles.container]}>
        <Header
          leftComponent={props.leftComponent ? props.leftComponent : (
            <TouchableOpacity onPress={props.onRequestClose} style={{ paddingHorizontal: 10, alignItems: 'center' }}>
              <Icon name={"ios-close"}
                size={38}
                color={textColor}
                underlayColor='transparent'
              />
            </TouchableOpacity>
          )}
          centerComponent={
            props.centerComponent ?
              props.centerComponent
              :
              { text: props.title, style: { color: textColor, fontSize: fontSize + 3 } }
          }
          rightComponent={props.rightComponent}
          backgroundColor={brandLight}
          outerContainerStyles={[{
            borderBottomWidth: 0,
            elevation: 5,
            minHeight: navHeight,
            shadowColor,
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          }, props.outerContainerStyles]}
        />
        {props.children}
      </View>
    </Modal>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: brandDark,
    paddingBottom: isIphoneX ? 15 : 0
  }
});

export default customModal;
