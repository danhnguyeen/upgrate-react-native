import React from 'react';
import { connect } from 'react-redux';
import { AsyncStorage, StyleSheet, TouchableOpacity, View, Text, Alert } from 'react-native';
import { Content, Icon, ActionSheet } from "native-base";
import LinearGradient from 'react-native-linear-gradient';
import { Avatar } from 'react-native-elements';
import FastImage from 'react-native-fast-image';

import * as actions from './auth-actions';
import { _dispatchStackActions } from '../../util/utility';
import { NotificationIcon } from '../../components/notifications';
import { AccountItem } from '../../components/account';
import { shadow, backgroundColor, brandLight, brandPrimary, fontSize, textLightColor, inverseTextColor } from '../../config/variables';
import i18n from '../../i18n';

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
      title: params && params.user ? null : i18n.t('tabs.notifications'),
      headerLeft: params && params.user ? (
        <View style={{ alignItems: 'center', flexDirection: 'row' }}>
          {params.user.image_profile && props.user.image_profile !== 'http://paxsky.amagumolabs.io/images/no_image_available.jpg' ?
            <FastImage
              source={{ uri: params.user.image_profile, priority: FastImage.priority.high }}
              style={{ height: 36, width: 36, borderRadius: 50, marginHorizontal: 10 }} />
            :
            <Avatar
              containerStyle={{ marginHorizontal: 10 }}
              rounded
              placeholderStyle={{ backgroundColor: inverseTextColor }}
              icon={{ name: 'user', type: 'font-awesome', color: brandPrimary }}
            />
          }
          <Text style={{ color: inverseTextColor }}>{`${params.user.last_name} ${params.user.first_name}`}</Text>
        </View>
      ) : null,
      headerRight: <NotificationIcon navigation={navigation} />
    };
  };
  state = {
    configLanguage: ''
  }
  componentDidMount() {
    this.props.navigation.setParams({ user: this.props.user });
    if (!this.props.isAuth) {
      _dispatchStackActions(this.props.navigation, 'navigate', 'SignIn')
    }
    this.props.navigation.addListener('didFocus', () => {
      this.props.navigation.setParams({ updatedTime: new Date(), user: this.props.user });
    });
    this.props.navigation.addListener('willFocus', () => {
      this.getAsyncStorage();
    });
  }
  getAsyncStorage = async () => {
    await AsyncStorage.getItem('language', (err, result) => {
      if (result) {
        const configLanguage = JSON.parse(result)
        if (configLanguage) {
          this.setState({ configLanguage })
        }
      }
    })
  }
  settingLanguage = () => {
    ActionSheet.show({
      options: [
        i18n.t('global.cancel'), i18n.t('global.default'),
        i18n.t('account.vn'), i18n.t('account.en')
      ],
      cancelButtonIndex: 0,
      destructiveButtonIndex: 1,
      title: i18n.t('account.language')
    },
      buttonIndex => {
        console.log(buttonIndex)
        if (buttonIndex !== 0 && buttonIndex) {
          // AsyncStorage.setItem('language', );
          // Linking.openURL(BUTTONS[buttonIndex].url)
        }
      }
    )
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
    _dispatchStackActions(this.props.navigation, 'reset', 'Main', 'Account');
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
                leftIcon={<Icon name="md-person" style={styles.icon} />}
              />
              : null}
            <AccountItem onPress={this.termsServiceModalHandler}
              title={i18n.t('account.termsOfService')}
              leftIcon={<Icon name="md-document" style={styles.icon} />}
            />
            <AccountItem onPress={this.settingLanguage}
              title={i18n.t('account.language')}
              leftIcon={<Icon name="language" style={styles.icon} type={'MaterialIcons'} />}
              rightTitle={this.state.language}
              rightIcon={<Icon name="arrow-forward" style={styles.rightIcon} />}
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
    isAuth: state.auth.token,
    user: state.auth.user
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (username, password) => dispatch(actions.auth(username, password)),
    onLogout: () => dispatch(actions.logout())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Account)