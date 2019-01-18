import React, { Component } from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity, Alert } from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'native-base';
import { NavigationActions } from 'react-navigation';

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
  inverseTextColor
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
          style={{ paddingHorizontal: 20, alignItems: 'center' }}>
          <Icon
            name={"ios-arrow-back"}
            style={{ color: inverseTextColor, fontSize: 28 }}
            underlayColor='transparent'
          />
        </TouchableOpacity>
      ),
      headerRight: (
        <TouchableOpacity onPress={() => navigation.goBack(null)}
          style={{ paddingHorizontal: 20, alignItems: 'center' }}>
          <Icon
            name={"ios-done-all"}
            style={{ color: inverseTextColor, fontSize: 32 }}
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
    notifications: []
  }
  componentDidMount() {
    _this = this;
    // this.getNotification();
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
        page: prevState.page,
        pageSize: prevState.size
      };
      const result = await axios.post('notification/getAll', params);
      this.setState({
        totalPage: result.Paging.totalPage,
        notifications: isLoadMore ? [...this.state.notifications, ...result.Notifications] : result.Notifications,
        isPullRefresh: false,
        firstLoading: false
      });
    } catch (error) {
      this.setState({ isPullRefresh: false });
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
      i18n.t('notification.areYouSureWantToMarkAllAsRead'),
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
    return (
      <TouchableOpacity style={styles.containerItem} onPress={() => this.openModalHanlder(item)}>
        <Ionicons
          size={26}
          name={item.LastSeen ? 'email-open-outline' : 'email-outline'}
          style={{ paddingHorizontal: 10 }}
          color={item.LastSeen ? textDarkColor : textColor} />
        <View style={{ width: '80%' }}>
          <Text style={styles.textStyle}>{item.Title}</Text>
          <Text style={styles.subtitle}>{item.ShortDesc}</Text>
          <Text style={styles.subtitle}>{formatDateTime(item.CreatedTime)}</Text>
        </View>
        {!item.LastSeen ? (<View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: brandPrimary, borderRadius: 50, width: 10, height: 10 }} />
        </View>) : null}
      </TouchableOpacity>
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
        {/* {this.state.firstLoading && !notifications.length ?
          <Spinner />
          :
          <FlatList
            onRefresh={this.getNotification}
            refreshing={this.state.isPullRefresh}
            keyExtractor={(item) => item.Id.toString()}
            data={notifications}
            renderItem={this.renderItem}
            onEndReached={() => this.getNotification(true)}
            onEndReachedThreshold={0.5}
          />
        } */}
      </View>
    );
  }
}

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
    fontSize: titleFontSize,
  },
  subtitle: {
    fontSize: fontSize - 2,
    paddingTop: 5,
    fontFamily,
    color: textColor
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
