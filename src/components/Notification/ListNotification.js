import React, { Component } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import Swipeout from 'react-native-swipeout';

import {
  brandDark,
  brandLight,
  brandPrimary,
  DEVICE_WIDTH,
  fontFamily,
  fontSize,
  textColor,
  textDarkColor,
  titleFontSize,
  brandDanger
} from "../../config/variables";
import { Modal } from "../../components/common";
import Ionicons from "react-native-vector-icons/MaterialCommunityIcons";
import i18n from "../../i18n";

class ListNotification extends Component {
  state = {
    rowIndex: null
  }
  onSwipeOpen = (rowIndex) => {
    this.setState({ rowIndex });
  }
  onSwipeClose = (rowIndex) => {
    if (rowIndex === this.state.rowIndex) {
      this.setState({ rowIndex: null });
    }
  }
  renderItem = ({ item, index }) => {
    const swipeoutBtns = [{
      text: i18n.t('global.delete'),
      // backgroundColor: brandDanger,
      type: 'delete',
      onPress: () => alert(index)
    }];
    return (
      <Swipeout
        right={swipeoutBtns}
        style={[styles.swipeItem, { marginTop: index === 0 ? 10 : 0 }]}
        onOpen={() => (this.onSwipeOpen(index))}
        close={this.state.rowIndex !== index}
        onClose={() => (this.onSwipeClose(index))}
      >
        <View style={styles.containerItem}>
          <Ionicons
            size={26}
            name={item.read ? 'email-open-outline' : 'email-outline'}
            style={{ paddingHorizontal: 10 }}
            color={item.read ? textDarkColor : textColor} />
          <View style={{ width: '80%' }}>
            <Text style={styles.textStyle}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.content}</Text>
          </View>
          {!item.read ? (<View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: brandPrimary, borderRadius: 50, width: 10, height: 10 }} />
          </View>) : null}
        </View>
      </Swipeout>
    );
  };
  render() {
    return (
      <Modal
        visible={this.props.show}
        onRequestClose={this.props.handleClose}
        title={i18n.t('tabs.notification')}
      >
        <View style={styles.container}>
          {this.props.listNotification.length ?
            <View style={{ width: DEVICE_WIDTH }}>
              <FlatList
                onRefresh={this.props.fetchNotification}
                refreshing={this.props.isFetchingNotification}
                style={{ width: DEVICE_WIDTH }}
                keyExtractor={(item, index) => index.toString()}
                data={this.props.listNotification}
                renderItem={this.renderItem}
              />
            </View>
            :
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <ActivityIndicator size="large" color={'#212121'} />
            </View>
          }
        </View>
      </Modal>
    );
  }
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: brandDark,
    width: '100%',
  },
  swipeItem: {
    flexDirection: 'row',
    width: DEVICE_WIDTH - 30,
    backgroundColor: brandLight,
    borderRadius: 5,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 10
  },
  containerItem: {
    flexDirection: 'row',
    paddingTop: 15,
    paddingBottom: 15,
  },
  textStyle: {
    color: textColor,
    fontSize: titleFontSize
  },
  subtitle: {
    fontSize: fontSize,
    paddingTop: 5,
    fontFamily,
    color: textColor
  }
});
export default ListNotification;