/* eslint-disable no-return-assign */
import React, { Component } from 'react';
import { View, TouchableWithoutFeedback, FlatList } from 'react-native';
import { Icon, Badge } from 'react-native-elements';
import moment from 'moment';

import {
  brandWarning,
  brandLight,
  textColor,
  textDarkColor,
  inverseTextColor,
  platform
} from '../../../../config/variables';

class selectTime extends Component {
  shouldComponentUpdate(nextProps) {
    if (!this.props.times.length
      || nextProps.data.date !== this.props.data.date
      || nextProps.data.time !== this.props.data.time) {
      return true;
    }
    return false;
  };
  componentDidMount () {
    this.scrollToItem(this.props.data.time, (platform === 'ios' ? 800 : 1100));
  }
  componentDidUpdate (prevProps) {
    if (!this.props.times.length
      || prevProps.data.date !== this.props.data.date
      || prevProps.data.time !== this.props.data.time) {
      this.scrollToItem(this.props.data.time, 100);
    }
  }
  scrollToItem(time, timeRange) {
    setTimeout(() => {
      const itemIndex = this.props.times.indexOf(time);
      if (itemIndex === -1 || !this.myScroll) {
        return;
      }
      if (itemIndex >= this.props.times.length - 3) {
        this.myScroll.scrollToEnd({
          animated: true
        });
      } else {
        this.myScroll.scrollToIndex({
          animated: true,
          index: itemIndex,
          viewPosition: 0.5
        });
      }
    }, timeRange);
  }
  _renderItem = ({ item }) => {
    const disabled = moment(`${this.props.data.date} ${item}:59`, 'DD MMM YYYY HH:mm:ss') < moment() ? true : false;
    return (
      <Badge
        containerStyle={[styles.badgeStyle, {
          backgroundColor: this.props.data.time === item ? (disabled ? 'rgba(255, 255, 255, 0.4)' : textColor) : 'transparent',
          opacity: disabled ? 0.9 : 1,
          borderColor: disabled ? '#4d4d4d' : '#a6a6a6',
          borderWidth: (this.props.data.time === item ? 0 : 1)
        }]}
        textStyle={{ color: (this.props.data.time === item ? inverseTextColor : (disabled ? '#4d4d4d' : textColor)) }}
        value={item}
        onPress={() => disabled ? {} : this.props.changeDateTime(item, 'time')}
      />
    );
  };
  render() {
    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback>
          <Icon
            name='ios-arrow-back'
            type='ionicon'
            color={brandWarning}
            containerStyle={styles.iconStyle}
          />
        </TouchableWithoutFeedback>
        <FlatList
          onScrollToIndexFailed={() => { }}
          extraData={this.props.data}
          horizontal
          ref={ref => this.myScroll = ref}
          data={this.props.times}
          renderItem={this._renderItem}
          keyExtractor={(item) => this.props.data.date + item}
        >
        </FlatList>
        <TouchableWithoutFeedback>
          <Icon
            name='ios-arrow-forward'
            type='ionicon'
            color={brandWarning}
            containerStyle={styles.iconStyle}
          />
        </TouchableWithoutFeedback>
      </View>
    );
  }
}
const styles = {
  container: {
    flex: 1,
    backgroundColor: brandLight,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  iconStyle: {
    paddingHorizontal: 10
  },
  badgeStyle: {
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: textDarkColor
  }
};

export default selectTime;
