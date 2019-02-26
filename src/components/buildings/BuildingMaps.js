import React from 'react';
import MapView from 'react-native-maps';
import { platform } from '../../config/variables';

const BuildingMaps = (props) => (
      <MapView
        style={{ flex: 1, minHeight: 120, height: props.height ? props.height : 120 }}
        scrollEnabled={false}
        region={{
          latitude: props.building.lat ? parseFloat(props.building.lat) : 10.767932254302465,
          longitude: props.building.long ? parseFloat(props.building.long) : 106.6927340513601,
          latitudeDelta: 0.0009,
          longitudeDelta: 0.0002
        }}
        liteMode
        cacheEnabled={platform === 'android'}
      >
        {props.building.lat ?
          <MapView.Marker
            coordinate={{
              latitude: parseFloat(props.building.lat),
              longitude: parseFloat(props.building.long)
            }}
          /> : null
        }
      </MapView>
);
export default BuildingMaps;
