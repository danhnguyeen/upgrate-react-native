/* eslint-disable no-unused-vars,import/no-extraneous-dependencies,no-mixed-operators,max-len */
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  AppState
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import FCM from "react-native-fcm";
import DeviceInfo from 'react-native-device-info';

import { Icon } from 'react-native-elements';
import { Promotion, News, SmallBox, BrandBox } from '../../components/Home';
import { SiteModal } from '../../components/common';
import { brandDark, brandPrimary } from '../../config/variables';
import * as actions from '../../stores/actions';
import i18n from '../../i18n';

class Home extends Component {
  state = {
    selectedItem: null,
    refreshing: false,
    appState: AppState.currentState
  }

  componentDidMount() {
    this.props.navigation.addListener('didFocus', () => {
      this.props.fetchPromotions();
      this.props.onFetchBusiness();
      this.props.navigation.setParams({ updatedTime: new Date() });
    });
    AppState.addEventListener('change', this._handleAppStateChange);
    if (this.props.isAuth) {
      this.getUserProfile();
      this.updateNotificationToken();
      this.props.getNotificationCount();
    }
  }
  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }
  componentWillReceiveProps(nextProps) {
    // listen and call when the user singed in
    if (nextProps.isAuth && !this.props.isAuth) {
      this.getUserProfile();
      this.updateNotificationToken();
      this.props.getNotificationCount();
    }
  }
  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      // if the App has come to the foreground, call refresh the promotion
      if (this.props.isAuth) {
        this.props.getNotificationCount();
        this.getUserProfile();
      }
      if (this.props.navigation.isFocused()) {
        this.props.fetchPromotions();
      }
    }
    this.setState({ appState: nextAppState });
  }
  getUserProfile = async() => {
    const result = await this.props.getUser();
    if (result.TicketData && result.TicketData.branch) {
      this.props.navigation.navigate('Review', { billData: result.TicketData});
    }
  }
  updateNotificationToken = async () => {
    try {
      await FCM.requestPermissions({ badge: true, sound: true, alert: true });
    } catch (e) { }

    const token = await FCM.getFCMToken().then(token => {
      return token;
    });
    console.log(token)
    if (token) {
      const uniqueId = DeviceInfo.getUniqueID();
      const deviceName = DeviceInfo.getModel();
      this.props.updateFCMToken(token, uniqueId, deviceName);
    }
  }
  _onRefresh = async () => {
    try {
      this.setState({ refreshing: true });
      await Promise.all([this.props.fetchPromotions(), this.props.onFetchBusiness()]);
      this.setState({ refreshing: false });
    } catch(error) {
      this.setState({ refreshing: false });
    }
  }

  showDetails = (item) => {
    this.setState({
      selectedItem: item
    });
  }

  closeModalDetails = () => {
    this.setState({
      selectedItem: null
    });
  }

  goToBrand = (business) => {
    this.props.navigation.push('Brand', { business });
  }
  goToScreen = (screen) => {
    this.props.navigation.navigate(screen);
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.selectedItem ?
          <SiteModal
            show
            title={this.state.selectedItem.name}
            item={this.state.selectedItem}
            onClose={this.closeModalDetails}
          />
          : null
        }
        <View style={styles.containerScrollView}>
          <ScrollView
            style={styles.scrollView}
            horizontal={false}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              <View style={{ flexDirection: 'row', paddingHorizontal: 10 }}>
                {this.props.businesses.map((business) => (
                  <TouchableOpacity
                    onPress={() => this.goToBrand(business)}
                    key={business.BrandID}
                    elevation={5}
                  >
                    <BrandBox
                      title={i18n.t('home.point')}
                      icon={
                        <FastImage style={{ width: '100%', height: 65 }}
                          resizeMode={FastImage.resizeMode.contain}
                          source={{ uri: business.BrandLogo, priority: FastImage.priority.high }} />
                      }
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <View style={{ flexDirection: 'row' }}>
              <SmallBox
                onPress={() => this.goToScreen('QRCode')}
                style={{ marginLeft: 15 }}
                title={i18n.t('home.point')}
                icon={<Icon name="qrcode" type='material-community' color={brandPrimary} size={36} />}
              />
              <SmallBox
                onPress={() => Alert.alert(i18n.t('global.comingSoon'))}
                icon={<Icon name="ios-gift" type='ionicon' color={brandPrimary} size={36} />}
                title={i18n.t('home.coupon')} />
              <SmallBox
                onPress={() => this.goToScreen('BookingBrands')}
                style={{ marginRight: 15 }}
                icon={<Icon name="md-restaurant" type='ionicon' color={brandPrimary} size={36} />}
                title={i18n.t('home.bookTable')} />
            </View>
            {this.props.promotions.length ?
              <View style={[styles.groupContainer, { paddingTop: 0 }]}>
                <Text style={{ fontSize: 17 }}>{i18n.t('home.forYou')}</Text>
              </View>
              : null}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              <View style={styles.promotionContainer}>
                {this.props.promotions.map((promotion) => (
                  <TouchableOpacity
                    onPress={() => this.showDetails(promotion)}
                    key={promotion.Id}
                  >
                    <Promotion promotion={promotion} />
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <View style={styles.groupContainer}>
              <Text style={{ fontSize: 17 }}>{i18n.t('home.news')}</Text>
            </View>
            <View style={styles.newsContainer}>
              {this.props.news.map(item => (
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => this.showDetails(item)}
                  key={item.Id}
                >
                  <News news={item} />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: brandDark
  },
  newsContainer: {
    marginLeft: 15,
    marginRight: 15
  },
  groupContainer: {
    paddingLeft: 15,
    paddingBottom: 10,
    paddingTop: 10,
    width: '100%'
  },
  promotionContainer: {
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10
  },
  imageContainer: {
    flex: 1,
    width: '100%'
  },
  imageBackground: {
    flex: 1
  },
  containerScrollView: {
    flex: 2,
    backgroundColor: brandDark,
    flexDirection: 'column',
    alignItems: 'center'
  },
  scrollView: {
    paddingBottom: 45
  }
});

const mapStateToProps = state => ({
  isAuth: state.auth.token,
  restaurants: state.bookingTable.restaurants,
  promotions: state.homeState.promotions,
  news: state.homeState.news,
  businesses: state.bookingTable.businesses
});

const mapDispatchToProps = dispatch => ({
  fetchPromotions: () => dispatch(actions.fetchPromotionsNews()),
  onFetchBusiness: () => dispatch(actions.fetchBusiness()),
  getNotificationCount: () => dispatch(actions.fetchNotificationCount()),
  getUser: () => dispatch(actions.getProfile()),
  updateFCMToken: (token, uniqueId, deviceName) => dispatch(actions.updateNotificationToken(token, uniqueId, deviceName))
});


export default connect(mapStateToProps, mapDispatchToProps)(Home);
