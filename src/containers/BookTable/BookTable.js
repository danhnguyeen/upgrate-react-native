import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';

import { About, Menu, BookingTable, Review } from './TabOne';
import { DEVICE_WIDTH, brandDark, brandLight, brandPrimary, fontSize } from '../../config/variables';
import i18n from '../../i18n';

const routes = {
  withBooking: [
    { key: 'about', title: i18n.t('booking.tabs.about') },
    { key: 'menu', title: i18n.t('booking.tabs.menu') },
    { key: 'bookingTable', title: i18n.t('booking.tabs.bookTable') },
    { key: 'review', title: i18n.t('booking.tabs.review') }
  ],
  withoutBooking: [
    { key: 'about', title: i18n.t('booking.tabs.about') },
    { key: 'menu', title: i18n.t('booking.tabs.menu') },
    { key: 'review', title: i18n.t('booking.tabs.review') }
  ]
};

class BookTable extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('shopName')
    }
  };
  state = {
    index: 0,
    routes: this.props.selectedShop.IsAllowBooking ? routes.withBooking : routes.withoutBooking,
    isVisibleRestaurant: false
  };
  componentWillReceiveProps (nextProps) {
    if (nextProps.selectedShop.bid != this.props.selectedShop.bid) {
      this.setState({
        index: 0,
        routes: nextProps.selectedShop.IsAllowBooking ? routes.withBooking : routes.withoutBooking 
      });
    }
  }
  handleIndexChange = (index) => {
    this.setState({ index });
  }
  renderTabBar = props => (
    <TabBar
      {...props}
      scrollEnabled
      indicatorStyle={styles.indicator}
      style={styles.tabbar}
      tabStyle={[styles.tab, { width: Math.max(120, DEVICE_WIDTH/this.state.routes.length)}]}
      labelStyle={styles.label}
    />
  );
  renderScene = ({ route }) => {
    switch (route.key) {
      case 'about':
        return (
          <About
            focused={this.state.index === 0}
            selectedShop={this.props.selectedShop}
            navigation={this.props.navigation}
            changeTab={this.handleIndexChange}
          />
        );
      case 'menu':
        return (
          <Menu
            selectedShop={this.props.selectedShop}
            menuFocused={this.state.index === 1}
            user={this.props.user}
          />
        );
      case 'bookingTable':
        return (
          <BookingTable
            selectedShop={this.props.selectedShop}
            navigation={this.props.navigation}
            bookingFocused={this.state.index === 2}
            user={this.props.user}
          />
        );
      case 'review':
        return (
          <Review
            selectedShop={this.props.selectedShop}
            reviewFocused={this.state.index === ( this.props.selectedShop.IsAllowBooking ? 3 : 2 )}
            user={this.props.user}
          />
        );
      default:
        return null;
    }
  };

  render() {
    const initialLayout = {
      height: 0,
      width: DEVICE_WIDTH,
    };
    return (
      <View style={styles.container}>
        <TabView
          style={[styles.container, this.props.style]}
          navigationState={this.state}
          renderScene={this.renderScene}
          renderTabBar={this.renderTabBar}
          onIndexChange={this.handleIndexChange}
          initialLayout={initialLayout}
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
  imageBackground: {
    top: 0,
    left: 0,
    width: '100%',
    height: '26%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoContainer: {
    backgroundColor: 'rgba(33, 43, 52, 0.8)',
    borderRadius: 1,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoImage: {
    width: 80,
    height: 80
  },
  tabbar: {
    backgroundColor: brandLight,
    height: 48
  },
  tab: {
    margin: 0,
    padding: 0,
    width: 120,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center'
  },
  indicator: {
    backgroundColor: brandPrimary,
  },
  label: {
    color: '#fff',
    fontSize,
  },
});

const mapStateToProps = state => ({
  user: state.auth.user,
  selectedShop: state.bookingTable.selectedShop,
  selectedBusiness: state.bookingTable.selectedBusiness
});

export default connect(mapStateToProps)(BookTable);


