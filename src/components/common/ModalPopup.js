import React from 'react';
import { View, Modal, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Text, Icon, } from "native-base";
import { shadow, winW, winH } from '../../config/variables';

 const ModalPopup = (props) => {
  return (
    <Modal transparent={true} animationType='none' visible={props.visible} onRequestClose={props.onRequestClose}    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <TouchableOpacity onPress={props.onRequestClose} style={styles.content} activeOpacity={1} />
          <View style={[{ width: winW(90), maxheight: winH(80), borderRadius: 4 }, shadow]}>
            <View style={{ overflow: 'hidden', backgroundColor: '#FEFEFE' }}>
              <View style={{ flexDirection: 'row', backgroundColor: '#083C76', borderBottomColor: '#DFBC2C', borderBottomWidth: 9 }} >
                <View style={{ flex: 0.2, paddingLeft: 20, }}></View>
                <View style={{ flex: 0.6, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', }}>
                  <Text style={{ color: "#FFF", fontSize: 18, fontWeight: "500", lineHeight: 64 }}>{props.title}</Text>
                </View>
                <TouchableOpacity
                  style={{ flex: 0.2, paddingRight: 20, alignItems: 'flex-end', }}
                  onPress={props.onRequestClose}>
                  <Icon style={{ color: "#fff", fontSize: 30, }} name={'ios-close-circle-outline'} type={'Ionicons'} />
                </TouchableOpacity>
              </View>
              {props.children}
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  content: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    position: 'absolute',
  },

})
export default ModalPopup;
