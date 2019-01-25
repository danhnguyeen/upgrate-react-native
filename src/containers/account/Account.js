import React from 'react';
import { connect } from 'react-redux';
import { AsyncStorage, StyleSheet, TouchableOpacity, View, Text, Alert } from 'react-native';
import { Content, Icon } from "native-base";
import LinearGradient from 'react-native-linear-gradient';

import * as actions from './auth-actions';
import { _dispatchStackActions } from '../../util/utility';
import { AccountItem } from '../../components/account';
import { shadow, backgroundColor, brandLight, textColor, fontSize, textLightColor, inverseTextColor } from '../../config/variables';
import i18n from '../../i18n';

class Account extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this._isMounted = false
  }
  componentDidMount() {
    if (!this.props.isAuth) {
      _dispatchStackActions(this.props.navigation, 'navigate', 'SignIn')
    }
    this.props.navigation.addListener('willFocus', () => {
      setTimeout(() => {
        this.props.navigation.setParams({ updatedTime: new Date() });
      }, 1000);
    });
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
                  colors={['#072f6a', '#0d59ca']}
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