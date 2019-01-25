import React, { Component } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Icon } from 'native-base';
import { connect } from 'react-redux';

import { inverseTextColor } from '../../config/variables';

class NotificationIcon extends Component {
  render() {
    return (
      <TouchableOpacity onPress={() => this.props.navigation.navigate('Notifications')}>
        <View>
          <Icon
            name='md-notifications'
            style={{ paddingHorizontal: 10, marginRight: 5, color: inverseTextColor, fontSize: 20 }}
          />
          {this.props.count ?
            <View style={{
              position: 'absolute',
              top: -5,
              right: 5,
              backgroundColor: 'red',
              borderRadius: 8,
              width: 18,
              height: 16,
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Text style={{ color: inverseTextColor, fontSize: 9 }}>{this.props.count}</Text>
            </View>
          : null}
        </View>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = state => {
  return {
    count: state.notifications.count
  }
}
export default connect(mapStateToProps)(NotificationIcon);
