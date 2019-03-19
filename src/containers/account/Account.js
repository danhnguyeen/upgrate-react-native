import React from 'react';
import { connect } from 'react-redux';
import { AsyncStorage, StyleSheet, TouchableOpacity, View, Text, Alert } from 'react-native';
import { Content, Icon, ActionSheet } from "native-base";
import LinearGradient from 'react-native-linear-gradient';
import { Avatar } from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import FCM from 'react-native-fcm';

import * as actions from '../../stores/actions';
import { _dispatchStackActions, uniqueDeviceId } from '../../util/utility';
import { NotificationIcon } from '../../components/notifications';
import { AccountItem } from '../../components/account';
import { shadow, backgroundColor, brandLight, brandPrimary, fontSize, textLightColor, inverseTextColor } from '../../config/variables';
import i18n from '../../i18n';

const TRANSLATIONS = [
  { text: i18n.t('global.cancel') },
  { text: i18n.t('account.vn') },
  { text: i18n.t('account.en') },
]
class Account extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      headerTintColor: '#fff',
      headerBackTitle: null,
      headerTitleStyle: {
        color: '#fff'
      },
      headerBackground: (
        <LinearGradient
          colors={['#2079ae', '#54ace0']}
          style={{ flex: 1 }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      ),
      headerStyle: {
        borderBottomWidth: 0
      },
      title: params && params.user ? null : i18n.t('tabs.account'),
      headerLeft: params && params.user && params.user.customer_id ? (
        <View style={{ alignItems: 'center', flexDirection: 'row' }}>
          {params.user.image_profile && params.user.image_profile !== 'http://paxsky.amagumolabs.io/images/no_image_available.jpg' ?
            <FastImage
              source={{ uri: params.user.image_profile, priority: FastImage.priority.high }}
              style={{ height: 36, width: 36, borderRadius: 50, marginHorizontal: 10 }} />
            :
            <Avatar
              containerStyle={{ marginHorizontal: 10 }}
              rounded
              overlayContainerStyle={{ backgroundColor: inverseTextColor }}
              icon={{ name: 'user', type: 'font-awesome', color: brandPrimary }}
            />
          }
          <Text style={{ color: inverseTextColor }}>{params.user ? `${params.user.last_name} ${params.user.first_name}` : ''}</Text>
        </View>
      ) : null,
      headerRight: <NotificationIcon navigation={navigation} />
    };
  };
  async componentDidMount() {
    this.props.navigation.setParams({ user: this.props.user });
    if (!this.props.isAuth) {
      _dispatchStackActions(this.props.navigation, 'navigate', 'SignIn')
    }
    this.props.navigation.addListener('didFocus', () => {
      this.props.navigation.setParams({ updatedTime: new Date(), user: this.props.user });
    });
  }
  settingLanguage = () => {
    ActionSheet.show({
      options: TRANSLATIONS,
      cancelButtonIndex: 0,
      title: i18n.t('account.language')
    },
      buttonIndex => {
        if (buttonIndex && buttonIndex !== 0) {
          this.props.setLanguage(TRANSLATIONS[buttonIndex].text);
          this.updateNotificationToken();
          this.forceUpdate();
        }
      }
    )
  }
  updateNotificationToken = async () => {
    const token = await FCM.getFCMToken().then(token => {
      return token;
    });
    if (token && this.props.isAuth) {
      this.props.updateFCMToken(this.props.user.customer_id, token, uniqueDeviceId);
    }
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
    try {
      await this.props.onLogout(this.props.user.customer_id, uniqueDeviceId);
      this.props.onResetNotificationCount();
      await AsyncStorage.removeItem('token');
      _dispatchStackActions(this.props.navigation, 'reset', 'Main', 'Account');
    }  catch (error) {
      Alert.alert(
        i18n.t('global.error'),
        error.message,
        [{ text: i18n.t('global.ok') }],
        { cancelable: false }
      );
    }
  }
  render() {
    return (
      <View style={{ flex: 1, backgroundColor }}>
        <Content padder >
          <View style={styles.container}>
            {!this.props.isAuth ?
              <TouchableOpacity onPress={() => this.props.navigation.navigate('SignIn')}>
                <LinearGradient
                  colors={['#2079ae', '#54ace0']}
                  style={{ flex: 1 }}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <View style={{ flexDirection: 'row', paddingLeft: 10, paddingVertical: 20, alignItems: 'center' }}>
                    <Icon name="user-circle-o" type="FontAwesome" style={{ color: inverseTextColor, fontSize: 25, marginRight: 10, paddingHorizontal: 10 }} />
                    <Text style={{ color: inverseTextColor, fontSize: fontSize + 1 }}>{i18n.t('account.signIn')}</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
              : null}
            {this.props.isAuth ?
              <AccountItem onPress={() => this.props.navigation.navigate('Profile')}
                title={i18n.t('account.profile.title')}
                leftIcon={<Icon name="user-circle-o" type="FontAwesome" style={[styles.icon, { fontSize: fontSize + 8 }]} />}
              />
              : null}
            <AccountItem onPress={this.termsServiceModalHandler}
              title={i18n.t('account.termsOfService')}
              leftIcon={<Icon name="md-paper" style={styles.icon} />}
            />
            <AccountItem onPress={this.settingLanguage}
              title={i18n.t('account.language')}
              leftIcon={<Icon name="md-globe" style={styles.icon} />}
              rightTitle={this.props.preferredLanguage}
            />
            {this.props.isAuth ?
              <AccountItem onPress={this.logoutHandler}
                title={i18n.t('account.logout')}
                leftIcon={<Icon name="md-log-out" style={styles.icon} />}
              />
              : null}
          </View>
        </Content>
      </View >
    )
  }
}

const styles = StyleSheet.create({
  container: {
    ...shadow,
    backgroundColor: brandLight,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 20
  },
  icon: {
    paddingHorizontal: 10,
    color: textLightColor,
    fontSize: fontSize + 10
  },
  rightIcon: {
    color: 'rgba(0, 0, 0, 0.54)',
    fontSize: fontSize + 5,
  }
})

const mapStateToProps = state => {
  return {
    preferredLanguage: state.translations.preferredLanguage,
    isAuth: state.auth.token,
    user: state.auth.user
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setLanguage: (preferredLanguage) => dispatch(actions.setLanguage(preferredLanguage)),
    onAuth: (username, password) => dispatch(actions.auth(username, password)),
    updateFCMToken: (customer_id, token, uniqueId) => dispatch(actions.updateNotificationToken(customer_id, token, uniqueId)),
    onLogout: (customer_id, uniqueId) => dispatch(actions.logout(customer_id, uniqueId)),
    onResetNotificationCount: () => dispatch(actions.fetchNotificationCountSucess(0))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Account)