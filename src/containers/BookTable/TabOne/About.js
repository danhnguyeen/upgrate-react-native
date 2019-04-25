import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ScrollView
} from 'react-native';
import { connect } from 'react-redux';

import { brandDark } from '../../../config/variables';
import { BookingForm } from './TabBooking';
import { Map, Details, ButtonBooking, Slider } from '../../../components/BookTable/About';

class About extends Component {
  state = {
    isEditBooking: false
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (!this.props.selectedShop
      || nextState.isEditBooking !== this.state.isEditBooking
      || (nextProps.selectedShop && nextProps.selectedShop.bid !== this.props.selectedShop.bid)) {
      return true;
    }
    return false;
  }
  submitedHandler = () => {
    this.setState({ isEditBooking: !this.state.isEditBooking }, this.props.changeTab(2));
  }
  modalHandler = () => {
    if (!this.props.user) {
      this.props.navigation.navigate('login');
    } else {
      this.setState({ isEditBooking: !this.state.isEditBooking });
    }
  }
  render() {
    return (
      <View style={styles.container}>
        {this.state.isEditBooking ?
          <BookingForm
            show={this.state.isEditBooking}
            selectedShop={this.props.selectedShop}
            submited={this.submitedHandler}
            handleClose={this.modalHandler}
          />
          : null}
        <ScrollView style={{ flexGrow: 1 }}>
          <View style={styles.body}>
            <Slider autoplay={this.props.focused} selectedShop={this.props.selectedShop} />
            <Details selectedShop={this.props.selectedShop} />
            <Map selectedShop={this.props.selectedShop} />
            { this.props.selectedShop.IsAllowBooking ? <ButtonBooking clicked={this.modalHandler} /> : null }
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: brandDark,
    justifyContent: 'center'
  },
  body: {
    flex: 1,
    backgroundColor: brandDark,
    paddingTop: 10
  },
  content: {
    paddingVertical: 16,
  },
  picker: {
    alignSelf: 'stretch',
    backgroundColor: brandDark,
    paddingHorizontal: 15,
    paddingVertical: 8,
    margin: 0,
    borderRadius: 0
  },
  pickerText: {
    color: 'white'
  }
});

const mapStateToProps = state => ({
  user: state.auth.user,
  shops: state.bookingTable.shopByTypes,
  deviceWidth: state.appState.deviceWidth,
  deviceHeight: state.appState.deviceHeight,
});

export default connect(mapStateToProps, null)(About);
