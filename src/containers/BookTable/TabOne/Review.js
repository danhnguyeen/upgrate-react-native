import * as React from 'react';
import { connect } from 'react-redux';
import {
  View,
  Animated,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  LayoutAnimation
} from 'react-native';
import { TabView } from 'react-native-tab-view';

import {
  brandLight,
  brandDark,
  DEVICE_WIDTH
} from '../../../config/variables';
import { AllReivews, MyReviews } from './TabReview';
import { ReviewSummary } from '../../../components/BookTable/Review';
import i18n from '../../../i18n';
import axios from '../../../config/axios-mylife';

class Review extends React.Component {
  state = {
    index: 0,
    routes: [
      { key: 'all_reviews', title: i18n.t('booking.review.allReviews') },
      { key: 'my_reviews', title: i18n.t('booking.review.myReviews') },
    ],
    refreshAllReview: false,
    summary: {}
  };

  handleIndexChange = (index) => {
    this.setState({ index });
  };
  shouldComponentUpdate(nextProps) {
    if (nextProps.reviewFocused
      || nextProps.reviewFocused !== this.props.reviewFocused) {
      return true;
    }
    return false;
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedShop.bid !== this.props.selectedShop.bid) {
      this.setState({ summary: {} });
    }
  }
  componentDidUpdate (prevProps) {
    if (this.props.reviewFocused && !prevProps.reviewFocused) {
      this.getReviewSummary();
    }
  }
  // componentWillMount() {
  //   LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
  // }
  getReviewSummary = async (isNewRating) => {
    if (isNewRating) {
      this.setState({ refreshAllReview: true });
    }
    const summary = await axios.get(`business/review/summary?branchId=${this.props.selectedShop.bid}`);
    this.setState({ summary });
  }
  resetRefreshAllReview = () => {
    this.setState({ refreshAllReview: false });
  }
  renderTabBar = props => {
    const inputRange = props.navigationState.routes.map((x, i) => i);
    return (
      <View style={styles.tabBar}>
        {props.navigationState.routes.map((route, i) => {
          const color = props.position.interpolate({
            inputRange,
            outputRange: inputRange.map(
              inputIndex => (inputIndex === i ? brandLight : brandDark)
            ),
          });
          return (
            <TouchableWithoutFeedback
              key={`tab_review_${i}`}
              onPress={() => this.setState({ index: i })}
            >
              <Animated.View
                key={`tab_review_${i}`}
                style={[
                  { backgroundColor: color },
                  {
                    width: (DEVICE_WIDTH / 2),
                    height: 40,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }]}
              >
                <Text>{route.title}</Text>
              </Animated.View>
            </TouchableWithoutFeedback>
          );
        })}
      </View>
    );
  };

  renderScene = ({ route }) => {
    switch (route.key) {
      case 'all_reviews':
        return (
          <AllReivews
            token={this.props.token}
            selectedShop={this.props.selectedShop}
            reviewFocused={this.props.reviewFocused}
            refreshAllReview={this.state.refreshAllReview}
            stopRefreshAllReview={this.resetRefreshAllReview}
            focused={this.state.index === 0} />
        );
      case 'my_reviews':
        return (
          <MyReviews
            user={this.props.user}
            token={this.props.token}
            getReviewSummary={this.getReviewSummary}
            selectedShop={this.props.selectedShop}
            reviewFocused={this.props.reviewFocused}
            focused={this.state.index === 1} />
        );
      default:
        return null;
      }
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <ReviewSummary data={this.state.summary} />
        <TabView
          navigationState={this.state}
          renderScene={this.renderScene}
          renderTabBar={this.renderTabBar}
          onIndexChange={this.handleIndexChange}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: brandDark,
    justifyContent: 'center',
    marginTop: 10
  },
  tabItem: {
    alignItems: 'center',
  },
});

const mapStateToProps = state => ({
  token: state.auth.token,
  user: state.auth.user
});

export default connect(mapStateToProps)(Review);

