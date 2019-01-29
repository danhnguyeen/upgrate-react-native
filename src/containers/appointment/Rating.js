import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, Image } from 'react-native';
import { connect } from 'react-redux';
import { Divider } from 'react-native-elements';
import { Icon, Content, Textarea } from 'native-base';
import StarRating from 'react-native-star-rating';

import { RatingSuggestion } from '../../components/booking';
import { Button } from '../../components/common';
import Logo from '../../assets/images/icon.png';
import {
  DEVICE_WIDTH,
  fontSize,
  inverseTextColor,
  brandWarning,
  brandLight,
  brandPrimary
} from "../../config/variables";
import i18n from "../../i18n";
import axios from '../../config/axios';

let _this = null;
class Rating extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: i18n.t('review.rating'),
      headerLeft: (
        <TouchableOpacity onPress={() => _this._ratingLater()}
          style={{ paddingHorizontal: 10, alignItems: 'center' }}>
          <Icon
            name={"ios-arrow-back"}
            style={{ color: inverseTextColor, fontSize: 34 }}
            underlayColor='transparent'
          />
        </TouchableOpacity>
      )
    };
  };
  state = {
    saving: false,
    itemRating: null,
    rating: {
      rate_tag: '',
      rate_comment: '',
      rate_number: 0,
    }
  }
  componentDidMount() {
    _this = this;
    this.setState({ itemRating: this.props.navigation.getParam('itemRating', {}) });
  }
  _ratingLater = () => {
    console.log('rate later')
    axios.post('appointment/update-flg-skip', { appointment_id: this.state.itemRating.appointment_id });
    this.props.navigation.goBack(null);
  }
  _onRatingSubmit = async () => {
    const { itemRating } = this.state;
    const rating = { ...this.state.rating };
    if (!rating.rate_number) {
      Alert.alert(i18n.t('global.error'),
        i18n.t('review.pleaseAddYourRating')
      );
      return;
    }
    if (rating.rate_number < 4 && !rating.rate_tag && !rating.rate_comment) {
      Alert.alert(i18n.t('review.pleaseLetUsKnow'),
        i18n.t('review.whatNeedsToChange')
      );
      return;
    }
    try {
      const dataRating = {
        appointment_id: itemRating.appointment_id,
        rate_comment: rating.rate_tag + `${rating.rate_comment}`,
        rating_number: rating.rate_number,
        rating_comment: rating.rate_tag + `${rating.rate_comment}`,
      };
      this.setState({ saving: true });
      await axios.post(`appointment/rating?appointment_id=${dataRating.appointment_id}`, dataRating);
      this.setState({ saving: false });
      Alert.alert(
        i18n.t('global.notification'),
        i18n.t('review.sentSuccessfully'),
        [{
          text: i18n.t('global.ok'),
          onPress: () => this.props.navigation.goBack(null)
        }]);
    } catch (error) {
      this.setState({ saving: false });
      Alert.alert(i18n.t('global.error'),
        error.message
      );
    }
  }
  inputHandler = (value, key) => {
    const rating = { ...this.state.rating }
    rating[key] = value;
    this.setState({ rating });
  }
  _onDirectionChange(value) {
    const rating = { ...this.state.rating }
    const exitValue = rating.rate_tag.search(value) > -1 ? true : false
    if (exitValue) {
      rating.rate_tag = rating.rate_tag.replace(`${value}, `, '')
    } else {
      rating.rate_tag = rating.rate_tag + `${value}, `
    }
    this.setState({ rating })
  }
  render() {
    const itemRating = this.state.itemRating || {};
    const { rating } = this.state
    const question = rating.rate_number < 5 ? i18n.t('review.whatNeedsToChange') : i18n.t('review.great');
    return (
      <Content style={{ backgroundColor: brandLight, flex: 1, padding: 20 }}>
        <View style={styles.lineBottom}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={Logo} style={{ width: 80, height: 80 }} />
            <View style={{ justifyContent: 'center', marginLeft: 10 }}>
              <Text style={styles.textHeadline}>{itemRating.building_name}</Text>
              <Text>{itemRating.office_name}</Text>
            </View>
          </View>
          <Divider style={{ marginVertical: 15 }} />
          <Text style={{ fontSize: fontSize + 1, textAlign: 'center' }}>{i18n.t('review.yourAppointmentHasBeenCompleted')}</Text>
          <Text style={{ fontSize: fontSize + 1, textAlign: 'center' }}>{i18n.t('review.ratingTitle')}</Text>
          <View style={{ padding: 20, paddingHorizontal: 30 }}>
            <StarRating
              emptyStar={'ios-star-outline'}
              fullStar={'ios-star'}
              iconSet={'Ionicons'}
              maxStars={5}
              starSize={40}
              starStyle={{ paddingHorizontal: 6 }}
              halfStarEnabled={false}
              selectedStar={(rating) => this.inputHandler(rating, 'rate_number')}
              rating={rating.rate_number}
              fullStarColor={brandWarning}
            />
          </View>
          <Text style={styles.textContent}>{question}</Text>
          <View style={{ marginVertical: 5, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
            {['Văn phòng', 'Tiện ích', 'Dịch vụ', 'Tư vấn', 'An ninh', 'Quản lý'].map((item) => {
              const selected = rating.rate_tag.search(item) > -1 ? true : false
              return (
                <RatingSuggestion key={item}
                  title={item}
                  loading={this.state.saving}
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
    );
  }
}

const styles = StyleSheet.create({
  lineBottom: {
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  textHeadline: {
    fontSize: 20,
    marginBottom: 5,
    fontWeight: 'bold',
    color: brandPrimary
  },
  textContent: {
    fontSize: fontSize + 1,
    textAlign: 'center',
    marginBottom: 15
  }
});

const mapStateToProps = state => ({
  user: state.auth.user
});

const mapDispatchToProps = dispatch => ({
  // fetchNotificationCount: (customer_id) => dispatch(actions.fetchNotificationCount(customer_id))
});


export default connect(mapStateToProps, mapDispatchToProps)(Rating);
