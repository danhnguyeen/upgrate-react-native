import React from 'react';
import StarRating from 'react-native-star-rating';
import { ScrollView, StyleSheet, TouchableOpacity, View, Alert, Text, KeyboardAvoidingView } from 'react-native';
import { Textarea, Content } from 'native-base';

import { Modal, Button } from '../common';
import { RatingSuggestion } from '../booking';
import { brandPrimary, textDarkColor, brandWarning, brandLight, fontSize, DEVICE_WIDTH, platform } from '../../config/variables'
import i18n from '../../i18n'
export default class BookingRating extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isFetching: false,
      rating: {
        rate_tag: '',
        rate_comment: null,
        rate_number: 0,
      }
    }
  }
  componentDidMount() {
    console.log(this.props.itemRating);
  }
  _onRatingSubmit = () => {
    this.setState({ isFetching: true })
    const { itemRating } = this.props
    const rating = { ...this.state.rating }
    const dataRating = {
      appointment_id: itemRating.appointment_id,
      rate_number: rating.rate_number,
      rate_comment: rating.rate_tag + `${rating.rate_comment}`,
      rating_number: rating.rate_number,
      rating_comment: rating.rate_tag + `${rating.rate_comment}`,
    }
    if (dataRating.rating_number > 0) {
      this.props.onRatingSubmit(dataRating)
    }
    else {
      Alert.alert(i18n.t('review.pleaseAddYourRating'), null, [
        { text: i18n.t('global.cancel'), onPress: this.props.onRequestClose },
        { text: i18n.t('review.rating'), onPress: () => { } },
      ])
    }
  }
  inputHandler = (value, key) => {
    const rating = { ...this.state.rating }
    rating[key] = value
    this.setState({ rating })
  }
  _onDirectionChange(value) {
    const rating = { ...this.state.rating }
    const exitValue = rating.rate_tag.search(value) > -1 ? true : false
    if (exitValue) {
      rating.rate_tag = rating.rate_tag.replace(`${value}, `, '')
    }
    else {
      rating.rate_tag = rating.rate_tag + `${value}, `
    }
    this.setState({ rating })
  }
  render() {
    const { itemRating } = this.props
    const { rating } = this.state
    let question =
      rating.rate_number < 3 ? 'Bạn cảm thấy điều gì cần thay đổi ?'
        : rating.rate_number < 5 ? 'Bạn cảm thấy điều gì chưa tốt ?'
          : i18n.t('review.great')

    return (
      <Modal
        title={i18n.t('review.rating')}
        visible={this.props.modalVisible}
        onRequestClose={this.props.onRequestClose} >
        <Content style={{ backgroundColor: brandLight, flex: 1, padding: 20 }}>
          <View style={styles.lineBottom}>
            <Text style={[styles.textHeadline, { textAlign: 'center' }]}>{itemRating.building_name}</Text>
            <View style={{ padding: 15, paddingHorizontal: 30 }}>
              <StarRating
                emptyStar={'ios-star-outline'}
                fullStar={'ios-star'}
                iconSet={'Ionicons'}
                maxStars={5}
                starSize={38}
                starStyle={{ paddingHorizontal: 8 }}
                halfStarEnabled={false}
                selectedStar={(rating) => this.inputHandler(rating, 'rate_number')}
                rating={rating.rate_number}
                fullStarColor={brandWarning}
              />
            </View>
            <Text style={[styles.textContent, { textAlign: 'center', marginVertical: 10, }]}>{question}</Text>
            <View style={{ marginVertical: 5, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
              {['Văn phòng', 'Tiện ích', 'Dịch vụ', 'Tư vấn', 'An ninh', 'Quản lý'].map((item, index) => {
                const selected = rating.rate_tag.search(item) > -1 ? true : false
                return (
                  <RatingSuggestion key={item}
                    title={item}
                    selected={selected}
                    onPress={() => { this._onDirectionChange(item) }}
                  />
                )
              })}
            </View>
          </View>
          <View style={styles.lineBottom}>
            <Text style={{ marginBottom: 5 }}>{i18n.t('review.addYourCommentsHere')}</Text>
            <Textarea
              rowSpan={5}
              bordered
              onChangeText={(value) => this.inputHandler(value, 'rate_comment')}
              value={rating.rate_comment}
            />
          </View>
          <View style={{ justifyContent: 'center', paddingHorizontal: 10, alignItems: 'center', marginBottom: 20 }}>
            <Button
              buttonStyle={{ width: DEVICE_WIDTH - 50 }}
              title={i18n.t('global.ok').toUpperCase()}
              onPress={this._onRatingSubmit}
            />
          </View>
        </Content>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  lineBottom: {
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  textHeadline: {
    fontSize: 24,
    lineHeight: 40,
    fontWeight: '700',
    color: '#0D3D74',
  },
  textContent: {
    lineHeight: 30,
    fontSize: fontSize + 1
  },
  button: {
    borderWidth: 1,
    borderColor: '#C7DDF6',
    borderRadius: 2,
    padding: 5,
    paddingHorizontal: 10,
    margin: 5,
  },
  buttonText: {
    color: brandPrimary,
    textAlign: 'center'
  },
  buttonBg: {
    backgroundColor: brandPrimary,
    borderRadius: 2,
    padding: 5,
    paddingHorizontal: 10,
    margin: 5,
  },
  buttonBgText: {
    color: '#FFF',
    textAlign: 'center'
  },
})

