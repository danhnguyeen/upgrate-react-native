import React, { Component } from 'react';
import { Alert, FlatList, View, Text, StyleSheet, LayoutAnimation } from 'react-native';

import { Spinner, OutlineButton } from '../../../../components/common';
import axios from '../../../../config/axios-mylife';
import { BookingInfo, BookingIcon } from '../../../../components/BookTable/TabBooking/BookingHistory';
import i18n from '../../../../i18n';
import { brandLight } from '../../../../config/variables';

class BookingHistory extends Component {
  state = {
    bookings: [],
    isFetching: false,
    firstLoading: true,
    isRender: false,
    page: 1,
    size: 20,
    totalPage: null
  };
  // componentWillUnmount() {
  //   LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
  // }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.isRender !== this.state.isRender) {
      return true;
    }
    return false;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedShop.bid !== this.props.selectedShop.bid
      || (!nextProps.user && this.props.user)) {
      this.setState({
        bookings: [],
        isRender: !this.state.isRender,
        page: 1,
        firstLoading: true
      });
    }
    if (nextProps.focused && !this.props.focused 
      || (nextProps.focused && nextProps.user && !this.props.user)) {
      this.fetchBookingHistory(nextProps.selectedShop);
    }
  }
  fetchBookingHistory = async (selectedShop, isLoadMore) => {
    if (!selectedShop && !this.props.user) {
      return;
    }
    if (isLoadMore && this.state.page > this.state.totalPage) {
      return;
    }
    const prevState = { ...this.state };
    if (!isLoadMore) {
      prevState.page = 1;
    }
    this.setState({ isFetching: true, page: prevState.page + 1 });
    const shop = selectedShop ? selectedShop : this.props.selectedShop;
    try {
      const params = {
        branchId: shop.bid,
        page: prevState.page,
        size: prevState.size,
        con: 'bt'
      };
      const { result } = await axios.get(`reservation/history`, { params });
      this.setState({
        totalPage: result.PAGING[0].totalPage,
        bookings: isLoadMore ? [...this.state.bookings, ...result.CONTAIN] : result.CONTAIN,
        firstLoading: false,
        isFetching: false,
        isRender: !this.state.isRender
      });
    } catch (error) {
      this.setState({
        isFetching: false,
        firstLoading: false,
        isRender: !this.state.isRender
      });
    }
  }

  _renderItem = ({ item }) => (
    <BookingInfo
      booking={item}
      cancelBooking={this.clickedCancel}
      updateBooking={this.props.setBooking} />
  );

  cancelBooking = async (item) => {
    const data = { ...item };
    data.RID = data.Id;
    data.ReserStatusByNumber = 5;
    try {
      let encodeURI = Object.entries(data).map(([key, val]) => `${key}=${val}`).join('&');
      await axios.post(`reservation/update?${encodeURI}`);
      Alert.alert(i18n.t('global.notification'), i18n.t('booking.bookHistory.cancelledSuccess'));
      this.fetchBookingHistory();
    } catch (error) {
      Alert.alert(i18n.t('global.error'), error.msg);
    }
  }

  clickedCancel = (item) => {
    Alert.alert(
      i18n.t('booking.bookHistory.cancelTitle'),
      i18n.t('booking.bookHistory.cancelContent'),
      [
        { text: i18n.t('global.cancel'), onPress: () => { }, style: 'cancel' },
        { text: i18n.t('global.ok'), onPress: () => this.cancelBooking(item) },
      ],
      { cancelable: false }
    );
  }

  render() {
    if (this.state.firstLoading && this.props.user) {
      return <Spinner />;
    }
    let container = (
      <View style={{ flex: 1, alignItems: 'center' }}>
        <BookingIcon />
        <Text>{i18n.t('account.accumulation.youHaventBookTalbeYet')}</Text>
        <OutlineButton
          title={i18n.t('account.accumulation.buttonTableNow')}
          buttonStyle={[styles.buttonStyle, { marginTop: 20 }]}
          onPress={this.props.openBookTable}
        />
      </View>
    );
    if (this.state.bookings.length && this.props.user) {
      container = (
        <View style={{ flex: 1 }}>
          <View style={styles.buttonContainer}>
            <OutlineButton
              title={i18n.t('booking.about.btnBooking')}
              buttonStyle={styles.buttonStyle}
              onPress={this.props.openBookTable}
            />
          </View>
          <FlatList
            onRefresh={this.fetchBookingHistory}
            refreshing={this.state.isFetching}
            keyExtractor={(item) => item.Id.toString()}
            data={this.state.bookings}
            renderItem={this._renderItem}
            onEndReached={() => this.fetchBookingHistory(null, true)}
            onEndReachedThreshold={0.5}
          />
        </View>
      );
    }
    return container;
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: brandLight,
    marginVertical: 10,
    alignItems: 'center'
  },
  buttonStyle: {
    width: 200,
    margin: 10
  }
})
export default BookingHistory;
