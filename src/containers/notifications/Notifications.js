import React, { Component } from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity, Alert } from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'native-base';
import Swipeout from 'react-native-swipeout';

import * as actions from './notification-actions';
import {
  brandLight,
  DEVICE_WIDTH,
  fontSize,
  textColor,
  inverseTextColor,
  backgroundColor,
  textLightColor
} from "../../config/variables";
import i18n, { getCurrentLocale } from "../../i18n";
import { Spinner } from '../../components/common';
import { NotificationDetails } from '../../components/notifications';
import { formatDateTime } from '../../util/utility';
import axios from '../../config/axios';

let _this = null;
class Notifications extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: i18n.t('tabs.notifications'),
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.goBack(null)}
          style={{ paddingHorizontal: 10, alignItems: 'center' }}>
          <Icon
            name={"ios-arrow-back"}
            style={{ color: inverseTextColor, fontSize: 34 }}
            underlayColor='transparent'
          />
        </TouchableOpacity>
      ),
      headerRight: (
        <TouchableOpacity onPress={() => _this.markAllAsReadConfirm()}
          style={{ paddingHorizontal: 20, alignItems: 'center' }}>
          <Icon
            name={"ios-done-all"}
            style={{ color: inverseTextColor, fontSize: 44 }}
            underlayColor='transparent'
          />
        </TouchableOpacity>
      )
    };
  };
  state = {
    rowIndex: null,
    firstLoading: true,
    page: 1,
    size: 25,
    selectedItem: null,
    totalPage: null,
    isPullRefresh: false,
    scrollEnabled: true,
    notifications: []
  }
  componentDidMount() {
    _this = this;
    this.getNotification();
  }
  getNotification = async (isLoadMore, isPullRefresh = false) => {
    if (isLoadMore && this.state.page > this.state.totalPage) {
      return;
    }
    const prevState = { ...this.state };
    if (!isLoadMore) {
      prevState.page = 1;
    }
    this.setState({ isPullRefresh, page: prevState.page + 1 });
    try {
      const params = {
        customer_id: this.props.user.customer_id,
        page: prevState.page,
        pageSize: prevState.size
      };
      const result = await axios.get('notification/notifications', { params });
      this.setState({
        // totalPage: result.Paging.totalPage,
        notifications: isLoadMore ? [...this.state.notifications, ...result] : result,
        isPullRefresh: false,
        firstLoading: false
      });
    } catch (error) {
      this.setState({ isPullRefresh: false, firstLoading: false });
    }
  }
  onSwipeOpen = (rowIndex) => {
    this.setState({ rowIndex });
  }
  onSwipeClose = (rowIndex) => {
    if (rowIndex === this.state.rowIndex) {
      this.setState({ rowIndex: null });
    }
  }
  SwipeScrollEvent = (allowParentScroll) => {
    if (this.state.scrollEnabled != allowParentScroll) {
      this.setState({ scrollEnabled: allowParentScroll })
    }
  }
  openModalHanlder = async (selectedItem) => {
    this.setState({ selectedItem });
    await axios.post('notification/update-read-notification', { notification_id: selectedItem.notification_id });
  }
  closeModalHandler = () => {
    this.getNotification();
    this.props.fetchNotificationCount(this.props.user.customer_id);
    this.setState({ selectedItem: null });
  }
  markAllAsReadConfirm = () => {
    Alert.alert(
      i18n.t('global.confirm'),
      i18n.t('notifications.areYouSureWantToMarkAllAsRead'),
      [
        { text: i18n.t('global.cancel'), style: 'cancel' },
        { text: i18n.t('global.ok'), onPress: this.markAllAsRead },
      ],
      { cancelable: false }
    )
  }
  markAllAsRead = async () => {
    try {
      await axios.post('notification/mark-all-notification-as-read', { customer_id: this.props.user.customer_id });
      this.getNotification();
      await this.props.fetchNotificationCount(this.props.user.customer_id);
    } catch (error) {
      Alert.alert(i18n.t('global.error'), error.message);
    }
  }
  markAsRead = async (id) => {
    this.setState({ rowIndex: null });
    await axios.post('notification/update-read-notification', { notification_id: id });
    this.getNotification();
    this.props.fetchNotificationCount(this.props.user.customer_id);
  }
  deleteWithConfirm = async (id) => {
    Alert.alert(
      i18n.t('global.confirm'),
      i18n.t('global.areYouSureToDelete'),
      [
        { text: i18n.t('global.cancel'), style: 'cancel' },
        { text: i18n.t('global.ok'), onPress: () => this.deleteHandler(id) },
      ]
    )
  }
  deleteHandler = async (id) => {
    await axios.post('notification/delete', { notification_id: id });
    this.getNotification();
    this.props.fetchNotificationCount(this.props.user.customer_id);
    this.setState({ rowIndex: null, selectedItem: null });
  }
  renderItem = ({ item, index }) => {
    const swipeoutBtns = [{
      component: (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: inverseTextColor, textAlign: 'center' }}>{i18n.t('notifications.markAsRead')}</Text>
        </View>
      ),
      type: 'primary',
      onPress: () => this.markAsRead(item.notification_id)
    }, {
      text: i18n.t('global.delete'),
      type: 'delete',
      onPress: () => this.deleteHandler(item.notification_id)
    }];
    return (
      <Swipeout
        right={swipeoutBtns}
        style={[styles.swipeItem, { marginTop: index === 0 ? 10 : 0 }]}
        onOpen={() => (this.onSwipeOpen(index))}
        scroll={this.SwipeScrollEvent}
        close={this.state.rowIndex !== index}
        onClose={() => (this.onSwipeClose(index))}
      >
        <TouchableOpacity style={styles.containerItem} onPress={() => this.openModalHanlder(item)}>
          <Icon
            name={item.is_read ? 'ios-mail-open' : 'ios-mail'}
            style={{ paddingRight: 10, fontSize: 22, color: textLightColor, opacity: item.is_read ? 0.8 : 1 }}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.textStyle}>{item[`title_${getCurrentLocale()}`]}</Text>
            <Text style={styles.subtitle}>{item[`body_${getCurrentLocale()}`]}</Text>
            <Text style={styles.subtitle}>{formatDateTime(item.created_at, 'DD-MM-YYYY HH:mm')}</Text>
          </View>
        </TouchableOpacity>
      </Swipeout>
    );
  };
  render() {
    const notifications = this.state.notifications || [];
    return (
      <View style={styles.container}>
        {this.state.selectedItem ? (
          <NotificationDetails
            show
            delete={this.deleteWithConfirm}
            data={this.state.selectedItem}
            onClose={this.closeModalHandler}
          />
        ) : null}
        {this.state.firstLoading && !notifications.length ?
          <Spinner />
          :
          <FlatList
            onRefresh={this.getNotification}
            scrollEnabled={this.state.scrollEnabled}
            refreshing={this.state.isPullRefresh}
            keyExtractor={(item) => item.notification_id.toString()}
            data={notifications}
            renderItem={this.renderItem}
            onEndReached={() => this.getNotification(true)}
            onEndReachedThreshold={0.5}
          />
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor,
    width: '100%',
  },
  swipeItem: {
    flexDirection: 'row',
    width: DEVICE_WIDTH,
    backgroundColor: brandLight,
    marginBottom: 10
  },
  containerItem: {
    flexDirection: 'row',
    padding: 15,
    width: DEVICE_WIDTH
  },
  textStyle: {
    color: textColor,
    fontSize: fontSize + 1,
  },
  subtitle: {
    fontSize: fontSize - 2,
    paddingTop: 5,
    color: textLightColor
  }
});

const mapStateToProps = state => ({
  user: {}
});

const mapDispatchToProps = dispatch => ({
  fetchNotificationCount: (customer_id) => dispatch(actions.fetchNotificationCount(customer_id))
});


export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
