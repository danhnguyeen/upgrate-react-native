/* eslint-disable no-unused-vars,import/no-extraneous-dependencies,no-mixed-operators,max-len */
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Share,
  RefreshControl
} from 'react-native';
import { connect } from 'react-redux';

import { Promotion } from '../../components/Home';
import { SiteModal } from '../../components/common';
import { ShopItem, BrandInfo } from '../../components/Brand';
import { brandDark, DEVICE_WIDTH } from '../../config/variables';
import * as actions from '../../stores/actions';
import i18n from '../../i18n';

class Brand extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('business').BrandName
    };
  };

  state = {
    selectedItem: null,
    selectedShop: null,
    isVisibleRestaurant: false,
    isVisibleShop: false,
    refreshing: false,
    business: this.props.navigation.getParam('business')
  }

  componentDidMount() {
    this.props.fetchPromotions(this.state.business.BrandID);
  }

  _onRefresh = async () => {
    this.setState({ refreshing: true });
    await this.props.fetchPromotions(this.state.business.BrandID);
    this.setState({ refreshing: false });
  }

  showDetails = (item) => {
    this.setState({ selectedItem: item });
  }

  closeModalDetails = () => {
    this.setState({ selectedItem: null });
  }

  selectShop = (shop) => {
    this.setState({ selectedShop: { ...shop }, isVisibleShop: true });
  }

  changeShop = (shop) => {
    this.setState({ selectedShop: { ...shop } });
    this.restaurantModalHandler();
  }

  hideShopDetail = () => {
    this.setState({ selectedShop: null, isVisibleShop: false });
  }

  restaurantModalHandler = () => {
    this.setState(prevState => {
      return { isVisibleRestaurant: !prevState.isVisibleRestaurant }
    });
  }
  makeABooking = (shop) => {
    this.props.onSetSelectedShop(shop, this.state.business);
    this.props.navigation.navigate('Booking', { shopId: shop.id, shopName: shop.bname });
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
            <BrandInfo picture={this.state.business.BrandLogo} shop={this.state.business} />
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
                  promotion.Type === 1 && <TouchableOpacity
                    onPress={() => this.showDetails(promotion)}
                    key={promotion.Id}
                  >
                    <Promotion promotion={promotion} />
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <View style={styles.addressesContainer}>
              {this.state.business ? this.state.business.contain.map(shop => (
                <TouchableOpacity
                  onPress={() => this.makeABooking(shop)}
                  key={shop.bid}
                >
                  <ShopItem key={shop.id} shop={shop} />
                </TouchableOpacity>
              )) : null}
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: brandDark
  },
  addressesContainer: {
    width: DEVICE_WIDTH,
    flex: 1,
    marginTop: 15
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
    flex: 1,
    backgroundColor: brandDark,
    flexDirection: 'column',
    alignItems: 'center'
  },
  scrollView: {
    flex: 1,
    paddingBottom: 45
  }
});

const mapStateToProps = state => ({
  promotions: state.homeState.promotionsForBrand
});

const mapDispatchToProps = dispatch => ({
  onSetSelectedShop: (selectedShop, business) => dispatch(actions.setSelectedShop(selectedShop, business)),
  fetchPromotions: (brandId) => dispatch(actions.fetchPromotionsNews(brandId))
});

export default connect(mapStateToProps, mapDispatchToProps)(Brand);
