import React from 'react';
import { StyleSheet, View, TextInput, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import StarRating from 'react-native-star-rating';
import moment from 'moment';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Popup, OutlineButton } from '../../../components/common';
import {
  brandPrimary,
  brandLight,
  brandWarning,
  textColor,
  titleFontSize,
  textDarkColor,
  DEVICE_HEIGTH,
  platform
} from '../../../config/variables';
import i18n from '../../../i18n';

const reviewForm = (props) => {
  return (
    <Popup
      visible={props.isVisible}
      onRequestClose={props.onClose}
      title={i18n.t('booking.review.addYourReview').toUpperCase()}
      bodyStyle={{ maxHeight: DEVICE_HEIGTH - 100 }}
    >
      <KeyboardAwareScrollView
        style={{ width: '100%' }}
        scrollEnabled={true}
        enableOnAndroid={true}
        keyboardShouldPersistTaps={platform === 'ios' ? 'never' : 'always'}
      >
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ color: brandPrimary, fontSize: titleFontSize }}>
            {props.selectedShop ? props.selectedShop.name : null}
          </Text>
          <View style={ styles.headerContainer}>
            <Text style={{ color: brandPrimary, paddingRight: 15 }}>
              {moment().format('DD MMM YYYY')}
            </Text>
            <Icon
              name='calendar'
              type='simple-line-icon'
              size={20}
              color={brandPrimary}
            />
          </View>
          <View style={{ paddingHorizontal: 20, width: '100%' }}>
            <View style={styles.ratingContainer}>
              <StarRating
                emptyStar={'ios-star-outline'}
                fullStar={'ios-star'}
                iconSet={'Ionicons'}
                maxStars={5}
                starSize={30}
                starStyle={{ paddingHorizontal: 12 }}
                halfStarEnabled={false}
                selectedStar={(rating) => props.inputHandler(rating, 'ratingScore')}
                rating={props.item.ratingScore}
                fullStarColor={brandWarning}
              />
            </View>
            <View style={{ backgroundColor: brandLight }}>
              <TextInput
                multiline
                style={{ color: textColor, minHeight: 100, padding: 10 }}
                numberOfLines={6}
                textAlignVertical={'top'}
                value={props.item.reviewContent}
                placeholder={i18n.t('booking.review.addYourCommentsHere')}
                placeholderTextColor={textDarkColor}
                returnKeyType='done'
                onChangeText={(value) => props.inputHandler(value, 'reviewContent')}
                underlineColorAndroid='transparent'
              />
            </View>
          </View>
          <OutlineButton onPress={props.onSubmit}
            title={i18n.t('global.submit').toUpperCase()}
            containerStyle={{ width: 150 }}
          />
        </View>
      </KeyboardAwareScrollView>
    </Popup>
  );
}

const styles = StyleSheet.create({
  buttonStyle: {
    width: '100%'
  },
  buttonTitle: {
    color: brandPrimary,
    padding: 25
  },
  headerContainer: {
    justifyContent: 'flex-end', 
    alignItems: 'center', 
    flexDirection: 'row', 
    width: '100%', 
    marginBottom: 10, 
    paddingRight: 20
  },
  ratingContainer: {
    padding: 10,
    marginBottom: 15,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: brandLight
  },
  selectTitle: {
    color: brandPrimary,
    paddingLeft: 15,
    paddingBottom: 10,
    alignSelf: 'flex-start'
  }
});

export default reviewForm;
