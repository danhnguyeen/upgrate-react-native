import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import StarRating from 'react-native-star-rating';
import { Avatar } from 'react-native-elements';
import moment from 'moment';
import * as Animatable from 'react-native-animatable';

import {
  brandLight,
  brandDark,
  titleFontSize,
  fontSize,
  brandWarning
} from '../../../config/variables'
import i18n from '../../../i18n';

const reviewItem = (props) => {
  let comment = {};
  try {
    comment = JSON.parse(props.review.CommentContent);
  } catch (e) { }
  return (
    <Animatable.View animation="fadeIn" style={styles.container}>
      <View style={styles.avatarContainer}>
        {props.review.CommenterImageUrl ?
          <Avatar
            size="medium"
            source={{ uri: props.review.CommenterImageUrl }}
            imageProps={{ resizeMethod: 'resize' }}
            rounded
            activeOpacity={0.7}
            containerStyle={{ backgroundColor: brandDark }}
          />
          :
          <Avatar
            size="medium"
            rounded
            icon={{ name: 'user', type: 'font-awesome' }}
            activeOpacity={0.7}
          // containerStyle={{ backgroundColor: brandDark }}
          />
        }
      </View>
      <View style={styles.reviewContainer}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 3 }}>
            <Text style={styles.reviewer}>{props.review.CommenterName}</Text>
          </View>
          <View style={{ flex: 2, alignItems: 'flex-end' }}>
            <StarRating
              disabled
              emptyStar={'ios-star-outline'}
              fullStar={'ios-star'}
              halfStar={'ios-star-half'}
              iconSet={'Ionicons'}
              maxStars={5}
              starStyle={{ paddingHorizontal: 2 }}
              starSize={fontSize + 2}
              rating={props.review.RatingScore}
              fullStarColor={brandWarning}
            />
          </View>
        </View>
        <Text style={styles.reviewTime}>{moment(props.review.CreateDate).format('DD MMM YYYY')}</Text>
        {comment.Criteria && comment.Criteria.length ?
          <Text style={{ marginBottom: comment.Content ? 5 : 0 }}>{i18n.t('review.needChange')} {comment.Criteria.join(', ')}</Text>
          : null
        }
        { comment.Content ? <Text>{comment.Content}</Text> : null }
      </View>
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: brandLight,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center'
  },
  avatarContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  reviewContainer: {
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingRight: 0,
    flex: 7
  },
  ratingStyle: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: brandLight
  },
  reviewer: {
    fontSize: titleFontSize
  },
  reviewTime: {
    color: brandWarning,
    paddingVertical: 10
  }
});

export default reviewItem;
