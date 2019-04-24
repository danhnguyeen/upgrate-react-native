/* eslint-disable no-unused-vars,no-mixed-operators,max-len,import/no-extraneous-dependencies */
import React, { Component } from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  Text
} from 'react-native';
import { Slider } from 'react-native-elements';
import StarRating from 'react-native-star-rating';

import {
  brandPrimary,
  brandWarning,
  brandLight,
  textColor,
  textDarkColor,
  textH1,
  shadowColor
} from '../../../config/variables';
import i18n from '../../../i18n';

class ReviewSummary extends Component {

  render() {
    const stars = [
      this.props.data.fiveStarCount,
      this.props.data.fourStarCount,
      this.props.data.threeStarCount,
      this.props.data.twoStarCount,
      this.props.data.oneStarCount
    ];
    const total = stars.reduce((a, b) => a + b, 0);
    let avg = 0
    if (this.props.data.avgRating) {
      avg = Math.floor(this.props.data.avgRating);
      const dec = this.props.data.avgRating - avg;
      if (dec > 0) {
        avg += 0.5;
      }
    }
    return (
      <View style={styles.container} elevation={5}>
        <View style={styles.reviewContainer}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={[textH1, { color: brandPrimary }]}>
              {this.props.data.avgRating ? (this.props.data.avgRating).toFixed(1) : 0}
            </Text>
            <StarRating
              disabled
              emptyStar={'ios-star-outline'}
              fullStar={'ios-star'}
              halfStar={'ios-star-half'}
              iconSet={'Ionicons'}
              maxStars={5}
              starSize={22}
              starStyle={{ paddingHorizontal: 2 }}
              rating={avg}
              fullStarColor={brandWarning}
            />
          </View>
          <View style={{ flex: 2 }}>
            {stars.map((value, key) => (
              <View key={key} style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ marginHorizontal: 15, width: 50, justifyContent: 'center', alignItems: 'flex-start' }}>
                  <StarRating
                    disabled
                    emptyStar={'ios-star-outline'}
                    fullStar={'ios-star'}
                    halfStar={'ios-star-half'}
                    iconSet={'Ionicons'}
                    maxStars={5 - key}
                    starSize={10}
                    starStyle={{ paddingHorizontal: 1 }}
                    rating={5 - key}
                    fullStarColor={brandWarning}
                  />
                </View>
                <Slider
                  style={{ flex: 1 }}
                  trackStyle={styles.track}
                  thumbStyle={styles.thumb}
                  minimumTrackTintColor={brandWarning}
                  step={1}
                  maximumValue={total ? total : 0}
                  value={value}
                />
              </View>
            ))}
          </View>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ color: textColor }}>{total ? total : 0} {i18n.t('booking.review.rating')}</Text>
        </View>
      </View>
    );
  }
}
var styles = StyleSheet.create({
  container: {
    backgroundColor: brandLight,
    marginVertical: 10,
    padding: 15,
    marginBottom: 0,
    justifyContent: 'space-between',
    shadowColor: shadowColor,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5
  },
  reviewContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  track: {
    height: 4,
    backgroundColor: textDarkColor,
  },
  thumb: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent'
  }
});

export default ReviewSummary;
