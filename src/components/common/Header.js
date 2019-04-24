import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Avatar, Icon } from 'react-native-elements'
import FastImage from 'react-native-fast-image';
import { textColor, brandLight, titleFontSize, brandPrimary, brandDanger, textDarkColor } from '../../config/variables';
import i18n from '../../i18n';

class Header extends Component {
  state = {
    showModalNotification: false,
    listNotification: [],
    isFetchingNotification: false,
  };

  handleOpenModle = () => {
    this.props.navigation.navigate('Notification');
  };

  render() {
    const notifyCationCount = this.props.notifyCationCount;
    const user = this.props.user;
    const profile = this.props.user && this.props.user.profile ? this.props.user.profile : {};
    return (
      <View style={styles.container}>
        {user ?
          <TouchableOpacity
            style={styles.infoContainer}
            onPress={() => this.props.navigation.navigate('Account')}
          >
            {user.profilePicture ?
              <FastImage source={{ uri: user.profilePicture }} style={[styles.avatarStyle, { width: 36, height: 36, borderRadius: 50 }]} />
              :
              <Avatar
                size="small"
                rounded
                icon={{ name: 'user', type: 'font-awesome' }}
                activeOpacity={0.7}
                containerStyle={styles.avatarStyle}
              />
            }
            <View style={{ justifyContent: 'center' }}>
              <Text style={[styles.textStyle, { fontSize: titleFontSize }]}>{user.username}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[styles.textStyle, { fontSize: 15 }]}>{profile.currentPoint}</Text>
                <Icon
                  size={15}
                  name='star-circle'
                  type='material-community'
                  iconStyle={{ paddingLeft: 5, paddingRight: 10 }}
                  color={brandPrimary} />
              </View>
            </View>
          </TouchableOpacity>
          :
          <TouchableOpacity
            style={styles.infoContainer}
            onPress={() => this.props.navigation.navigate('login')}
          >
            <Avatar
              size="small"
              rounded
              icon={{ name: 'user', type: 'font-awesome' }}
              activeOpacity={0.7}
              containerStyle={styles.avatarStyle}
            />
            <View style={{ justifyContent: 'center' }}>
              <Text style={[styles.textStyle, { fontSize: titleFontSize }]}>{i18n.t('login.signIn')}</Text>
            </View>
          </TouchableOpacity>  
        }
        <TouchableOpacity
          style={styles.containerNotify}
          onPress={() => this.handleOpenModle()}
        >
          <Icon
            size={20}
            name='md-notifications'
            type='ionicon'
            iconStyle={{ paddingLeft: 5, paddingRight: 10 }}
            color={textColor} />
          {notifyCationCount > 0 ? (<View style={styles.notifyBadge}>
            <Text style={[styles.textStyle, { fontSize: 9 }]}>{notifyCationCount > 99 ? '99+' : notifyCationCount}</Text>
          </View>) : null}
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10
  },
  infoContainer: {
    flex: 1,
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: brandLight
  },
  avatarStyle: {
    marginLeft: 10,
    marginRight: 10
  },
  textStyle: {
    color: textColor,
  },
  containerNotify: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  notifyBadge: {
    position: 'absolute',
    top: 3,
    right: 0,
    backgroundColor: brandDanger,
    borderRadius: 50,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    notifyCationCount: state.notificationState.count
  }
};

export default connect(mapStateToProps)(Header);

