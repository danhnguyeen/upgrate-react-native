import React from 'react';
import { Modal as RNModal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Header } from 'react-native-elements';
import { Icon } from 'native-base';
import { SafeAreaView } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';

import { fontSize, navHeight, inverseTextColor, platform, backgroundColor } from "../../config/variables";

const Modal = (props) => {
  return (
    <RNModal
      animationType={props.animationType ? props.animationType : "slide"}
      transparent={true}
      visible={props.visible}
      onRequestClose={props.onRequestClose}
    >
      <LinearGradient
        colors={['#2079ae', '#54ace0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Header
          leftComponent={props.leftComponent ? props.leftComponent : (
            <TouchableOpacity onPress={props.onRequestClose} style={{ paddingHorizontal: 10, alignItems: 'center' }}>
              <Icon
                name={"md-close"}
                style={{ color: inverseTextColor, fontSize: 30 }}
              />
            </TouchableOpacity>
          )}
          centerComponent={
            props.centerComponent ?
              props.centerComponent
              :
              { text: props.title, style: { color: inverseTextColor, fontSize: platform === 'ios' ? 16 : 18, fontWeight: platform === 'ios' ? '600' : '500' } }
          }
          rightComponent={props.rightComponent}
          backgroundColor={'transparent'}
          containerStyle={[{ height: navHeight, borderBottomWidth: 0 }, platform === 'android' ? { paddingTop: 0 } : null]}
        />
      </LinearGradient>
      <View style={[styles.container]}>
        {props.children}
      </View>
    </RNModal>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor,
  }
});

export default Modal;
