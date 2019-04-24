import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  ImageBackground,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import FastImage from 'react-native-fast-image';
import { Avatar, Icon, Divider } from 'react-native-elements';

import RewardImg from '../../../assets/mylife-reward.png';
import { UserCards } from '../../../components/Account';
import { SiteModal, OutlineButton } from '../../../components/common';
import i18n from '../../../i18n';
import * as actions from '../../Login/auth-actions';
import { brandDark, brandLight, fontSize, brandPrimary, titleFontSize, textColor, textDarkColor } from "../../../config/variables";

class Reward extends Component {
  static navigationOptions = {
    title: i18n.t('account.mylifeRewards')
  };

  state = {
    isOpenSite: false,
    siteUrl: 'http://mlc-feeds.amagumolabs.io/ban-kiem-sao-bang-cach-nao'
  }

  componentDidMount() {
    this.props.fetchCards();
  }
  openSiteHandler = () => {
    this.setState({ isOpenSite: !this.state.isOpenSite });
  }
  render() {
    if (!this.props.user) {
      return (
        <View style={{ flex: 1, backgroundColor: brandDark }}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <View style={styles.icon}>
              <Icon type="ionicon" name="ios-star" color={textDarkColor} size={130} />
            </View>
            <Text style={{ textAlign: 'center' }}>{i18n.t('account.signinForRewards')}</Text>
            <OutlineButton
              title={i18n.t('account.siginToContinue')}
              buttonStyle={{ width: 200, marginTop: 20 }}
              onPress={() => this.props.navigation.navigate('login')}
            />
          </View>
        </View>
      );
    }
    const user = this.props.user ? this.props.user : {};
    const currentLvl = this.props.user.profile.currentLvl ? this.props.user.profile.currentLvl : {};
    return (
      <View style={styles.container}>
        {this.state.isOpenSite ?
          <SiteModal
            show
            title={i18n.t('account.bonusPolicy')}
            item={{ UrlContent: this.state.siteUrl }}
            onClose={this.openSiteHandler}
          />
          : null
        }
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.summaryContainer}>
            <ImageBackground source={RewardImg} style={styles.userInfo}>
              {user.profilePicture ?
                <FastImage
                  source={{ uri: user.profilePicture }}
                  style={[styles.avatarStyle, { width: 50, height: 50, borderRadius: 50 }]}
                />
                :
                <Avatar
                  size="medium"
                  rounded
                  icon={{ name: 'user', type: 'font-awesome' }}
                  activeOpacity={0.7}
                  containerStyle={styles.avatarStyle}
                />
              }
              <View style={{ flex: 1 }}>
                <Text style={styles.textName}>{user.username}</Text>
                <Text>{currentLvl.name}</Text>
              </View>
            </ImageBackground>
            <View style={{ padding: 15 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <View style={styles.containInfo}>
                  <Icon name='star-circle' type='material-community' size={fontSize + 4} color={brandPrimary} />
                  <Text style={{ fontSize: titleFontSize }}>{user.profile ? user.profile.currentPoint : 0}</Text>
                </View>
                <View style={styles.containInfo}>
                  <Icon name="md-gift" type='ionicon' color={brandPrimary} size={fontSize + 4} />
                  <Text style={{ fontSize: titleFontSize }}>0 Coupon</Text>
                </View>
              </View>
              <Divider style={{ backgroundColor: brandDark, marginVertical: 15 }} />
              <TouchableOpacity
                onPress={this.openSiteHandler}
                style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name='ios-star'
                  type='ionicon'
                  size={fontSize + 4}
                  color={textColor}
                  containerStyle={{ paddingRight: 15 }} />
                <Text style={{ paddingVertical: 10 }}>{i18n.t('account.bonusPolicy')}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <UserCards user={this.props.user} cards={this.props.cards} />
        </ScrollView>
      </View >
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: brandDark
  },
  scrollContainer: {
    backgroundColor: brandDark,
    marginHorizontal: 15,
    marginVertical: 10
  },
  summaryContainer: {
    marginBottom: 10,
    backgroundColor: brandLight,
    borderRadius: 5,
    overflow: 'hidden'
    // paddingBottom: 15,
    // paddingHorizontal: 15
  },
  userInfo: {
    width: '100%',
    // width: DEVICE_WIDTH - 30,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    minHeight: 115,
    padding: 15
  },
  avatarStyle: {
    marginRight: 10
  },
  textName: {
    fontSize: fontSize * 1.2,
    marginBottom: 5,
    fontWeight: 'bold'
  },
  containInfo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    width: 160, 
    height: 160, 
    borderColor: textDarkColor, 
    borderRadius: 160, 
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30
  }
});

const mapStateToProps = state => ({
  user: state.auth.user,
  cards: state.auth.cards
});

const mapDispatchToProps = dispatch => ({
  fetchCards: () => dispatch(actions.fetchCard())
});

export default connect(mapStateToProps, mapDispatchToProps)(Reward);
