
import React from 'react'
import StarRating from 'react-native-star-rating'
import { ScrollView, StyleSheet, TouchableOpacity, TextInput, View, Alert, Text } from 'react-native'
import { brandPrimary, textDarkColor, brandWarning } from '../../config/variables'
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
        { text: i18n.t('review.addYourReview'), onPress: () => { } },
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
      <View style={{ paddingTop: 20 }}>
        <ScrollView scrollEnabled={this.state.scrollEnabled}>
          <View style={styles.lineBottom}>
            <Text style={[styles.textHeadline, { textAlign: 'center' }]}>{itemRating.building_name}</Text>
            <View style={{ padding: 15 }}>
              <StarRating
                emptyStar={'ios-star-outline'}
                fullStar={'ios-star'}
                iconSet={'Ionicons'}
                maxStars={5}
                starSize={34}
                starStyle={{ paddingHorizontal: 12 }}
                halfStarEnabled={false}
                selectedStar={(rating) => this.inputHandler(rating, 'rate_number')}
                rating={rating.rate_number}
                fullStarColor={brandWarning}
              />
            </View>
            <Text style={[styles.textContent, { textAlign: 'center', marginVertical: 10, }]}>{question}</Text>
            <View style={{ marginVertical: 5, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
              {['Văn phòng', 'Tiện ích', 'Dịch vụ', 'Tư vấn', 'An ninh', 'Quản lý'].map((item, index) => {
                const selected = rating.rate_tag.search(item) > -1 ? true : false
                return (
                  <TouchableOpacity key={index}
                    style={[selected ? styles.buttonBg : styles.button]}
                    onPress={() => { this._onDirectionChange(item) }}>
                    <Text style={selected ? styles.buttonBgText : styles.buttonText}>{item}</Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          </View>
          <View style={styles.lineBottom}>
            <Text style={styles.textTitle}>{i18n.t('review.addYourCommentsHere')}</Text>
            <TextInput
              multiline
              style={[styles.textContent, { maxHeight: 100, minHeight: 90 }]}
              numberOfLines={3}
              textAlignVertical={'top'}
              returnKeyType='done'
              placeholderTextColor={textDarkColor}
              value={rating.rate_comment}
              onChangeText={(value) => this.inputHandler(value, 'rate_comment')}
              underlineColorAndroid='transparent'
            />
          </View>
        </ScrollView>
        <View style={{ flexDirection: 'row', justifyContent: 'center', paddingHorizontal: 10, paddingBottom: 10 }}>
          <TouchableOpacity style={[styles.buttonBg, { flex: 1 }]}
            onPress={this._onRatingSubmit}>
            <Text style={[styles.buttonBgText, { fontSize: 20 }]}>{i18n.t('global.ok').toUpperCase()}</Text>
          </TouchableOpacity>
        </View>
      </View >
    )
  }
}

const styles = StyleSheet.create({
  lineBottom: {
    borderBottomColor: '#AAAAAA',
    borderBottomWidth: 0.5,
    marginBottom: 10,
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
  textHeadline: {
    fontSize: 24,
    lineHeight: 40,
    fontWeight: '700',
    color: '#0D3D74',
  },
  textTitle: {
    color: textDarkColor,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 30,
  },
  textContent: {
    color: textDarkColor,
    fontSize: 18,
    fontWeight: '300',
    lineHeight: 30,
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

