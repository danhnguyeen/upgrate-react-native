import React, { Component } from 'react';
import { FlatList, View, StyleSheet, Alert } from 'react-native';

import axios from '../../../../config/axios-mylife';
import i18n from '../../../../i18n';
import { ReviewItem } from '../../../../components/BookTable/Review';
import { Spinner } from '../../../../components/common';
import {
  brandLight,
  brandSuccess,
  titleFontSize
} from '../../../../config/variables';

class MyReviews extends Component {
  state = {
    reviews: [],
    isRender: false,
    isVisibleReview: false,
    loading: true,
    isFetching: false,
    item: {
      ratingScore: 0,
      reviewContent: ''
    },
    page: 1,
    size: 20,
    totalPage: null
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.isRender !== this.state.isRender
      || nextState.isVisibleReview !== this.state.isVisibleReview
      || (nextProps.focused && nextProps.reviewFocused)) {
      return true;
    }
    return false;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedShop.bid !== this.props.selectedShop.bid) {
      this.setState({ reviews: [], isRender: !this.state.isRender, page: 1, loading: true });
    }
  }
  componentDidUpdate (prevProps) {
    if (this.props.focused && this.props.reviewFocused 
      && this.state.loading 
      && (!prevProps.reviewFocused || !prevProps.focused)
      || (!prevProps.user && this.props.user && this.props.reviewFocused && this.props.focused)) {
      this.fetchReview(this.props.selectedShop);
    }
  }
  fetchReview = async (selectedShop, isLoadMore) => {
    if (isLoadMore && this.state.page > this.state.totalPage) {
      return;
    }
    const prevState = { ...this.state };
    if (!isLoadMore) {
      prevState.page = 1;
    }
    this.setState({ isFetching: true, page: prevState.page + 1 });
    try {
      const shop = selectedShop ? selectedShop : this.props.selectedShop;
      const { result } = await axios.post(`business/review/list?branchId=${shop.bid}&userId=${this.props.user.id}&page=${prevState.page}&itemPerPage=${prevState.size}`);
      this.setState({
        totalPage: result.PAGING[0].totalPage,
        reviews: isLoadMore ? [...this.state.reviews, ...result.CONTAIN] : result.CONTAIN,
        isRender: !this.state.isRender,
        isFetching: false,
        loading: false
      });
    } catch (error) {
      this.setState({ isFetching: false });
    }
  }

  saveReviewHandler = async () => {
    if (!this.state.item.ratingScore) {
      return Alert.alert(i18n.t('booking.review.pleaseAddYourRating'));
    }
    try {
      this.reviewModalHandler();
      const data = { ...this.state.item };
      data.branchId = this.props.selectedShop.bid;
      data.userId = this.props.user.id;
      await axios.post('user/review/submit', data);
      this.setState({
        item: {
          ratingScore: 0,
          reviewContent: ''
        }
      });
      this.fetchReview();
      this.props.getReviewSummary(true);
    } catch (error) {
      Alert.alert(i18n.t('global.error'), error.msg);
    }
  }

  _renderItem = ({ item }) => (
    <ReviewItem review={item} />
  );

  reviewModalHandler = () => {
    this.setState(prevState => {
      return { isVisibleReview: !prevState.isVisibleReview }
    });
  };

  inputHandler = (value, key) => {
    const item = { ...this.state.item };
    item[key] = value;
    this.setState(prevState => ({ item, isRender: !prevState.isRender }));
  };

  render() {
    if (!this.props.user) {
      return null;
    }
    return (
      <View style={{ flex: 1 }}>
        {
          this.state.loading ? <Spinner /> :
            <FlatList
              onRefresh={() => this.fetchReview()}
              refreshing={this.state.isFetching}
              keyExtractor={(item) => item.Id.toString()}
              data={this.state.reviews}
              renderItem={this._renderItem}
              onEndReached={() => this.fetchReview(null, true)}
              onEndReachedThreshold={0.5}
            />
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    height: 60,
    backgroundColor: brandLight,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonStyle: {
    borderColor: brandSuccess,
    minWidth: 150,
    // height: 40
  },
  buttonTitle: {
    color: brandSuccess,
    fontSize: titleFontSize
  }
});
export default MyReviews;
