import * as React from 'react';
import {
  View,
  StyleSheet
} from 'react-native';
import moment from 'moment';

import {
  brandLight,
  brandDark
} from '../../../config/variables';
import { BookingForm, BookingHistory } from './TabBooking';

class BookingTable extends React.Component {
  state = {
    data: null,
    isEditBooking: false
  };
  shouldComponentUpdate(nextProps) {
    if (nextProps.bookingFocused
      || nextProps.bookingFocused !== this.props.bookingFocused) {
      return true;
    }
    return false;
  }
  setUpdateBooking = (booking) => {
    const data = {
      RID: booking.Id,
      NumberOfAdult: booking.NumberOfAdult,
      NumberOfChildren: booking.NumberOfChildren,
      ReserStatusByNumber: booking.ReserStatusByNumber,
      ReserDescription: booking.ReserDescription,
      CurrentVersion: booking.CurrentVersion,
      date: moment(booking.BookingFromDate).format('DD MMM YYYY'),
      time: moment(booking.BookingFromDate, 'YYYY-MM-DDTHH:mm:ss').format('HH:mm')
    };
    this.setState({ data });
    this.modalHandler();
  }
  submitedHandler = () => {
    this.setState({
      isEditBooking: !this.state.isEditBooking,
      data: null
    });
    this.refreshHistory();
  }
  refreshHistory = (isFromAbout) => {
    this.history.fetchBookingHistory(null, null, isFromAbout);
  }
  modalHandler = () => {
    if (!this.props.user) {
      return this.props.navigation.navigate('login');
    }
    const data = this.state.isEditBooking ? { data: null } : null
    this.setState({
      ...data, 
      isEditBooking: !this.state.isEditBooking
    });
  }
  render() {
    return (
      <View style={styles.container}>
        {this.state.isEditBooking ?
          (
            <BookingForm
              show
              selectedShop={this.props.selectedShop}
              data={this.state.data}
              submited={this.submitedHandler}
              handleClose={this.modalHandler}
              focused={true}
            />
          )
          : null}
        <BookingHistory
          openBookTable={this.modalHandler}
          ref={ref => this.history = ref}
          user={this.props.user}
          setBooking={this.setUpdateBooking}
          selectedShop={this.props.selectedShop}
          focused={this.props.bookingFocused}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: brandDark
  },
  buttonContainer: {
    backgroundColor: brandLight, 
    marginVertical: 10, 
    alignItems: 'center'
  }
});

export default BookingTable;

