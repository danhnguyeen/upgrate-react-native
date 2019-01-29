import React from 'react';
import { ScrollView, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from 'native-base';
import HTMLView from 'react-native-htmlview';

import { Modal } from '../common';
import { brandLight, inverseTextColor, shadow } from '../../config/variables';

const NotificationDetails = (props) => {
  const content = props.data.content ? props.data.content.replace(/(\r\n|\n|\r)/gm, "") : props.data.content;
  return (
    <Modal
      visible={props.show}
      onRequestClose={props.onClose}
      title={props.data.title}
      rightComponent={
        <TouchableOpacity onPress={() => props.delete(props.data.notification_id)} style={{ paddingHorizontal: 5 }}>
          <Icon name="md-trash" style={{ color: inverseTextColor, fontSize: 24 }} />
        </TouchableOpacity>
      }
    >
      <ScrollView contentContainerStyle={{ padding: 15 }}>
        <View style={styles.container}>
          <HTMLView
            value={content}
            stylesheet={styles}
          />
        </View>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    ...shadow,
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: brandLight,
    padding: 20,
    borderRadius: 5
  },
  header: {
    fontSize: 18,
    // marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  title: {
    // marginBottom: 15
  },
  msg: {
    // marginBottom: 15
  },
  div: {
    // marginBottom: 5
  },
  info: {
    // marginTop: 10
  },
  note: {
    // marginTop: 10,
    marginBottom: 20
  },
  brand: {
    fontWeight: 'bold',
    // marginBottom: 5
  }
});

export default NotificationDetails;
