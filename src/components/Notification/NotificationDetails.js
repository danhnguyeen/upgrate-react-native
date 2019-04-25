import React from 'react';
import { Text, ScrollView, View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { Modal } from '../common';
import { brandDark, brandLight, textColor } from '../../config/variables';
import i18n from '../../i18n';
import HTMLView from 'react-native-htmlview';

const NotificationDetails = (props) => {
  return (
    <Modal
      visible={props.show}
      onRequestClose={props.onClose}
      title={props.data.Title}
      rightComponent={
        <TouchableOpacity onPress={() => props.delete(props.data.Id)} style={{ paddingHorizontal: 5 }}>
          <Icon name="md-trash" size={24} color={textColor} />
        </TouchableOpacity>
      }
    >
      <ScrollView contentContainerStyle={{ paddingHorizontal: 15, paddingVertical: 10 }}>
        <View style={{ backgroundColor: brandLight, paddingHorizontal: 20, paddingVertical: 15, borderRadius: 5 }}>
          {/* <Text style={{ textAlign: 'center', paddingVertical: 15, fontSize: titleFontSize }}>{props.data.Title}</Text> */}
          {/* <Divider style={{ backgroundColor: brandDark, marginVertical: 15 }} /> */}
          {/* <Text>{props.data.Content}</Text> */}
          <HTMLView
            value={props.data.Content}
            // value={`<header>XÁC NHẬN ĐẶT BÀN</header><title>Xin chào <b>Danh Nguyễn</b>,</title><msg>Yêu cầu đặt bàn của bạn đã được xác nhận</msg><brand>YEN PHÚ MỸ HƯNG</brand><div>185 Nguyễn Đức Cảnh, Phường Tân Phong, Quận 7, Tp. HCM</div><info>10 ghế người lớn, 2 ghế trẻ em</info><info>19:00 ngày 01 tháng 01 năm 2019</info><note>Ghi chú:</note>`}
          stylesheet={styles}
          />
        </View>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  title: {
    marginBottom: 15
  },
  msg: {
    marginBottom: 15
  },
  div: {
    marginBottom: 5
  },
  info: {
    marginTop: 10
  },
  note: {
    marginTop: 10,
    marginBottom: 20
  },
  brand: {
    fontWeight: 'bold',
    marginBottom: 5
  }
});

export default NotificationDetails;
