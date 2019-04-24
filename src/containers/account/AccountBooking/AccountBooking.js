import React, { Component } from 'react';
import {
  View,
  FlatList
} from 'react-native';
import { connect } from 'react-redux';

import i18n from '../../../i18n';
import { Spinner } from '../../../components/common';
import { AccountBookingIcon } from '../../../components/Account/AccountBooking';
import { BookingInfo } from '../../../components/BookTable/TabBooking/BookingHistory';
import { brandDark } from "../../../config/variables";
import axios from '../../../config/axios-mylife';

class AccountBooking extends Component {
  static navigationOptions = {
    title: i18n.t('account.bookingHistory')
  };

  state = {
    firstLoading: true,
    bookings: [],
    page: 1,
    size: 20,
    isPullRefresh: false,
    totalPage: null
  }
  componentDidMount() {
    if (this.props.user) {
      this.fetchBookings();
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.user && !this.props.user) {
      this.fetchBookings();
    }
  }
  fetchBookings = async (isLoadMore, isPullRefresh = false) => {
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
        size: prevState.size,
        con: 'bt'
      };
      const { result } = await axios.get(`reservation/history`, { params });
      this.setState({
        totalPage: result.PAGING[0].totalPage,
        bookings: isLoadMore ? [...this.state.bookings, ...result.CONTAIN] : result.CONTAIN,
        isRender: !this.state.isRender,
        isPullRefresh: false,
        firstLoading: false
      });
    } catch (error) {
      this.setState({ isPullRefresh: false });
    }
  }
  _renderItem = ({ item, index }) => (
    <View style={{ marginTop: index === 0 ? 10 : 0 }}>
      <BookingInfo booking={item} hideAction />
    </View>
  )
  render() {
    if (!this.props.user) {
      return <AccountBookingIcon action={() => this.props.navigation.navigate('BookingBrands')} />
    }
    const bookings = this.state.bookings || [];
    if (this.state.firstLoading) {
      return <Spinner backgroundColor={brandDark} />;
    }
    return (
      <View style={{ flex: 1, backgroundColor: brandDark }}>
        {!this.state.firstLoading && !bookings.length ?
          <AccountBookingIcon action={() => this.props.navigation.navigate('BookingBrands')} />
          :
          <FlatList
            onRefresh={this.fetchBookings}
            refreshing={this.state.isPullRefresh}
            keyExtractor={(item) => item.Id.toString()}
            data={bookings}
            renderItem={this._renderItem}
            onEndReached={() => this.fetchBookings(true)}
            onEndReachedThreshold={0.5}
          />
        }
      </View>
    )
  }
}

const mapStateToProps = state => ({
  user: state.auth.user
});

export default connect(mapStateToProps)(AccountBooking);
