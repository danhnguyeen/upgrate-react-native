import React, { Component } from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity, Alert } from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'native-base';
import { NavigationActions } from 'react-navigation';
import Swipeout from 'react-native-swipeout';

import * as actions from './notification-actions';
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
  inverseTextColor,
  backgroundColor,
  shadow,
  textLightColor
} from "../../config/variables";
import i18n from "../../i18n";
import { Spinner } from '../../components/common';
// import { NotificationDetails } from '../../components/Notification';
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
    const result = [];
    for (let i = 0; i < 20; i++) {
      result.push({
        Id: i,
        Title: 'Xác nhận lịch hẹn',
        ShortDesc: 'Lịch hẹn của bạn tại tòa nhà PaxSky Nguyễn Thị Minh Khai đã được xác nhận',
        CreatedTime: '2019-02-19 10:02:00',
        LastSeen: i > 2
      });
    }
    console.log(result)
    this.setState({
      totalPage: 1,
      notifications: isLoadMore ? [...this.state.notifications, ...result] : result,
      isPullRefresh: false,
      firstLoading: false
    });
    // if (isLoadMore && this.state.page > this.state.totalPage) {
    //   return;
    // }
    // const prevState = { ...this.state };
    // if (!isLoadMore) {
    //   prevState.page = 1;
    // }
    // this.setState({ isPullRefresh, page: prevState.page + 1 });
    // try {
    //   const params = {
    //     page: prevState.page,
    //     pageSize: prevState.size
    //   };
    //   const result = await axios.post('notification/getAll', params);
    //   this.setState({
    //     totalPage: result.Paging.totalPage,
    //     notifications: isLoadMore ? [...this.state.notifications, ...result.Notifications] : result.Notifications,
    //     isPullRefresh: false,
    //     firstLoading: false
    //   });
    // } catch (error) {
    //   this.setState({ isPullRefresh: false });
    // }
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
    await axios.post('notification/markAsRead', { notificationId: selectedItem.Id });
  }
  closeModalHandler = () => {
    this.getNotification();
    this.props.fetchNotificationCount();
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
    await axios.post('notification/markReadAll');
    this.getNotification();
    await this.props.fetchNotificationCount();
  }
  markAsRead = async (id) => {
    this.setState({ rowIndex: null });
    await axios.post('notification/markAsRead', { notificationId: id });
    this.getNotification();
    this.props.fetchNotificationCount();
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
    await axios.post('notification/delete', { notificationId: id });
    this.getNotification();
    this.props.fetchNotificationCount();
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
      onPress: () => this.markAsRead(item.Id)
    }, {
      text: i18n.t('global.delete'),
      type: 'delete',
      onPress: () => this.deleteHandler(item.Id)
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
            name={item.LastSeen ? 'ios-mail-open' : 'ios-mail'}
            // type={'Octicons'}
            style={{ paddingRight: 10, fontSize: 22, color: textLightColor, opacity: item.LastSeen ? 0.8 : 1 }}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.textStyle}>{item.Title}</Text>
            <Text style={styles.subtitle}>{item.ShortDesc}</Text>
            <Text style={styles.subtitle}>{formatDateTime(item.CreatedTime)}</Text>
          </View>
          {/* {!item.LastSeen ? (<View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: brandPrimary, borderRadius: 50, width: 10, height: 10 }} />
        </View>) : null} */}
        </TouchableOpacity>
      </Swipeout>
    );
  };
  render() {
    const notifications = this.state.notifications || [];
    return (
      <View style={styles.container}>
        {/* {this.state.selectedItem ? (
          <NotificationDetails
            show
            delete={this.deleteWithConfirm}
            data={this.state.selectedItem}
            onClose={this.closeModalHandler}
          />
        ) : null} */}
        {this.state.firstLoading && !notifications.length ?
          <Spinner />
          :
          <FlatList
            onRefresh={this.getNotification}
            scrollEnabled={this.state.scrollEnabled}
            refreshing={this.state.isPullRefresh}
            keyExtractor={(item) => item.Id.toString()}
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
  // notifications: state.notificationState.notifications
});

const mapDispatchToProps = dispatch => ({
  // fetchNotifications: (data) => dispatch(actions.fetchNotifications(data)),
  // fetchNotificationCount: () => dispatch(actions.fetchNotificationCount())
});


export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
