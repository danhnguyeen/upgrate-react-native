import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TextInput,
  Image,
  TouchableOpacity
} from 'react-native';
import { Divider } from 'react-native-elements';
import StarRating from 'react-native-star-rating';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import { OutlineButton, KeyboardScrollView } from '../../components/common';
import { SuggestionItem } from '../../components/QRCode';
import { fontSize, textColor, textDarkColor, brandLight, brandWarning, brandDark } from "../../config/variables";
import i18n from '../../i18n';
import axios from '../../config/axios-mylife';

let _this = null;
class Review extends Component {
  static navigationOptions = () => {
    return {
      title: i18n.t('review.review'),
      headerLeft: (
        <TouchableOpacity onPress={() => _this.closeReview()}
          style={{ paddingHorizontal: 20, alignItems: 'center' }}>
          <Icon
            name={"ios-arrow-back"}
            size={28}
            color={textColor}
            underlayColor='transparent'
          />
        </TouchableOpacity>
      )
    };
  };
  state = {
    saving: false,
    item: {
      ratingScore: this.props.navigation.getParam('rating', 5),
      reviewContent: '',
      entityType: 4
    },
    commands: {},
    billData: this.props.navigation.getParam('billData', {})
  }
  componentDidMount() {
    _this = this;
    this.props.navigation.addListener('willBlur', () => {
      this.skipReview();
    });
  }
  onSubmit = async () => {
    try {
      this.setState({ saving: true });
      const data = { ...this.state.item };
      const criteria = [];
      for (let key in this.state.commands) {
        if (this.state.commands[key]) {
          criteria.push(key);
        }
      }
      if (data.ratingScore <= 3 && !data.reviewContent && !criteria.length) {
        this.setState({ saving: false });
        return Alert.alert(
          i18n.t('review.pleaseLetUsKnow'),
          i18n.t('review.whatNeedsToChange'),
          [{
            text: i18n.t('global.ok')
          }]);
      }
      data.reviewContent = {
        Criteria: criteria,
        Content: this.state.item.reviewContent
      };
      if (this.state.billData.info) {
        data.branchID = this.state.billData.info.retkId;
      } else {
        data.billCode = this.state.billData.billCode;
        data.branchID = 0;
      }
      data.reviewContent = JSON.stringify(data.reviewContent);
      await axios.post('user/review/submit', data);
      this.setState({ saving: false });
      Alert.alert(
        i18n.t('global.notification'),
        i18n.t('review.sentSuccessfully'),
        [{
          text: i18n.t('global.ok'),
          onPress: () => this.closeReview()
        }],
        { cancelable: false }
        );
    } catch (error) {
      this.setState({ saving: false });
      Alert.alert(i18n.t('global.error'), error.message || error.msg);
    }
  }
  closeReview = () => {
    this.props.navigation.goBack(null);
  }
  skipReview = () => {
    const data = { ...this.state.item };
    if (this.state.billData.info) {
      data.branchID = this.state.billData.info.retkId;
    } else {
      data.billCode = this.state.billData.billCode;
      data.branchID = 0;
    }
    data.ratingScore = 9;
    data.reviewContent = JSON.stringify({ Criteria: [], Content: ""});
    axios.post('user/review/submit', data);
  }
  inputHandler = (value, key) => {
    const item = { ...this.state.item };
    item[key] = value;
    this.setState({ item });
  };
  selectCommandHandler = (value) => {
    const commands = { ...this.state.commands };
    commands[value] = !commands[value];
    this.setState({ commands });
  }

  render() {
    const { branch } = this.state.billData;
    return (
      <View style={styles.container}>
        <KeyboardScrollView
          style={{ width: '100%' }}
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 15, paddingVertical: 10 }}
        >
          <View style={styles.brachName}>
            <Image source={{ uri: branch.bimageUrl }} style={{ width: 50, height: 50 }} />
            <View style={{ flex: 1, marginLeft: 15 }}>
              <Text style={{ fontWeight: 'bold', fontSize: fontSize + 2 }}>{branch.bname}</Text>
              <Text>{branch.badd}</Text>
            </View>
          </View>
          <View style={styles.reviewContainer}>
            <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: fontSize + 2, textAlign: 'center' }}>{i18n.t('review.reviewTitle')}</Text>
              <View style={styles.ratingContainer}>
                <StarRating
                  emptyStar={'ios-star-outline'}
                  fullStar={'ios-star'}
                  iconSet={'Ionicons'}
                  maxStars={5}
                  starSize={36}
                  starStyle={{ paddingHorizontal: 12 }}
                  halfStarEnabled={false}
                  selectedStar={(rating) => this.inputHandler(rating, 'ratingScore')}
                  rating={this.state.item.ratingScore}
                  fullStarColor={brandWarning}
                />
              </View>
            </View>
            <Divider style={{ backgroundColor: brandDark }} />
            <View style={{ paddingVertical: 15 }}>
              <Text style={{ fontSize: fontSize + 2, textAlign: 'center', marginBottom: 10 }}>
                {i18n.t('review.whatNeedsToChange')}
              </Text>
              <View style={styles.suggestionContainer}>
                <SuggestionItem
                  title={i18n.t('review.Space')}
                  commands={this.state.commands}
                  onPress={this.selectCommandHandler}
                />
                <SuggestionItem
                  title={i18n.t('review.Services')}
                  commands={this.state.commands}
                  onPress={this.selectCommandHandler}
                />
              </View>
              <View style={styles.suggestionContainer}>
                <SuggestionItem
                  title={i18n.t('review.Drink')}
                  commands={this.state.commands}
                  onPress={this.selectCommandHandler}
                />
                <SuggestionItem
                  title={i18n.t('review.Food')}
                  commands={this.state.commands}
                  onPress={this.selectCommandHandler}
                />
                <SuggestionItem
                  title={i18n.t('review.Wifi')}
                  commands={this.state.commands}
                  onPress={this.selectCommandHandler}
                />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                multiline
                style={{ color: textColor, minHeight: 100, width: '100%' }}
                numberOfLines={6}
                textAlignVertical={'top'}
                value={this.state.item.reviewContent}
                placeholder={i18n.t('booking.review.addYourCommentsHere')}
                placeholderTextColor={textDarkColor}
                returnKeyType='done'
                onChangeText={(value) => this.inputHandler(value, 'reviewContent')}
                underlineColorAndroid='transparent'
              />
            </View>
            <View style={{ alignItems: 'center' }}>
              <OutlineButton
                loading={this.state.saving}
                onPress={this.onSubmit}
                title={i18n.t('global.send').toUpperCase()}
                buttonStyle={{ marginBottom: 0 }}
                containerStyle={{ width: 150 }}
              />
            </View>
          </View>
        </KeyboardScrollView>
        </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: brandDark
  },
  reviewContainer: {
    backgroundColor: brandLight,
    borderRadius: 5,
    padding: 15
  },
  ratingContainer: {
    marginVertical: 20,
  },
  inputContainer: {
    backgroundColor: brandDark,
    paddingVertical: 10,
    paddingHorizontal: 15
  },
  suggestionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  brachName: {
    flexDirection: 'row',
    minHeight: 80,
    backgroundColor: brandLight,
    borderRadius: 5,
    marginBottom: 10,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
});

const mapStateToProps = state => {
  return {
    user: state.auth.user
  }
};

export default connect(mapStateToProps)(Review);
