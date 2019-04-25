import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StyleSheet
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';

import { fontSize, brandDark, brandPrimary, textColor } from '../../config/variables';

class BookingBrands extends Component {

  componentDidMount() {
    this.props.navigation.addListener('didFocus', () => {
      this.props.navigation.setParams({ updatedTime: new Date() });
    });
  }
  goToBookingTable = (business) => {
    this.props.navigation.navigate('BookingBrandShops', { business });
  }

  render() {
    return (
      <View style={{ backgroundColor: brandDark, flex: 1 }}>
        {!this.props.businesses.length ?
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <ActivityIndicator size="large" color={brandPrimary} />
          </View>
          :
          <ScrollView contentContainerStyle={styles.container}>
            <View style={{ flex: 1 }}>
              {this.props.businesses.map((business, idx) => (
                <TouchableOpacity
                  onPress={() => this.goToBookingTable(business)}
                  key={business.BrandID}
                  style={styles.restaurantContainer}
                >
                  <FastImage
                    source={{ uri: business.BrandImage, priority: FastImage.priority.high }}
                    style={[styles.imageBackground, { alignItems: idx % 2 ? 'flex-start' : 'flex-end' }]}
                  >
                    <View style={styles.restaurantInfo}>
                      <FastImage
                        source={{
                          uri: business.BrandLogo,
                          priority: FastImage.priority.high
                        }}
                        style={styles.logo}
                        resizeMode={FastImage.resizeMode.contain}
                      />
                      <Text style={styles.restaurantName}>{business.BrandName}</Text>
                    </View>
                  </FastImage>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'space-between',
    backgroundColor: brandDark
  },
  restaurantContainer: {
    minHeight: 135,
    flex: 1,
    width: '100%'
  },
  imageBackground: {
    flex: 1,
    width: '100%'
  },
  block: {
    backgroundColor: brandDark
  },
  bgImage: {
    position: 'relative'
  },
  restaurantInfo: {
    height: '100%',
    backgroundColor: 'rgba(33, 43, 52, 0.8)',
    width: '33%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 5,
    paddingRight: 5
  },
  restaurantName: {
    fontSize,
    textAlign: 'center',
    color: textColor,
    marginTop: 10
  },
  logo: {
    width: 80,
    height: 80
  },
  rightIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5
  }
});

const mapStateToProps = state => ({
  businesses: state.bookingTable.businesses
});

export default connect(mapStateToProps, null)(BookingBrands);
