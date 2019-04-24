import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Text,
  TouchableOpacity,
  Linking
} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Icon } from 'react-native-elements';
import { textColor, brandLight, brandPrimary, fontSize, shadowColor } from '../../../config/variables';

class Map extends Component {
  state = {
    tracksViewChanges: true
  }
  stopTrackingMarker = () => {
    setTimeout(() => {
      this.setState(() => ({
        tracksViewChanges: false,
      }));
    });
  }
  render () {
    return (
      <View style={styles.container} elevation={5}>
        <MapView
          style={{ flex: 1, minHeight: 130 }}
          scrollEnabled={false}
          provider={PROVIDER_GOOGLE}
          region={{
            latitude: this.props.selectedShop.blat ? this.props.selectedShop.blat : 10.767932254302465,
            longitude: this.props.selectedShop.blng ? this.props.selectedShop.blng : 106.6927340513601,
            latitudeDelta: 0.0009, 
            longitudeDelta: 0.0002
          }}
          liteMode
          cacheEnabled={Platform.OS === 'android'}
        >
          { this.props.selectedShop.blat ? 
            <MapView.Marker
              coordinate={{
                latitude: this.props.selectedShop.blat,
                longitude: this.props.selectedShop.blng
              }}
              title={this.props.selectedShop.name}
              description={this.props.selectedShop.address}
              // tracksViewChanges={this.state.tracksViewChanges}
              // image={this.props.selectedShop.type === 'coffee' ? markerIcon : sushiIcon}
            /> : null
          }
        </MapView>
        <View style={styles.addressContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon 
              name='map-marker'
              type='material-community'
              color={textColor}
              size={fontSize}
            />
            <Text style={{ paddingLeft: 5 }}>{this.props.selectedShop.badd}</Text>
          </View>
          <View style={ styles.phoneContainer }>
            <TouchableOpacity onPress={() => Linking.openURL(`tel:${this.props.selectedShop.bphone}`)} style={ styles.phoneTouch }>
              <Icon 
                name='old-phone'
                type='entypo'
                color={brandPrimary}
                size={fontSize}
              />
              <Text style={styles.phoneNumber}>{ this.props.selectedShop.bphone }</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
    shadowColor: shadowColor,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },  
  addressContainer: {
    backgroundColor: brandLight, 
    width: '100%', 
    flex: 1, 
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5
  },
  phoneTouch: {
    flexDirection: 'row', 
    alignItems: 'center'
  },
  phoneNumber: {
    color: brandPrimary,
    bottom: 0,
    paddingLeft: 5
  }
});

export default Map;
