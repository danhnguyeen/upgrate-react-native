import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Share, StyleSheet, Alert, ScrollView } from 'react-native';
import { Icon } from 'react-native-elements'
import { AsyncStorage } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';

import i18n from '../../i18n';
import * as actions from '../../stores/actions';
import { SiteModal } from '../../components/common';
import { AccountItem } from '../../components/Account';
import { fontFamily, fontSize, brandDark, textColor } from '../../config/variables';

class Account extends Component {
  state = {
    isOpenModal: false,
    modalType: null,
    termsService: 'http://mlc-feeds.amagumolabs.io/dieu-khoan-su-dung',
    userManual: 'http://mlc-feeds.amagumolabs.io/huong-dan-su-dung-ung-dung',
    bonusPolicy: 'http://mlc-feeds.amagumolabs.io/ban-kiem-sao-bang-cach-nao'
  }
  componentDidMount() {
    this.props.navigation.addListener('didFocus', () => {
      this.props.navigation.setParams({ updatedTime: new Date() });
    });
  }
  gotoScreen = (screenName) => {
    this.props.navigation.navigate(screenName);
  }
  logoutHandler = () => {
    Alert.alert(
      i18n.t('global.confirm'),
      i18n.t('account.areYouSureLogOut'),
      [
        { text: i18n.t('global.cancel'), style: 'cancel' },
        { text: i18n.t('global.ok'), onPress: this.onLogout },
      ],
      { cancelable: false }
    )
  }

  onLogout = async () => {
    await AsyncStorage.removeItem('token');
    await this.props.onLogout();
    // const resetAction = StackActions.reset({
    //   index: 0,
    //   key: null,
    //   actions: [NavigationActions.navigate({ routeName: 'login' })],
    // });
    // this.props.navigation.dispatch(resetAction);
  }
  modalHandler = (modalType) => {
    this.setState({ 
      isOpenModal: !this.state.isOpenModal, 
      modalType: !this.state.isOpenModal ? modalType : null 
    });
  }

  render() {
    let title = i18n.t('account.termsOfService');
    if (this.state.modalType === 'userManual') {
      title = i18n.t('account.userManual');
    }
    if (this.state.modalType === 'bonusPolicy') {
      title = i18n.t('account.bonusPolicy');
    }
    const user = this.props.user;
    return (
      <ScrollView style={styles.container}>
        {this.state.isOpenModal ?
          <SiteModal
            show
            title={title}
            item={{ UrlContent: this.state[this.state.modalType] }}
            onClose={this.modalHandler}
          />
          : null
        }
        { user ? 
          <AccountItem onPress={() => this.gotoScreen('Profile')}
            title={i18n.t('account.profile.title')}
            leftIcon={<Icon name="user" type='feather' color={textColor} size={fontSize + 6} />}
          />
          : null}
        <AccountItem onPress={() => this.gotoScreen('Reward')}
          title={i18n.t('account.mylifeRewards')}
          leftIcon={<Icon name="md-gift" type='ionicon' color={textColor} size={fontSize + 6} />}
        />
        <AccountItem onPress={() => this.gotoScreen('AccountBooking')}
          title={i18n.t('account.bookingHistory')}
          leftIcon={<Icon name="md-restaurant" type='ionicon' color={textColor} size={fontSize + 6} />}
        />
        <AccountItem onPress={() => this.gotoScreen('Accumulation')}
          title={i18n.t('account.accumulationHistory')}
          leftIcon={<Icon name="calendar-star" type='material-community' color={textColor} size={fontSize + 6} />}
        />
        <AccountItem onPress={() => this.modalHandler('bonusPolicy')}
          title={i18n.t('account.bonusPolicy')}
          leftIcon={<Icon name="ios-star" type='ionicon' color={textColor} size={fontSize + 6} />}
        />
        <AccountItem onPress={() => this.modalHandler('termsService')}
          title={i18n.t('account.termsOfService')}
          leftIcon={<Icon name="file-document-outline" type='material-community' color={textColor} size={fontSize + 6} />}
        />
        <AccountItem onPress={() => this.modalHandler('userManual')}
          title={i18n.t('account.userManual')}
          leftIcon={<Icon name="text-document" type='entypo' color={textColor} size={fontSize + 6} />}
        />
        { user ? 
          <AccountItem onPress={this.logoutHandler}
            title={i18n.t('account.logout')}
            leftIcon={<Icon name="log-out" type='feather' color={textColor} size={fontSize + 6} />}
          />
          : null}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    // backgroundColor: '#E9E9EF'
    backgroundColor: brandDark
  },
  titleStyle: {
    fontFamily,
    fontSize: fontSize + 1,
    // color: inverseTextColor
  }
});

const mapStateToProps = state => {
  return {
    user: state.auth.user
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onLogout: () => dispatch(actions.logout())
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Account);